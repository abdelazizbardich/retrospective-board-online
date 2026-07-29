import type { SeoAnalysisResult, SeoPostInput } from "../types";
import { SEO_WEIGHTS } from "../types";
import { clampScore, statusFromScore } from "../utils";

export function analyzeSocial(input: SeoPostInput): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.socialSeo;
  let score = 0;
  const issues: string[] = [];

  const ogTitle = input.ogTitle || input.seoTitle || input.title;
  const ogDesc = input.ogDescription || input.metaDescription || input.excerpt;
  const ogImage = input.ogImage || input.coverImage;

  if (ogTitle.trim()) score += 1.5;
  else issues.push("Open Graph title missing");

  if (ogDesc.trim()) score += 1.5;
  else issues.push("Open Graph description missing");

  if (ogImage.trim()) score += 1;
  else issues.push("Open Graph image missing");

  const twTitle = input.twitterTitle || ogTitle;
  const twDesc = input.twitterDescription || ogDesc;
  if (twTitle.trim() && twDesc.trim()) score += 1;

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Social SEO",
    message:
      issues.length === 0
        ? "Social sharing metadata is configured."
        : `Social SEO issues: ${issues.join(", ")}.`,
    problem: issues.length > 0 ? issues.join("; ") : undefined,
    whyItMatters:
      "Open Graph and Twitter metadata control how your article appears when shared on social platforms.",
    howToFix:
      !ogImage.trim()
        ? "Add an Open Graph image (1200×630 recommended) for better social previews."
        : !ogDesc.trim()
          ? "Add an Open Graph description for social sharing."
          : undefined,
  };
}
