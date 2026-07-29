import type { SeoAnalysisResult, SeoPostInput } from "../types";
import { SEO_WEIGHTS } from "../types";
import {
  clampScore,
  keywordInText,
  slugHasDuplicateWords,
  slugHasStopWords,
  statusFromScore,
} from "../utils";

export function analyzeSlug(input: SeoPostInput): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.urlSlug;
  const slug = input.slug.trim();
  let score = 0;
  const issues: string[] = [];

  if (!slug) {
    return {
      score: 0,
      maxScore,
      status: "failed",
      title: "URL / Slug",
      message: "Slug is missing.",
      problem: "URL slug is empty.",
      whyItMatters: "A clean URL helps users and search engines understand the page topic.",
      howToFix: "Set a short, descriptive slug with your focus keyword.",
    };
  }

  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) score += 1;
  else issues.push("slug contains invalid characters");

  if (slug.length <= 50) score += 1;
  else issues.push("slug is too long");

  if (slug.split("-").length <= 6) score += 1;
  else issues.push("slug has too many words");

  if (input.focusKeyword && keywordInText(input.focusKeyword, slug.replace(/-/g, " "))) {
    score += 1;
  } else if (input.focusKeyword) {
    issues.push("focus keyword not in slug");
  } else {
    score += 0.5;
  }

  if (!slugHasStopWords(slug)) score += 0.5;
  else issues.push("slug contains stop words");

  if (!slugHasDuplicateWords(slug)) score += 1;
  else issues.push("slug has duplicate words");

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "URL / Slug",
    message:
      issues.length === 0
        ? `Slug /blog/${slug} looks good (${slug.length} chars).`
        : `Slug issues: ${issues.join(", ")}.`,
    problem: issues.length > 0 ? issues.join("; ") : undefined,
    whyItMatters: "Short, keyword-rich URLs are easier to share and may perform better in search.",
    howToFix:
      slug.length > 50
        ? "Shorten the slug by removing unnecessary words."
        : input.focusKeyword && !keywordInText(input.focusKeyword, slug.replace(/-/g, " "))
          ? `Include "${input.focusKeyword}" in the slug using hyphens.`
          : undefined,
  };
}
