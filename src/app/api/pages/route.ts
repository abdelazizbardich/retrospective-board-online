import { NextRequest, NextResponse } from "next/server";
import { getAllPages, createPage } from "@/lib/page-store";
import { requireAdmin } from "@/app/api/admin/auth/route";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  const pages = await getAllPages(true); // include unpublished for admin list
  return NextResponse.json({ pages });
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const { title, slug, content, metaDescription, published } = body;

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
    const page = await createPage({
      title: String(title).trim().slice(0, 200),
      slug: String(slug).trim().slice(0, 100),
      content: String(content).slice(0, 50000),
      metaDescription: String(metaDescription ?? "").trim().slice(0, 300),
      published: published === true,
    });
    return NextResponse.json(page, { status: 201 });
  } catch (error: any) {
    // Handle duplicate slug constraint violation
    if (error?.message?.includes("UNIQUE") || error?.code === "SQLITE_CONSTRAINT") {
      return NextResponse.json({ error: "A page with this slug already exists" }, { status: 409 });
    }
    throw error;
  }
}
