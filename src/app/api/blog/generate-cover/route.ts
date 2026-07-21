import { fal } from "@fal-ai/client";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/auth/route";

function buildCoverPrompt(title: string, excerpt: string): string {
  const parts = [
    `Professional blog cover image for an article titled "${title}".`,
  ];
  if (excerpt) {
    parts.push(excerpt);
  }
  parts.push(
    "Modern, clean, visually striking editorial illustration. Suitable as a website blog header. No text, no watermarks, no logos.",
  );
  return parts.join(" ");
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

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage is not configured (missing BLOB_READ_WRITE_TOKEN)" },
      { status: 503 },
    );
  }

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const excerpt = String(body.excerpt ?? "").trim();
  const slug = String(body.slug ?? "cover").trim() || "cover";

  if (!title) {
    return NextResponse.json(
      { error: "Title is required to generate a cover image" },
      { status: 400 },
    );
  }

  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: buildCoverPrompt(title, excerpt),
        image_size: "landscape_16_9",
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
    const pathname = `blog-covers/${slug}-generated-${Date.now()}.jpg`;

    const blob = await put(pathname, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
