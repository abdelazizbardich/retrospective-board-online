import { fal } from "@fal-ai/client";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/auth/route";
import { getBlobAuthOptions, isBlobConfigured } from "@/lib/blob-auth";

function buildContentImagePrompt(description: string): string {
  return [
    description,
    "High-quality editorial illustration suitable for inline use in a blog article.",
    "Clean, modern, professional composition. No text, watermarks, or logos unless explicitly described.",
  ].join(" ");
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  if (!process.env.FAL_KEY) {
    return NextResponse.json(
      { error: "Image generation is not configured (missing FAL_KEY)" },
      { status: 503 },
    );
  }

  if (!isBlobConfigured()) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN or connect a Blob store with OIDC (run vercel env pull for local dev).",
      },
      { status: 503 },
    );
  }

  const body = await request.json();
  const description = String(body.description ?? "").trim();
  const slug = String(body.slug ?? "content").trim() || "content";

  if (!description) {
    return NextResponse.json(
      { error: "A description is required to generate an image" },
      { status: 400 },
    );
  }

  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: buildContentImagePrompt(description),
        image_size: "landscape_4_3",
        output_format: "jpeg",
        num_images: 1,
      },
    });

    const imageUrl = result.data?.images?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image returned from generator" },
        { status: 502 },
      );
    }

    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return NextResponse.json(
        { error: "Failed to download generated image" },
        { status: 502 },
      );
    }

    const imageBuffer = await imageRes.arrayBuffer();
    const pathname = `blog-content/${slug}-generated-${Date.now()}.jpg`;

    const blob = await put(pathname, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
      ...getBlobAuthOptions(),
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
