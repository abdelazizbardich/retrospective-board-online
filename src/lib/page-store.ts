import { nanoid } from "nanoid";
import { db } from "./db";

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
  published: number; // SQLite stores booleans as 0/1
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
    published: row.published === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export async function getAllPages(includeUnpublished = false): Promise<Page[]> {
  const rows = includeUnpublished
    ? (db.prepare("SELECT * FROM pages ORDER BY created_at DESC").all() as PageRow[])
    : (db
        .prepare("SELECT * FROM pages WHERE published = 1 ORDER BY created_at DESC")
        .all() as PageRow[]);
  return rows.map(rowToPage);
}

export async function getPage(slug: string): Promise<Page | undefined> {
  const row = db.prepare("SELECT * FROM pages WHERE slug = ?").get(slug) as
    | PageRow
    | undefined;
  return row ? rowToPage(row) : undefined;
}

export async function createPage(data: Omit<Page, "id" | "createdAt" | "updatedAt">): Promise<Page> {
  const id = nanoid(8);
  const now = Date.now();
  db.prepare(
    `INSERT INTO pages (id, slug, title, content, meta_description, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.slug, data.title, data.content, data.metaDescription, data.published ? 1 : 0, now, now);

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
  const values: unknown[] = [Date.now()];

  if (patch.slug !== undefined)            { sets.push("slug = ?");             values.push(patch.slug); }
  if (patch.title !== undefined)           { sets.push("title = ?");            values.push(patch.title); }
  if (patch.content !== undefined)         { sets.push("content = ?");          values.push(patch.content); }
  if (patch.metaDescription !== undefined) { sets.push("meta_description = ?"); values.push(patch.metaDescription); }
  if (patch.published !== undefined)       { sets.push("published = ?");        values.push(patch.published ? 1 : 0); }

  values.push(slug);
  db.prepare(`UPDATE pages SET ${sets.join(", ")} WHERE slug = ?`).run(...values);

  const newSlug = patch.slug ?? slug;
  return getPage(newSlug);
}

export async function deletePage(slug: string): Promise<boolean> {
  const result = db.prepare("DELETE FROM pages WHERE slug = ?").run(slug);
  return result.changes > 0;
}
