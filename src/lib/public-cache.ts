import { revalidatePath, revalidateTag } from "next/cache";

/** ISR / data-cache window for public marketing and blog HTML. */
export const PUBLIC_CACHE_REVALIDATE_SECONDS = 3600;

export const CACHE_TAGS = {
  blog: "blog",
  pages: "cms-pages",
  nav: "nav-links",
} as const;

export function revalidateBlogCache() {
  revalidateTag(CACHE_TAGS.blog, "max");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export function revalidatePagesCache() {
  revalidateTag(CACHE_TAGS.pages, "max");
  revalidatePath("/p/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export function revalidateNavCache() {
  revalidateTag(CACHE_TAGS.nav, "max");
  revalidatePath("/", "layout");
}
