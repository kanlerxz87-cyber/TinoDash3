import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const include = [".html", ".js", ".css", ".md", ".json"];
const excludedDirectories = new Set([".git", "node_modules", "private"]);
const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excludedDirectories.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (include.includes(path.extname(entry.name)) && !full.endsWith(path.join("scripts", "privacy-scan.mjs"))) files.push(full);
  }
}
walk(root);

// Use generic patterns so this public scanner does not itself publish household identifiers.
// Keep any known private values in the command runner / encrypted evidence system, not in Git.
const prohibited = [
  { label: "Five-digit postal-like identifier", pattern: /(?<![#A-Fa-f0-9])\d{5}(?:-\d{4})?(?![A-Fa-f0-9])/g },
  { label: "Email address", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
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
      hits.push(`${path.relative(root, file)}:${line} — ${rule.label} (${match[0]})`);
      if (match.index === rule.pattern.lastIndex) rule.pattern.lastIndex += 1;
    }
  }
}

if (hits.length) {
  console.error("Privacy scan failed. Remove or generalize the following public identifiers:\n" + hits.join("\n"));
  process.exit(1);
}
console.log(`Privacy scan passed for ${files.length} text files. No prohibited household identifiers found.`);
