import { nanoid } from "nanoid";
import { getSupabase } from "./db";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML from rich-text editor
  author: string;
  category: string;
  coverImage: string;
  tags: string; // comma-separated
  metaDescription: string;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

// ── Row → domain converter ─────────────────────────────────────────────────

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  cover_image: string;
  tags: string;
  meta_description: string;
  published: boolean;
  created_at: number;
  updated_at: number;
};

function rowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    category: row.category ?? "",
    coverImage: row.cover_image,
    tags: row.tags,
    metaDescription: row.meta_description,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export const BLOG_POSTS_PER_PAGE = 9;

export interface BlogPostsPage {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BlogPostsFilter {
  category?: string;
  tag?: string;
  q?: string;
}

function postHasTag(post: BlogPost, tag: string): boolean {
  const normalized = tag.trim().toLowerCase();
  return parseTags(post.tags).includes(normalized);
}

function postMatchesCategory(post: BlogPost, category: string): boolean {
  return post.category.trim().toLowerCase() === category.trim().toLowerCase();
}

function postMatchesQuery(post: BlogPost, q: string): boolean {
  const normalized = q.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [post.title, post.excerpt, post.category, post.tags]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export async function getBlogPostsFiltered(
  filters: BlogPostsFilter,
  page = 1,
  pageSize = BLOG_POSTS_PER_PAGE,
  includeUnpublished = false
): Promise<BlogPostsPage> {
  const category = filters.category?.trim();
  const tag = filters.tag?.trim();
  const q = filters.q?.trim();
  const safePage = Math.max(1, Math.floor(page) || 1);

  if (category && !tag && !q) {
    let query = getSupabase()
      .from("blog_posts")
      .select("*", { count: "exact" })
      .ilike("category", category)
      .order("created_at", { ascending: false });

    if (!includeUnpublished) {
      query = query.eq("published", true);
    }

    const from = (safePage - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) throw new Error(error.message);

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      posts: (data ?? []).map(rowToPost),
      total,
      page: Math.min(safePage, totalPages),
      pageSize,
      totalPages,
    };
  }

  let posts = await getAllBlogPosts(includeUnpublished);

  if (category) {
    posts = posts.filter((post) => postMatchesCategory(post, category));
  }
  if (tag) {
    posts = posts.filter((post) => postHasTag(post, tag));
  }
  if (q) {
    posts = posts.filter((post) => postMatchesQuery(post, q));
  }

  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = (safePage - 1) * pageSize;

  return {
    posts: posts.slice(from, from + pageSize),
    total,
    page: Math.min(safePage, totalPages),
    pageSize,
    totalPages,
  };
}

export async function getBlogPostsPage(
  page = 1,
  pageSize = BLOG_POSTS_PER_PAGE,
  includeUnpublished = false
): Promise<BlogPostsPage> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = getSupabase()
    .from("blog_posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    posts: (data ?? []).map(rowToPost),
    total,
    page: Math.min(safePage, totalPages),
    pageSize,
    totalPages,
  };
}

export async function getAllBlogPosts(includeUnpublished = false): Promise<BlogPost[]> {
  let query = getSupabase()
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToPost);
}

function parseTags(tags: string): string[] {
  return tags
    ? tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    : [];
}

export async function getRelatedBlogPosts(
  post: BlogPost,
  limit = 3
): Promise<BlogPost[]> {
  const postTags = new Set(parseTags(post.tags));
  const postCategory = post.category.trim().toLowerCase();

  const candidates = (await getAllBlogPosts(false)).filter(
    (p) => p.slug !== post.slug
  );

  const scored = candidates.map((candidate) => {
    let score = 0;
    if (postCategory && candidate.category.trim().toLowerCase() === postCategory) {
      score += 2;
    }
    for (const tag of parseTags(candidate.tags)) {
      if (postTags.has(tag)) score += 1;
    }
    return { post: candidate, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.post.createdAt - a.post.createdAt;
  });

  const related = scored
    .filter((entry) => entry.score > 0)
    .slice(0, limit)
    .map((entry) => entry.post);

  if (related.length < limit) {
    const relatedSlugs = new Set(related.map((p) => p.slug));
    for (const candidate of candidates) {
      if (related.length >= limit) break;
      if (!relatedSlugs.has(candidate.slug)) {
        related.push(candidate);
        relatedSlugs.add(candidate.slug);
      }
    }
  }

  return related;
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return undefined;
    throw new Error(error.message);
  }
  return rowToPost(data);
}

export async function createBlogPost(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<BlogPost> {
  const id = nanoid(8);
  const now = Date.now();

  const { error } = await getSupabase().from("blog_posts").insert({
    id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author,
    category: data.category,
    cover_image: data.coverImage,
    tags: data.tags,
    meta_description: data.metaDescription,
    published: data.published,
    created_at: now,
    updated_at: now,
  });

  if (error) throw new Error(error.message);
  return { id, ...data, createdAt: now, updatedAt: now };
}

export async function updateBlogPost(
  slug: string,
  patch: Partial<Omit<BlogPost, "id" | "createdAt">>
): Promise<BlogPost | undefined> {
  const updates: Record<string, unknown> = { updated_at: Date.now() };

  if (patch.slug !== undefined)            updates.slug             = patch.slug;
  if (patch.title !== undefined)           updates.title            = patch.title;
  if (patch.excerpt !== undefined)         updates.excerpt          = patch.excerpt;
  if (patch.content !== undefined)         updates.content          = patch.content;
  if (patch.author !== undefined)          updates.author           = patch.author;
  if (patch.category !== undefined)        updates.category         = patch.category;
  if (patch.coverImage !== undefined)      updates.cover_image      = patch.coverImage;
  if (patch.tags !== undefined)            updates.tags             = patch.tags;
  if (patch.metaDescription !== undefined) updates.meta_description = patch.metaDescription;
  if (patch.published !== undefined)       updates.published        = patch.published;

  const { error } = await getSupabase().from("blog_posts").update(updates).eq("slug", slug);
  if (error) throw new Error(error.message);

  const newSlug = patch.slug ?? slug;
  return getBlogPost(newSlug);
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("blog_posts")
    .delete({ count: "exact" })
    .eq("slug", slug);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function deleteBlogPosts(slugs: string[]): Promise<number> {
  if (slugs.length === 0) return 0;

  const { error, count } = await getSupabase()
    .from("blog_posts")
    .delete({ count: "exact" })
    .in("slug", slugs);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function updateBlogPostsPublished(slugs: string[], published: boolean): Promise<number> {
  if (slugs.length === 0) return 0;

  const { error, count } = await getSupabase()
    .from("blog_posts")
    .update({ published, updated_at: Date.now() }, { count: "exact" })
    .in("slug", slugs);

  if (error) throw new Error(error.message);
  return count ?? 0;
}
