import { nanoid } from "nanoid";
import { getSupabase } from "./db";

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string; // HTML from rich-text editor
  metaDescription: string;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

// ── Row → domain converter ─────────────────────────────────────────────────

type PageRow = {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  published: boolean;
  created_at: number;
  updated_at: number;
};

function rowToPage(row: PageRow): Page {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    metaDescription: row.meta_description,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export async function getAllPages(includeUnpublished = false): Promise<Page[]> {
  let query = getSupabase()
    .from("pages")
    .select("*")
    .order("created_at", { ascending: false });

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToPage);
}

export async function getPage(slug: string): Promise<Page | undefined> {
  const { data, error } = await getSupabase()
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return undefined;
    throw new Error(error.message);
  }
  return rowToPage(data);
}

export async function createPage(data: Omit<Page, "id" | "createdAt" | "updatedAt">): Promise<Page> {
  const id = nanoid(8);
  const now = Date.now();

  const { error } = await getSupabase().from("pages").insert({
    id,
    slug: data.slug,
    title: data.title,
    content: data.content,
    meta_description: data.metaDescription,
    published: data.published,
    created_at: now,
    updated_at: now,
  });

  if (error) throw new Error(error.message);
  return { id, ...data, createdAt: now, updatedAt: now };
}

export async function updatePage(
  slug: string,
  patch: Partial<Omit<Page, "id" | "createdAt">>
): Promise<Page | undefined> {
  const updates: Record<string, unknown> = { updated_at: Date.now() };

  if (patch.slug !== undefined)            updates.slug             = patch.slug;
  if (patch.title !== undefined)           updates.title            = patch.title;
  if (patch.content !== undefined)         updates.content          = patch.content;
  if (patch.metaDescription !== undefined) updates.meta_description = patch.metaDescription;
  if (patch.published !== undefined)       updates.published        = patch.published;

  const { error } = await getSupabase().from("pages").update(updates).eq("slug", slug);
  if (error) throw new Error(error.message);

  const newSlug = patch.slug ?? slug;
  return getPage(newSlug);
}

export async function deletePage(slug: string): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("pages")
    .delete({ count: "exact" })
    .eq("slug", slug);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

