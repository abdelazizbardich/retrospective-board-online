import { NextRequest, NextResponse } from "next/server";
import { getBlogPost, updateBlogPost, deleteBlogPost, resolveBlogPublishState } from "@/lib/blog-store";
import { requireAdmin } from "@/app/api/admin/auth/route";
import { parseSeoFieldsFromBody } from "@/lib/seo/api-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If post is not published, require admin auth
  if (!post.published) {
    const authError = requireAdmin(request);
    if (authError) return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();

  if (body.slug !== undefined) {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const newSlug = String(body.slug).trim();
    if (!slugRegex.test(newSlug)) {
      return NextResponse.json(
        { error: "Slug must be lowercase letters, numbers and hyphens only" },
        { status: 400 }
      );
    }
  }

  try {
    const hasPublishFields = body.published !== undefined || body.scheduledAt !== undefined;
    const publishState = hasPublishFields
      ? resolveBlogPublishState({
          published:
            body.published !== undefined ? body.published === true : post.published,
          scheduledAt:
            body.scheduledAt !== undefined
              ? body.scheduledAt == null
                ? null
                : Number(body.scheduledAt)
              : post.scheduledAt,
        })
      : null;

    if (
      body.scheduledAt != null &&
      publishState &&
      publishState.scheduledAt == null &&
      body.published !== true
    ) {
      return NextResponse.json(
        { error: "scheduledAt must be a future date and time" },
        { status: 400 }
      );
    }

    const updated = await updateBlogPost(slug, {
      ...(body.title !== undefined           && { title:           String(body.title).trim().slice(0, 200) }),
      ...(body.slug !== undefined            && { slug:            String(body.slug).trim().slice(0, 100) }),
      ...(body.excerpt !== undefined         && { excerpt:         String(body.excerpt).trim().slice(0, 500) }),
      ...(body.content !== undefined         && { content:         String(body.content).slice(0, 100000) }),
      ...(body.author !== undefined          && { author:          String(body.author).trim().slice(0, 100) }),
      ...(body.category !== undefined        && { category:        String(body.category).trim().slice(0, 100) }),
      ...(body.coverImage !== undefined      && { coverImage:      String(body.coverImage).trim().slice(0, 500) }),
      ...(body.coverImageAlt !== undefined   && { coverImageAlt:   String(body.coverImageAlt).trim().slice(0, 200) }),
      ...(body.tags !== undefined            && { tags:            String(body.tags).trim().slice(0, 300) }),
      ...(body.metaDescription !== undefined && { metaDescription: String(body.metaDescription).trim().slice(0, 300) }),
      ...parseSeoFieldsFromBody(body),
      ...(publishState && {
        published: publishState.published,
        scheduledAt: publishState.scheduledAt,
      }),
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    if (err?.message?.includes("UNIQUE") || err?.code === "23505") {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json(
      { error: err?.message ?? "Failed to save post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  const deleted = await deleteBlogPost(slug);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
