import { nanoid } from "nanoid";
import { getSupabase } from "./db";

export interface BlogCategory {
  id: string;
  name: string;
  createdAt: number;
}

type BlogCategoryRow = {
  id: string;
  name: string;
  created_at: number;
};

function rowToCategory(row: BlogCategoryRow): BlogCategory {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
  };
}

export async function getAllBlogCategories(): Promise<BlogCategory[]> {
  const { data, error } = await getSupabase()
    .from("blog_categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToCategory);
}

export async function createBlogCategory(name: string): Promise<BlogCategory> {
  const id = nanoid(8);
  const now = Date.now();
  const trimmed = name.trim();

  const { error } = await getSupabase().from("blog_categories").insert({
    id,
    name: trimmed,
    created_at: now,
  });

  if (error) throw new Error(error.message);
  return { id, name: trimmed, createdAt: now };
}

export async function updateBlogCategory(
  id: string,
  name: string
): Promise<BlogCategory | undefined> {
  const trimmed = name.trim();
  const { error } = await getSupabase()
    .from("blog_categories")
    .update({ name: trimmed })
    .eq("id", id);

  if (error) throw new Error(error.message);

  const { data } = await getSupabase()
    .from("blog_categories")
    .select("*")
    .eq("id", id)
    .single();

  return data ? rowToCategory(data) : undefined;
}

export async function deleteBlogCategory(id: string): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("blog_categories")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}
