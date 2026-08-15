/** Allow relative paths and http(s) URLs only — reject javascript:, data:, etc. */
export function isSafeHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed || trimmed.length > 500) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Allow https images, same-origin paths, and known blob/thumbnail hosts. */
export function isSafeImageUrl(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed || trimmed.length > 2000) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return false;
    if (url.hostname.endsWith(".public.blob.vercel-storage.com")) return true;
    if (url.hostname === "images.unsplash.com") return true;
    // Same site / relative API thumbnails resolved absolute
    return true;
  } catch {
    return false;
  }
}
