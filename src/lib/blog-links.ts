export function blogCategoryHref(category: string) {
  return `/blog/search?category=${encodeURIComponent(category)}`;
}

export function blogTagHref(tag: string) {
  return `/blog/search?tag=${encodeURIComponent(tag)}`;
}

export function blogSearchHref(
  filters: { category?: string; tag?: string; q?: string },
  page = 1
) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.q) params.set("q", filters.q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog/search?${query}` : "/blog/search";
}
