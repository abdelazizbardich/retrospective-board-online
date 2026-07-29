import { marked } from "marked";
import { SITE_NAME, SITE_URL } from "./config";
import { resolveCoverImage } from "./blog-thumbnail";

export interface ImportedBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  coverImage: string;
  tags: string;
  metaDescription: string;
  focusKeyword: string;
  published: boolean;
}

const HEADER_ALIASES: Record<keyof Omit<ImportedBlogPost, "published">, string[]> = {
  title: ["title", "post title", "name"],
  slug: ["slug", "url", "permalink"],
  excerpt: ["excerpt", "summary", "description"],
  content: ["content", "body", "html", "post"],
  author: ["author", "writer", "by"],
  category: ["category", "categories"],
  coverImage: ["coverimage", "cover_image", "cover image", "image", "cover"],
  tags: ["tags", "tag", "keywords"],
  metaDescription: ["metadescription", "meta_description", "meta description", "seo", "seo description"],
  focusKeyword: [
    "focus keyword",
    "focus_keyword",
    "focuskeyword",
    "seo focus keyword",
    "primary keyword",
    "target keyword",
    "focus key word",
  ],
};

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, " ");
}

function cellString(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

/** Convert markdown (or plain text) to HTML. Leaves existing HTML unchanged. */
export function textToHtml(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";

  // Already HTML from a rich-text export — keep as-is
  if (/<(?:p|h[1-6]|ul|ol|li|div|br|strong|em|a)\b/i.test(trimmed)) {
    return trimmed;
  }

  const html = marked.parse(trimmed, {
    async: false,
    gfm: true,
    breaks: false,
  }) as string;

  return html.trim();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 100);
}

export interface LinkTarget {
  title: string;
  slug: string;
}

const SKIP_LINK_TAGS = new Set(["a", "pre", "code", "script", "style", "h1", "h2", "h3", "h4", "h5", "h6"]);
const MIN_TITLE_LENGTH = 12;
const MAX_LINKS_PER_POST = 8;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function transformHtmlTextNodes(html: string, transform: (text: string) => string): string {
  let insideSkip = 0;
  const tokens = html.split(/(<[^>]+>)/g);

  return tokens
    .map((token) => {
      if (token.startsWith("<")) {
        const openMatch = token.match(/^<([a-z0-9]+)/i);
        const closeMatch = token.match(/^<\/([a-z0-9]+)/i);
        if (openMatch && SKIP_LINK_TAGS.has(openMatch[1].toLowerCase()) && !token.endsWith("/>")) {
          insideSkip++;
        } else if (closeMatch && SKIP_LINK_TAGS.has(closeMatch[1].toLowerCase())) {
          insideSkip = Math.max(0, insideSkip - 1);
        }
        return token;
      }

      if (insideSkip > 0) return token;
      return transform(token);
    })
    .join("");
}

/** Link mentions of other post titles inside HTML (skips existing links, code blocks, headings). */
export function applyInternalLinksToHtml(
  html: string,
  targets: LinkTarget[],
  currentSlug: string
): string {
  const ordered = targets
    .filter((t) => t.slug !== currentSlug && t.title.trim().length >= MIN_TITLE_LENGTH)
    .sort((a, b) => b.title.length - a.title.length);

  if (ordered.length === 0) return html;

  const linkedSlugs = new Set<string>();

  return transformHtmlTextNodes(html, (text) => {
    if (linkedSlugs.size >= MAX_LINKS_PER_POST) return text;

    let result = text;
    for (const target of ordered) {
      if (linkedSlugs.size >= MAX_LINKS_PER_POST) break;
      if (linkedSlugs.has(target.slug)) continue;

      const regex = new RegExp(`\\b(${escapeRegex(target.title)})\\b`, "i");
      if (!regex.test(result)) continue;

      result = result.replace(
        regex,
        `<a href="/blog/${target.slug}" class="internal-link">$1</a>`
      );
      linkedSlugs.add(target.slug);
    }
    return result;
  });
}

/** Link brand keyword mentions to the main site (import only). */
export function applyBrandLinksToHtml(html: string): string {
  const regex = new RegExp(`\\b(${escapeRegex(SITE_NAME)})\\b`, "gi");

  return transformHtmlTextNodes(html, (text) =>
    text.replace(regex, `<a href="${SITE_URL}" class="brand-link">$1</a>`)
  );
}

/** Apply all automatic content links used during import. */
export function applyImportPostLinks(
  html: string,
  targets: LinkTarget[],
  currentSlug: string
): string {
  return applyBrandLinksToHtml(applyInternalLinksToHtml(html, targets, currentSlug));
}

function dedupeTargets(targets: LinkTarget[]): LinkTarget[] {
  const bySlug = new Map<string, LinkTarget>();
  for (const target of targets) {
    const slug = target.slug.trim();
    const title = target.title.trim();
    if (!slug || !title) continue;
    if (!bySlug.has(slug)) bySlug.set(slug, { slug, title });
  }
  return Array.from(bySlug.values());
}

/** Add internal links across a batch of imported posts. */
export function applyInternalLinksToPosts(
  posts: ImportedBlogPost[],
  extraTargets: LinkTarget[] = []
): ImportedBlogPost[] {
  const targets = dedupeTargets([
    ...extraTargets,
    ...posts.map((p) => ({ title: p.title, slug: p.slug })),
  ]);

  return posts.map((post) => ({
    ...post,
    content: applyBrandLinksToHtml(
      applyInternalLinksToHtml(post.content, targets, post.slug)
    ),
  }));
}

function mapHeaders(headers: string[]): Partial<Record<keyof ImportedBlogPost, number>> {
  const map: Partial<Record<keyof ImportedBlogPost, number>> = {};
  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    for (const [field, aliases] of Object.entries(HEADER_ALIASES) as [keyof ImportedBlogPost, string[]][]) {
      if (map[field] !== undefined) continue;
      if (aliases.some((alias) => alias === normalized || alias.replace(/ /g, "") === normalized.replace(/ /g, ""))) {
        map[field] = index;
      }
    }
  });
  return map;
}

export async function parseBlogExcelFile(file: File): Promise<ImportedBlogPost[]> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(new Uint8Array(buffer), { type: "array" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return [];

  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: "" }) as unknown[][];
  if (rows.length < 2) return [];

  const headers = (rows[0] ?? []).map((h) => String(h ?? ""));
  const col = mapHeaders(headers);

  if (col.title === undefined || col.content === undefined) {
    throw new Error('Excel must include "title" and "content" columns');
  }

  const posts: ImportedBlogPost[] = [];
  const seenSlugs = new Set<string>();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const title = cellString(row[col.title]);
    const rawContent = cellString(row[col.content]);
    if (!title || !rawContent) continue;

    let slug = col.slug !== undefined ? cellString(row[col.slug]) : "";
    slug = slug ? slugify(slug) : slugify(title);
    if (!slug) continue;

    // Keep unique within this file
    let uniqueSlug = slug;
    let n = 2;
    while (seenSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${n++}`.slice(0, 100);
    }
    seenSlugs.add(uniqueSlug);

    const htmlContent = textToHtml(rawContent).slice(0, 100000);
    const category = (col.category !== undefined ? cellString(row[col.category]) : "").slice(0, 100);

    posts.push({
      title: title.slice(0, 200),
      slug: uniqueSlug,
      excerpt: (col.excerpt !== undefined ? cellString(row[col.excerpt]) : "").slice(0, 500),
      content: htmlContent,
      author: (col.author !== undefined ? cellString(row[col.author]) : "").slice(0, 100),
      category,
      coverImage: resolveCoverImage({
        coverImage: col.coverImage !== undefined ? cellString(row[col.coverImage]) : "",
        rawContent,
        htmlContent,
        slug: uniqueSlug,
        title: title.slice(0, 200),
        category,
      }),
      tags: (col.tags !== undefined ? cellString(row[col.tags]) : "").slice(0, 300),
      metaDescription: (col.metaDescription !== undefined ? cellString(row[col.metaDescription]) : "").slice(0, 300),
      focusKeyword: (col.focusKeyword !== undefined ? cellString(row[col.focusKeyword]) : "").slice(0, 100),
      published: false,
    });
  }

  return applyInternalLinksToPosts(posts);
}

export async function downloadBlogImportTemplate(): Promise<void> {
  const XLSX = await import("xlsx");
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
      "focusKeyword",
    ],
    [
      "How to Run a Great Retro",
      "how-to-run-a-great-retro",
      "A short summary for the listing page.",
      "Write your post body here.\n\nUse blank lines for paragraphs.",
      "Jane Doe",
      "Guides",
      "https://example.com/cover.jpg",
      "agile, retro, teams",
      "Learn how to facilitate effective sprint retrospectives.",
      "sprint retrospective",
    ],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Posts");
  XLSX.writeFile(wb, "blog-import-template.xlsx");
}
