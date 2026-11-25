import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith(".html")).sort();
const errors = [];

const contentByFile = new Map(htmlFiles.map((file) => [file, fs.readFileSync(path.join(root, file), "utf8")]));

function error(file, message) { errors.push(`${file}: ${message}`); }
function localTarget(fromFile, href) {
  const [pathname, hash] = href.split("#");
  if (!pathname || pathname === "") return { file: fromFile, hash };
  if (pathname.startsWith("/")) return { file: pathname.replace(/^\//, ""), hash };
  return { file: path.normalize(path.join(path.dirname(fromFile), pathname)), hash };
}

for (const [file, html] of contentByFile) {
  if (!/<title>[^<]+<\/title>/i.test(html)) error(file, "missing non-empty title");
  if (!/data-site-header/.test(html) || !/data-site-footer/.test(html)) error(file, "missing shared header or footer slot");
  if (!/<main\b[^>]*id=["']main["']/i.test(html)) error(file, "missing main#main landmark");

  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) error(file, `duplicate ids: ${[...new Set(duplicates)].join(", ")}`);

  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1].replace(/&amp;/g, "&");
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
    const target = localTarget(file, href);
    const targetHtml = contentByFile.get(target.file);
    if (!targetHtml) {
      error(file, `broken local link: ${href}`);
      continue;
    }
    if (target.hash && !new RegExp(`\\bid=["']${target.hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(targetHtml)) {
      error(file, `broken anchor: ${href}`);
    }
  }

  const sourceTables = [...html.matchAll(/<table\b[^>]*\bdata-source-table\b[^>]*>[\s\S]*?<\/table>/gi)];
  for (const tableMatch of sourceTables) {
    const rows = [...tableMatch[0].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
    rows.forEach((row, index) => {
      if (/<th\b/i.test(row[1])) return;
      if (!/<a\b[^>]*href=/i.test(row[1])) error(file, `source table row ${index + 1} has no source / method link`);
    });
  }
}

if (errors.length) {
  console.error(`Static site check failed with ${errors.length} issue(s):\n${errors.join("\n")}`);
  process.exit(1);
}
console.log(`Static site check passed: ${htmlFiles.length} pages, local links and source-table rows validated.`);
