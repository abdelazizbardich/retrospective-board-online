import { NextRequest, NextResponse } from "next/server";
import { createBlogPost, getBlogPost, getAllBlogPosts } from "@/lib/blog-store";
import { createBlogCategory, getAllBlogCategories } from "@/lib/blog-category-store";
import { applyImportPostLinks } from "@/lib/import-blog";
import { resolveCoverImage } from "@/lib/blog-thumbnail";
import { requireAdmin } from "@/app/api/admin/auth/route";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ImportRow = {
  title?: unknown;
  slug?: unknown;
  excerpt?: unknown;
  content?: unknown;
  author?: unknown;
  category?: unknown;
  coverImage?: unknown;
  tags?: unknown;
  metaDescription?: unknown;
  published?: unknown;
};

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const posts = Array.isArray(body.posts) ? (body.posts as ImportRow[]) : null;

  if (!posts || posts.length === 0) {
    return NextResponse.json({ error: "posts array is required" }, { status: 400 });
  }
  if (posts.length > 200) {
    return NextResponse.json({ error: "Maximum 200 posts per import" }, { status: 400 });
  }

  const existingCategories = await getAllBlogCategories();
  const categoryNames = new Set(existingCategories.map((c) => c.name.toLowerCase()));

  const existingPosts = await getAllBlogPosts(true);
  const linkTargets = [
    ...existingPosts.map((p) => ({ title: p.title, slug: p.slug })),
    ...posts.map((p) => ({
      title: String(p.title ?? "").trim(),
      slug: String(p.slug ?? "").trim(),
    })),
  ];

  const created: string[] = [];
  const skipped: { slug: string; reason: string }[] = [];
  const errors: { row: number; reason: string }[] = [];

  for (let i = 0; i < posts.length; i++) {
    const row = posts[i];
    const title = String(row.title ?? "").trim().slice(0, 200);
    const slug = String(row.slug ?? "").trim().slice(0, 100);
    const rawContent = String(row.content ?? "").slice(0, 100000);
    const content = applyImportPostLinks(rawContent, linkTargets, slug);
    const category = String(row.category ?? "").trim().slice(0, 100);
    const coverImage = resolveCoverImage({
      coverImage: String(row.coverImage ?? ""),
      htmlContent: rawContent,
      slug,
      title,
      category,
    });

    if (!title || !slug || !content) {
      errors.push({ row: i + 1, reason: "title, slug and content are required" });
      continue;
    }
    if (!SLUG_REGEX.test(slug)) {
      errors.push({ row: i + 1, reason: `Invalid slug "${slug}"` });
      continue;
    }

    const existing = await getBlogPost(slug);
    if (existing) {
      skipped.push({ slug, reason: "slug already exists" });
      continue;
    }

    if (category && !categoryNames.has(category.toLowerCase())) {
      try {
        await createBlogCategory(category);
        categoryNames.add(category.toLowerCase());
      } catch {
        // Unique race or other error — continue; post still stores the name
      }
    }

    try {
      await createBlogPost({
        title,
        slug,
        excerpt: String(row.excerpt ?? "").trim().slice(0, 500),
        content,
        author: String(row.author ?? "").trim().slice(0, 100),
        category,
        coverImage,
        tags: String(row.tags ?? "").trim().slice(0, 300),
        metaDescription: String(row.metaDescription ?? "").trim().slice(0, 300),
        published: row.published === true,
        scheduledAt: null,
      });
      created.push(slug);
    } catch (error: unknown) {
      const err = error as { message?: string; code?: string };
      if (err?.message?.includes("UNIQUE") || err?.code === "23505") {
        skipped.push({ slug, reason: "slug already exists" });
      } else {
        errors.push({ row: i + 1, reason: err?.message ?? "Failed to create post" });
      }
    }
  }

  return NextResponse.json({
    created: created.length,
    skipped: skipped.length,
    errors: errors.length,
    details: { created, skipped, errors },
  });
}
