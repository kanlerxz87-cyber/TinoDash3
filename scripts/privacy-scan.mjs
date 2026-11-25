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

// These values and names are intentionally prohibited in public artifacts. Add newly discovered
// identifiers before publishing; keep the private evidence set outside the repository.
const prohibited = [
  { label: "Property A postal identifier", pattern: /\b95014\b/g },
  { label: "Property B postal identifier", pattern: /\b94122\b/g },
  { label: "Exact Property A valuation", pattern: /\$?3[,]?100[,]?000\b/g },
  { label: "Exact Property B valuation", pattern: /\$?1[,]?800[,]?000\b/g },
  { label: "Exact reported rental amount", pattern: /\$?7[,]?150\b/g },
  { label: "Property A city identifier", pattern: /\bCupertino\b/gi }
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
