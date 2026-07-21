import { NextRequest, NextResponse } from "next/server";
import { updateBlogCategory, deleteBlogCategory } from "@/lib/blog-category-store";
import { requireAdmin } from "@/app/api/admin/auth/route";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const name = String(body.name ?? "").trim().slice(0, 100);

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  try {
    const updated = await updateBlogCategory(id, name);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    if (err?.message?.includes("UNIQUE") || err?.code === "23505") {
      return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const deleted = await deleteBlogCategory(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
