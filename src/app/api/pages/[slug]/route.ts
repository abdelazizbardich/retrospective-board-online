import { NextRequest, NextResponse } from "next/server";
import { getPage, updatePage, deletePage } from "@/lib/page-store";
import { requireAdmin } from "@/app/api/admin/auth/route";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
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
  const updated = await updatePage(slug, {
    ...(body.title !== undefined           && { title:           String(body.title).trim().slice(0, 200) }),
    ...(body.slug !== undefined            && { slug:            String(body.slug).trim().slice(0, 100) }),
    ...(body.content !== undefined         && { content:         String(body.content).slice(0, 50000) }),
    ...(body.metaDescription !== undefined && { metaDescription: String(body.metaDescription).trim().slice(0, 300) }),
    ...(body.published !== undefined       && { published:       body.published === true }),
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
  const existed = await deletePage(slug);
  if (!existed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
