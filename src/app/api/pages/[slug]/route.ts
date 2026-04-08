import { NextRequest, NextResponse } from "next/server";
import { getPage, updatePage, deletePage } from "@/lib/page-store";
import { requireAdmin, isAdminAuthenticated } from "@/app/api/admin/auth/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  // If page is not published, require admin auth
  if (!page.published) {
    const authError = requireAdmin(request);
    if (authError) return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  
  return NextResponse.json(page);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  
  // Validate new slug format if provided
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
    const updated = await updatePage(slug, {
      ...(body.title !== undefined           && { title:           String(body.title).trim().slice(0, 200) }),
      ...(body.slug !== undefined            && { slug:            String(body.slug).trim().slice(0, 100) }),
      ...(body.content !== undefined         && { content:         String(body.content).slice(0, 50000) }),
      ...(body.metaDescription !== undefined && { metaDescription: String(body.metaDescription).trim().slice(0, 300) }),
      ...(body.published !== undefined       && { published:       body.published === true }),
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    // Handle duplicate slug constraint violation
    if (error?.message?.includes("UNIQUE") || error?.code === "SQLITE_CONSTRAINT") {
      return NextResponse.json({ error: "A page with this slug already exists" }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  const existed = await deletePage(slug);
  if (!existed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
