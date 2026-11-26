import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const root = process.cwd();
const include = [".html", ".js", ".mjs", ".css", ".md", ".json", ".txt", ".svg", ".xml", ".yml", ".yaml"];
const excludedDirectories = new Set([".git", "node_modules", "private", "reports"]);
const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excludedDirectories.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (path.relative(root, full) === path.join("scripts", "privacy-scan.mjs")) continue; // the scanner lists the names it blocks
    if (entry.isDirectory()) walk(full);
    else if (include.includes(path.extname(entry.name))) files.push(full);
  }
}
walk(root);

// Use generic patterns so this public scanner does not itself publish household identifiers.
// Keep any known private values in the command runner / encrypted evidence system, not in Git.
const prohibited = [
  { label: "Five-digit postal-like identifier", pattern: /(?<![#A-Fa-f0-9])\d{5}(?:-\d{4})?(?![A-Fa-f0-9])/g },
  { label: "Email address", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  // Case-specific place names of Property A and Property B (T-023). Labels only: never echo the matched text.
  { label: "Property A city name", pattern: /\bCupertino\b/gi },
  { label: "Property B neighbourhood name", pattern: /\b(?:Outer\s+)?Sunset\b/g },
  { label: "Third-party insurance-quote site", pattern: /\bgethome\w*quotes|\binsurancequotes\.com/gi },
  { label: "North-American phone-like identifier", pattern: /(?<!\d)(?:\+?1[ .-]?)?(?:\(\d{3}\)|\d{3})[ .-]\d{3}[ .-]\d{4}(?!\d)/g }
];

const hits = [];
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  for (const rule of prohibited) {
    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(content)) !== null) {
      const line = content.slice(0, match.index).split("\n").length;
      // Never echo the matched value: CI logs and Pages artifacts can themselves be public.
      hits.push(`${path.relative(root, file)}:${line} — ${rule.label}`);
      if (match.index === rule.pattern.lastIndex) rule.pattern.lastIndex += 1;
    }
  }
}


// Private digest check (T-022): if the gitignored private/privacy-terms.js exists, every
// number, word and five-digit token in every public text file is hashed and compared.
// Only digests are stored, so no household value or place name is written to Git or logs.
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
let privateTerms = null;
try {
  const require = createRequire(import.meta.url);
  privateTerms = require(path.join(root, "private/privacy-terms.js"));
} catch (e) {
  privateTerms = null;
}
if (privateTerms) {
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const rel = path.relative(root, file);
    const seen = new Set();
    for (const token of content.match(/\d{1,3}(?:,\d{3})+|\d{4,}/g) || []) {
      const d = token.replace(/,/g, "");
      if (privateTerms.forbiddenNumberDigests.has(sha(d))) seen.add(`household figure in ${rel}`);
    }
    for (const w of (content.toLowerCase().match(/[a-z]+/g) || [])) {
      if (privateTerms.forbiddenWordDigests.has(sha(w))) seen.add(`place name in ${rel}`);
    }
    for (const token of content.match(/(?<![\d,])\d{5}(?![\d,])/g) || []) {
      if (privateTerms.forbiddenPostalDigests.has(sha(token))) seen.add(`postal code in ${rel}`);
    }
    for (const label of seen) hits.push(label + " (private digest match)");
  }
}

if (hits.length) {
  console.error("Privacy scan failed. Remove or generalize the following public identifiers:\n" + hits.join("\n"));
  process.exit(1);
}
console.log(`Privacy scan passed for ${files.length} text files. Generic patterns are incomplete; private evidence and human review are still required.`);
