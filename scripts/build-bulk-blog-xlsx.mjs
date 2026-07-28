import * as XLSX from "xlsx";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, "bulk-blog-posts");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("Missing frontmatter");
  const meta = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }
  return { meta, content: match[2].trim() };
}

const files = readdirSync(postsDir)
  .filter((f) => f.endsWith(".md"))
  .sort();

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
];

for (const file of files) {
  const raw = readFileSync(join(postsDir, file), "utf8");
  const { meta, content } = parseFrontmatter(raw);
  rows.push([
    meta.title,
    meta.slug,
    meta.excerpt,
    content,
    meta.author || "SprintsPlans",
    meta.category,
    meta.coverImage || `https://sprintsplans.com/images/blog/${meta.slug}.jpg`,
    meta.tags,
    meta.metaDescription,
    "FALSE",
  ]);
}

if (rows.length - 1 !== 30) {
  console.error(`Expected 30 posts, found ${rows.length - 1}`);
  process.exit(1);
}

const ws = XLSX.utils.aoa_to_sheet(rows);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Posts");
const outPath = join(__dirname, "..", "sprintsplans-30-blog-posts.xlsx");
XLSX.writeFile(wb, outPath);
console.log(`Wrote ${outPath} with ${rows.length - 1} posts`);
