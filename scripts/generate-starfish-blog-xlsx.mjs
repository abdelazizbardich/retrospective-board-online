import * as XLSX from "xlsx";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("Missing frontmatter");
  const meta = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }
  return { meta, content: match[2].trim() };
}

const raw = readFileSync(
  join(__dirname, "bulk-blog-posts", "starfish-retrospective-online-guide.md"),
  "utf8"
);
const { meta, content } = parseFrontmatter(raw);

const rows = [
  [
    "title",
    "slug",
    "excerpt",
    "content",
    "author",
    "category",
    "coverImage",
    "tags",
    "metaDescription",
    "published",
  ],
  [
    meta.title,
    meta.slug,
    meta.excerpt,
    content,
    meta.author || "SprintsPlans",
    meta.category,
    meta.coverImage,
    meta.tags,
    meta.metaDescription,
    meta.published || "TRUE",
  ],
];

const ws = XLSX.utils.aoa_to_sheet(rows);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Posts");
const outPath = join(__dirname, "..", "starfish-retrospective-online-guide.xlsx");
XLSX.writeFile(wb, outPath);
console.log(`Wrote ${outPath}`);
