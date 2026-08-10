/** Extract the first image URL from markdown content. */
export function extractFirstImageFromMarkdown(markdown: string): string {
  const mdMatch = markdown.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  if (mdMatch?.[1]) return mdMatch[1].trim();

  const htmlMatch = markdown.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (htmlMatch?.[1]) return htmlMatch[1].trim();

  return "";
}

/** Extract the first image URL from HTML content. */
export function extractFirstImageFromHtml(html: string): string {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1]?.trim() ?? "";
}

export function blogThumbnailUrl(slug: string, title: string, category = ""): string {
  const params = new URLSearchParams({ title });
  if (category.trim()) params.set("category", category.trim());
  return `/api/blog/thumbnail/${encodeURIComponent(slug)}?${params.toString()}`;
}

/** Local import paths that point to files not shipped with the app. */
export function isPhantomLocalCoverPath(url: string): boolean {
  const normalized = url.trim().replace(/^\.\//, "");
  return normalized.startsWith("/images/blog/") || normalized.startsWith("images/blog/");
}

export function resolveCoverImage(options: {
  coverImage?: string;
  rawContent?: string;
  htmlContent?: string;
  slug: string;
  title: string;
  category?: string;
}): string {
  const explicit = (options.coverImage ?? "").trim();
  if (explicit && !isPhantomLocalCoverPath(explicit)) return explicit.slice(0, 500);

  if (options.rawContent) {
    const fromMarkdown = extractFirstImageFromMarkdown(options.rawContent);
    if (fromMarkdown) return fromMarkdown.slice(0, 500);
  }

  if (options.htmlContent) {
    const fromHtml = extractFirstImageFromHtml(options.htmlContent);
    if (fromHtml) return fromHtml.slice(0, 500);
  }

  return blogThumbnailUrl(options.slug, options.title, options.category).slice(0, 500);
}

export function getPostCoverImage(post: {
  slug: string;
  title: string;
  category?: string;
  coverImage?: string;
  content?: string;
}): string {
  return resolveCoverImage({
    coverImage: post.coverImage,
    htmlContent: post.content,
    slug: post.slug,
    title: post.title,
    category: post.category,
  });
}

export function getPostCoverImageAlt(post: {
  title: string;
  coverImageAlt?: string;
}): string {
  const alt = (post.coverImageAlt ?? "").trim();
  return alt || post.title;
}
