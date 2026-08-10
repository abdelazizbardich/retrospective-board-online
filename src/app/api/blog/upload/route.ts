import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/auth/route";
import { getBlobAuthOptions, isBlobConfigured } from "@/lib/blob-auth";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB (under Vercel's 4.5 MB function limit)

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  if (!isBlobConfigured()) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN or connect a Blob store with OIDC (run vercel env pull for local dev).",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image must be under 4 MB" },
      { status: 400 },
    );
  }

  const slug = String(formData.get("slug") ?? "cover").trim() || "cover";
  const folder = String(formData.get("folder") ?? "covers").trim() === "content"
    ? "blog-content"
    : "blog-covers";
  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const pathname = `${folder}/${slug}-${Date.now()}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type,
    ...getBlobAuthOptions(),
  });

  return NextResponse.json({ url: blob.url });
}
