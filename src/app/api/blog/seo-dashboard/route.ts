import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/auth/route";
import { getAllBlogPosts } from "@/lib/blog-store";
import { countIncomingLinks, findOrphanPosts } from "@/lib/seo/internal-linking";
import { parseHtmlContent } from "@/lib/seo/utils";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") ?? "all";
  const sort = searchParams.get("sort") ?? "seoScore";

  const posts = await getAllBlogPosts(true);
  const incomingLinks = countIncomingLinks(posts);
  const orphans = findOrphanPosts(posts, incomingLinks);

  const seoTitles = new Map<string, string[]>();
  const metaDescriptions = new Map<string, string[]>();

  for (const post of posts) {
    const seoTitle = (post.seoTitle || post.title).toLowerCase();
    const meta = post.metaDescription.toLowerCase();
    if (seoTitle) {
      const arr = seoTitles.get(seoTitle) ?? [];
      arr.push(post.slug);
      seoTitles.set(seoTitle, arr);
    }
    if (meta) {
      const arr = metaDescriptions.get(meta) ?? [];
      arr.push(post.slug);
      metaDescriptions.set(meta, arr);
    }
  }

  const duplicateSeoTitles = [...seoTitles.values()].filter((s) => s.length > 1).flat();
  const duplicateMetaDescriptions = [...metaDescriptions.values()].filter((s) => s.length > 1).flat();

  const items = posts.map((post) => {
    const parsed = parseHtmlContent(post.content);
    const internalBlogLinks = parsed.internalLinks.filter((l) => l.href.includes("/blog/"));
    return {
      slug: post.slug,
      title: post.title,
      category: post.category,
      seoScore: post.seoScore,
      rating: post.seoAnalysis?.rating ?? "Poor",
      focusKeyword: post.focusKeyword,
      metaDescription: post.metaDescription,
      seoTitle: post.seoTitle || post.title,
      coverImage: post.coverImage,
      wordCount: parsed.wordCount,
      internalLinkCount: internalBlogLinks.length,
      isOrphan: orphans.some((o) => o.slug === post.slug),
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      titleTooLong: (post.seoTitle || post.title).length > 70,
      metaTooLong: post.metaDescription.length > 170,
      missingMeta: !post.metaDescription.trim(),
      missingFocusKeyword: !post.focusKeyword.trim(),
      missingCover: !post.coverImage.trim(),
      noInternalLinks: internalBlogLinks.length === 0,
    };
  });

  let filtered = items;
  if (filter === "excellent") filtered = items.filter((i) => i.seoScore >= 80);
  else if (filter === "good") filtered = items.filter((i) => i.seoScore >= 60 && i.seoScore < 80);
  else if (filter === "needs-improvement") filtered = items.filter((i) => i.seoScore >= 40 && i.seoScore < 60);
  else if (filter === "poor") filtered = items.filter((i) => i.seoScore < 40);

  filtered.sort((a, b) => {
    switch (sort) {
      case "updatedAt": return b.updatedAt - a.updatedAt;
      case "createdAt": return b.createdAt - a.createdAt;
      case "wordCount": return b.wordCount - a.wordCount;
      case "category": return a.category.localeCompare(b.category);
      default: return b.seoScore - a.seoScore;
    }
  });

  const scores = items.map((i) => i.seoScore);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return NextResponse.json({
    summary: {
      averageScore: avgScore,
      totalPosts: posts.length,
      excellent: items.filter((i) => i.seoScore >= 80).length,
      below50: items.filter((i) => i.seoScore < 50).length,
      missingMetaDescriptions: items.filter((i) => i.missingMeta).length,
      missingFocusKeywords: items.filter((i) => i.missingFocusKeyword).length,
      missingFeaturedImages: items.filter((i) => i.missingCover).length,
      noInternalLinks: items.filter((i) => i.noInternalLinks).length,
      orphanArticles: orphans.length,
      duplicateSeoTitles: duplicateSeoTitles.length,
      duplicateMetaDescriptions: duplicateMetaDescriptions.length,
      longTitles: items.filter((i) => i.titleTooLong).length,
      longMetaDescriptions: items.filter((i) => i.metaTooLong).length,
    },
    posts: filtered,
  });
}
