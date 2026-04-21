import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts, createBlogPost } from "@/lib/blog-store";
import { requireAdmin } from "@/app/api/admin/auth/route";

/** Returns null if the request is authorized (admin session OR API key), or an error response. */
function authorize(request: NextRequest): NextResponse | null {
  // API key path: Authorization: Bearer <BLOG_API_KEY>
  const apiKey = process.env.BLOG_API_KEY;
  if (apiKey) {
    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (bearer === apiKey) return null;
  }
  // Fallback: admin session cookie
  return requireAdmin(request);
}

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const posts = await getAllBlogPosts(true); // include unpublished for admin list
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const authError = authorize(request);
  if (authError) return authError;

  const body = await request.json();
  const { title, slug, excerpt, content, author, coverImage, tags, metaDescription, published } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "title, slug and content are required" }, { status: 400 });
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return NextResponse.json(
      { error: "Slug must be lowercase letters, numbers and hyphens only" },
      { status: 400 }
    );
  }

  try {
    const post = await createBlogPost({
      title: String(title).trim().slice(0, 200),
      slug: String(slug).trim().slice(0, 100),
      excerpt: String(excerpt ?? "").trim().slice(0, 500),
      content: String(content).slice(0, 100000),
      author: String(author ?? "").trim().slice(0, 100),
      coverImage: String(coverImage ?? "").trim().slice(0, 500),
      tags: String(tags ?? "").trim().slice(0, 300),
      metaDescription: String(metaDescription ?? "").trim().slice(0, 300),
      published: published === true,
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    if (err?.message?.includes("UNIQUE") || err?.code === "23505") {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }
    throw error;
  }
}
