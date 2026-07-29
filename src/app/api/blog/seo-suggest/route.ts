import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/auth/route";
import type { SeoPostInput } from "@/lib/seo/types";
import { parseHtmlContent } from "@/lib/seo/utils";

type SuggestionType =
  | "seoTitle"
  | "metaDescription"
  | "focusKeyword"
  | "secondaryKeywords"
  | "outline"
  | "faqs"
  | "headings";

function parseInput(body: Record<string, unknown>): SeoPostInput {
  return {
    title: String(body.title ?? ""),
    slug: String(body.slug ?? ""),
    excerpt: String(body.excerpt ?? ""),
    content: String(body.content ?? ""),
    coverImage: String(body.coverImage ?? ""),
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

function generateSuggestions(type: SuggestionType, input: SeoPostInput): string[] {
  const focus = input.focusKeyword || input.title.split(/\s+/).slice(0, 3).join(" ").toLowerCase();
  const parsed = parseHtmlContent(input.content);

  switch (type) {
    case "seoTitle":
      return [
        `${focus.charAt(0).toUpperCase() + focus.slice(1)}: A Complete Guide`,
        `How to Master ${focus.charAt(0).toUpperCase() + focus.slice(1)}`,
        `${input.title.slice(0, 50)}`,
      ].filter((s) => s.length <= 70);

    case "metaDescription": {
      const base = input.excerpt || parsed.plainText.slice(0, 120);
      return [
        `${base.slice(0, 140)}. Learn practical tips and strategies.`,
        `Discover everything about ${focus}. ${base.slice(0, 100)}`,
        `${input.title}. ${base.slice(0, 120)}. Read the full guide.`,
      ].map((s) => s.slice(0, 160));
    }

    case "focusKeyword":
      return [
        focus,
        ...input.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3),
        ...input.title.toLowerCase().split(/\s+/).filter((w) => w.length > 4).slice(0, 2),
      ].filter((v, i, arr) => v && arr.indexOf(v) === i).slice(0, 5);

    case "secondaryKeywords":
      return input.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 5);

    case "outline":
      return [
        "Introduction",
        `What is ${focus}?`,
        `Benefits of ${focus}`,
        `How to get started with ${focus}`,
        "Best practices and tips",
        "Common mistakes to avoid",
        "Conclusion",
      ];

    case "faqs":
      return [
        `What is ${focus}?`,
        `How do I get started with ${focus}?`,
        `What are the benefits of ${focus}?`,
        `What are common mistakes with ${focus}?`,
      ];

    case "headings":
      return parsed.headings.length < 2
        ? [
            `Understanding ${focus}`,
            `Step-by-step guide to ${focus}`,
            `Tips for better ${focus}`,
          ]
        : parsed.headings.map((h) => h.text);

    default:
      return [];
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const type = String(body.type ?? "seoTitle") as SuggestionType;
  const input = parseInput(body);

  const suggestions = generateSuggestions(type, input);

  return NextResponse.json({
    type,
    suggestions,
    note: "Review and edit suggestions before applying. Avoid keyword stuffing.",
  });
}
