import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/auth/route";
import { getAllBlogPosts } from "@/lib/blog-store";
import { SeoAnalyzerService } from "@/lib/seo/seo-analyzer-service";
import type { SeoPostInput } from "@/lib/seo/types";

function parseSeoInput(body: Record<string, unknown>): SeoPostInput {
  return {
    title: String(body.title ?? ""),
    slug: String(body.slug ?? ""),
    excerpt: String(body.excerpt ?? ""),
    content: String(body.content ?? ""),
    coverImage: String(body.coverImage ?? ""),
    coverImageAlt: String(body.coverImageAlt ?? ""),
    tags: String(body.tags ?? ""),
    category: String(body.category ?? ""),
    author: String(body.author ?? ""),
    focusKeyword: String(body.focusKeyword ?? ""),
    secondaryKeywords: String(body.secondaryKeywords ?? ""),
    seoTitle: String(body.seoTitle ?? ""),
    metaDescription: String(body.metaDescription ?? ""),
    canonicalUrl: String(body.canonicalUrl ?? ""),
    robotsIndex: body.robotsIndex !== false,
    robotsFollow: body.robotsFollow !== false,
    ogTitle: String(body.ogTitle ?? ""),
    ogDescription: String(body.ogDescription ?? ""),
    ogImage: String(body.ogImage ?? ""),
    twitterTitle: String(body.twitterTitle ?? ""),
    twitterDescription: String(body.twitterDescription ?? ""),
    twitterImage: String(body.twitterImage ?? ""),
    schemaType: String(body.schemaType ?? "BlogPosting"),
  };
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const input = parseSeoInput(body);

  const allPosts = await getAllBlogPosts(true);
  const analysis = SeoAnalyzerService.analyze(input, {
    existingTitles: allPosts.map((p) => p.seoTitle || p.title),
    existingDescriptions: allPosts.map((p) => p.metaDescription),
  });

  const linkSuggestions = SeoAnalyzerService.getInternalLinkSuggestions(
    input,
    allPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      content: p.content,
      category: p.category,
      tags: p.tags,
    }))
  );

  return NextResponse.json({ ...analysis, linkSuggestions });
}
