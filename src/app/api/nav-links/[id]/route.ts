import { NextRequest, NextResponse } from "next/server";
import { updateNavLink, deleteNavLink } from "@/lib/nav-link-store";
import { requireAdmin } from "@/app/api/admin/auth/route";
import { isSafeHref } from "@/lib/safe-url";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();

  if (body.area !== undefined && body.area !== "header" && body.area !== "footer") {
    return NextResponse.json({ error: "area must be 'header' or 'footer'" }, { status: 400 });
  }

  if (body.href !== undefined && !isSafeHref(String(body.href))) {
    return NextResponse.json(
      { error: "href must be a relative path or http(s) URL" },
      { status: 400 }
    );
  }

  const updated = await updateNavLink(id, {
    ...(body.label !== undefined       && { label:       String(body.label).trim().slice(0, 100) }),
    ...(body.href !== undefined        && { href:        String(body.href).trim().slice(0, 500) }),
    ...(body.area !== undefined        && { area:        body.area }),
    ...(body.position !== undefined    && { position:    Number(body.position) }),
    ...(body.openInNewTab !== undefined && { openInNewTab: body.openInNewTab === true }),
  });

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const deleted = await deleteNavLink(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
