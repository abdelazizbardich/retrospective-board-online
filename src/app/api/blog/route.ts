import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/blog-store";
import { requireAdmin } from "@/app/api/admin/auth/route";

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const { title, slug, excerpt, content, author, coverEmoji, published, tags } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "title, slug and content are required" }, { status: 400 });
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return NextResponse.json({ error: "Slug must be lowercase letters, numbers and hyphens only" }, { status: 400 });
  }

  const post = await createPost({
    title: String(title).trim().slice(0, 200),
    slug: String(slug).trim().slice(0, 100),
    excerpt: String(excerpt ?? "").trim().slice(0, 500),
    content: String(content).slice(0, 20000),
      author: String(author ?? "SprintsPlans Team").trim().slice(0, 100),
    coverEmoji: String(coverEmoji ?? "📝").slice(0, 4),
    coverImage: typeof body.coverImage === "string" ? body.coverImage.slice(0, 500) : "",
    published: published === true,
    publishedAt: Date.now(),
    tags: Array.isArray(tags) ? tags.map(String).slice(0, 10) : [],
  });

  return NextResponse.json(post, { status: 201 });
}
