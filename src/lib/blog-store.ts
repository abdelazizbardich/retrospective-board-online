import { nanoid } from "nanoid";
import { getSupabase } from "./db";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML from rich-text editor
  author: string;
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
    coverImage: row.cover_image,
    tags: row.tags,
    metaDescription: row.meta_description,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── CRUD ───────────────────────────────────────────────────────────────────

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
