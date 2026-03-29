import { nanoid } from "nanoid";
import { supabase } from "./supabase";

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

// ── Row ↔ domain converters ────────────────────────────────────────────────

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
  let q = supabase.from("pages").select("*").order("created_at", { ascending: false });
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(rowToPage);
}

export async function getPage(slug: string): Promise<Page | undefined> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToPage(data) : undefined;
}

export async function createPage(data: Omit<Page, "id" | "createdAt" | "updatedAt">): Promise<Page> {
  const id = nanoid(8);
  const now = Date.now();
  const { data: inserted, error } = await supabase
    .from("pages")
    .insert({
      id,
      slug: data.slug,
      title: data.title,
      content: data.content,
      meta_description: data.metaDescription,
      published: data.published,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToPage(inserted);
}

export async function updatePage(
  slug: string,
  patch: Partial<Omit<Page, "id" | "createdAt">>
): Promise<Page | undefined> {
  const dbPatch: Record<string, unknown> = { updated_at: Date.now() };
  if (patch.slug !== undefined)            dbPatch.slug             = patch.slug;
  if (patch.title !== undefined)           dbPatch.title            = patch.title;
  if (patch.content !== undefined)         dbPatch.content          = patch.content;
  if (patch.metaDescription !== undefined) dbPatch.meta_description = patch.metaDescription;
  if (patch.published !== undefined)       dbPatch.published        = patch.published;

  const { data, error } = await supabase
    .from("pages")
    .update(dbPatch)
    .eq("slug", slug)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? rowToPage(data) : undefined;
}

export async function deletePage(slug: string): Promise<boolean> {
  const { error, count } = await supabase
    .from("pages")
    .delete({ count: "exact" })
    .eq("slug", slug);
  if (error) throw error;
  return (count ?? 0) > 0;
}
