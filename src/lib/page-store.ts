import { nanoid } from "nanoid";
import { getClient, ensureSchema } from "./db";
import type { Row } from "@libsql/client";

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

function rowToPage(row: Row): Page {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    content: row.content as string,
    metaDescription: row.meta_description as string,
    published: row.published === 1,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
  };
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export async function getAllPages(includeUnpublished = false): Promise<Page[]> {
  await ensureSchema();
  const sql = includeUnpublished
    ? "SELECT * FROM pages ORDER BY created_at DESC"
    : "SELECT * FROM pages WHERE published = 1 ORDER BY created_at DESC";
  const result = await getClient().execute({ sql, args: [] });
  return result.rows.map(rowToPage);
}

export async function getPage(slug: string): Promise<Page | undefined> {
  await ensureSchema();
  const result = await getClient().execute({
    sql: "SELECT * FROM pages WHERE slug = ?",
    args: [slug],
  });
  const row = result.rows[0];
  return row ? rowToPage(row) : undefined;
}

export async function createPage(data: Omit<Page, "id" | "createdAt" | "updatedAt">): Promise<Page> {
  await ensureSchema();
  const id = nanoid(8);
  const now = Date.now();
  await getClient().execute({
    sql: `INSERT INTO pages (id, slug, title, content, meta_description, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.slug, data.title, data.content, data.metaDescription, data.published ? 1 : 0, now, now],
  });

  return {
    id,
    slug: data.slug,
    title: data.title,
    content: data.content,
    metaDescription: data.metaDescription,
    published: data.published,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updatePage(
  slug: string,
  patch: Partial<Omit<Page, "id" | "createdAt">>
): Promise<Page | undefined> {
  const sets: string[] = ["updated_at = ?"];
  const values: (string | number)[] = [Date.now()];

  if (patch.slug !== undefined)            { sets.push("slug = ?");             values.push(patch.slug); }
  if (patch.title !== undefined)           { sets.push("title = ?");            values.push(patch.title); }
  if (patch.content !== undefined)         { sets.push("content = ?");          values.push(patch.content); }
  if (patch.metaDescription !== undefined) { sets.push("meta_description = ?"); values.push(patch.metaDescription); }
  if (patch.published !== undefined)       { sets.push("published = ?");        values.push(patch.published ? 1 : 0); }

  values.push(slug);
  await getClient().execute({
    sql: `UPDATE pages SET ${sets.join(", ")} WHERE slug = ?`,
    args: values,
  });

  const newSlug = patch.slug ?? slug;
  return getPage(newSlug);
}

export async function deletePage(slug: string): Promise<boolean> {
  const result = await getClient().execute({
    sql: "DELETE FROM pages WHERE slug = ?",
    args: [slug],
  });
  return result.rowsAffected > 0;
}
