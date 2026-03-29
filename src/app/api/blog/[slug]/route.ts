import { NextRequest, NextResponse } from "next/server";
import { getPost, updatePost, deletePost } from "@/lib/blog-store";
import { requireAdmin } from "@/app/api/admin/auth/route";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const updated = await updatePost(slug, {
    ...(body.title !== undefined     && { title:      String(body.title).trim().slice(0, 200) }),
    ...(body.slug !== undefined      && { slug:       String(body.slug).trim().slice(0, 100) }),
    ...(body.excerpt !== undefined   && { excerpt:    String(body.excerpt).trim().slice(0, 500) }),
    ...(body.content !== undefined   && { content:    String(body.content).slice(0, 20000) }),
    ...(body.author !== undefined    && { author:     String(body.author).trim().slice(0, 100) }),
    ...(body.coverEmoji !== undefined && { coverEmoji: String(body.coverEmoji).slice(0, 4) }),
    ...(body.coverImage !== undefined && { coverImage: String(body.coverImage).slice(0, 500) }),
    ...(body.published !== undefined && { published:  body.published === true }),
    ...(body.tags !== undefined      && { tags:       Array.isArray(body.tags) ? body.tags.map(String).slice(0, 10) : [] }),
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  const existed = await deletePost(slug);
  if (!existed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
