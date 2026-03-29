import { nanoid } from "nanoid";
import { supabase } from "./supabase";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  author: string;
  coverEmoji: string;
  coverImage: string; // URL — empty string means use emoji fallback
  publishedAt: number;
  published: boolean;
  tags: string[];
}

// ── Row ↔ domain converters ────────────────────────────────────────────────

type BlogRow = {
  id: string; slug: string; title: string; excerpt: string; content: string;
  author: string; cover_emoji: string; cover_image: string;
  published_at: number; published: boolean; tags: string[];
};

function rowToPost(row: BlogRow): BlogPost {
  return {
    id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt,
    content: row.content, author: row.author,
    coverEmoji: row.cover_emoji, coverImage: row.cover_image,
    publishedAt: row.published_at, published: row.published, tags: row.tags,
  };
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export async function getAllPosts(includeUnpublished = false): Promise<BlogPost[]> {
  let q = supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(rowToPost);
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabase
    .from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? rowToPost(data) : undefined;
}

export async function createPost(data: Omit<BlogPost, "id">): Promise<BlogPost> {
  const id = nanoid(8);
  const { data: inserted, error } = await supabase
    .from("blog_posts")
    .insert({
      id, slug: data.slug, title: data.title, excerpt: data.excerpt,
      content: data.content, author: data.author,
      cover_emoji: data.coverEmoji, cover_image: data.coverImage,
      published_at: data.publishedAt, published: data.published, tags: data.tags,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToPost(inserted);
}

export async function updatePost(
  slug: string,
  patch: Partial<BlogPost>
): Promise<BlogPost | undefined> {
  const dbPatch: Record<string, unknown> = {};
  if (patch.slug !== undefined)        dbPatch.slug         = patch.slug;
  if (patch.title !== undefined)       dbPatch.title        = patch.title;
  if (patch.excerpt !== undefined)     dbPatch.excerpt      = patch.excerpt;
  if (patch.content !== undefined)     dbPatch.content      = patch.content;
  if (patch.author !== undefined)      dbPatch.author       = patch.author;
  if (patch.coverEmoji !== undefined)  dbPatch.cover_emoji  = patch.coverEmoji;
  if (patch.coverImage !== undefined)  dbPatch.cover_image  = patch.coverImage;
  if (patch.published !== undefined)   dbPatch.published    = patch.published;
  if (patch.publishedAt !== undefined) dbPatch.published_at = patch.publishedAt;
  if (patch.tags !== undefined)        dbPatch.tags         = patch.tags;

  const { data, error } = await supabase
    .from("blog_posts").update(dbPatch).eq("slug", slug).select().maybeSingle();
  if (error) throw error;
  return data ? rowToPost(data) : undefined;
}

export async function deletePost(slug: string): Promise<boolean> {
  const { error, count } = await supabase
    .from("blog_posts").delete({ count: "exact" }).eq("slug", slug);
  if (error) throw error;
  return (count ?? 0) > 0;
}
