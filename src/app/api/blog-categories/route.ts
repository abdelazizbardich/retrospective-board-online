import { NextRequest, NextResponse } from "next/server";
import { getAllBlogCategories, createBlogCategory } from "@/lib/blog-category-store";
import { requireAdmin } from "@/app/api/admin/auth/route";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const categories = await getAllBlogCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const name = String(body.name ?? "").trim().slice(0, 100);

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  try {
    const category = await createBlogCategory(name);
    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    if (err?.message?.includes("UNIQUE") || err?.code === "23505") {
      return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 });
    }
    throw error;
  }
}
