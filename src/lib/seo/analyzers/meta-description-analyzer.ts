import type { SeoAnalysisResult, SeoPostInput } from "../types";
import { SEO_WEIGHTS } from "../types";
import {
  clampScore,
  keywordInText,
  statusFromScore,
} from "../utils";

export function analyzeMetaDescription(
  input: SeoPostInput,
  existingDescriptions: string[] = []
): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.metaDescription;
  const desc = input.metaDescription || input.excerpt;
  const focus = input.focusKeyword;
  let score = 0;
  const issues: string[] = [];

  if (!desc.trim()) {
    return {
      score: 0,
      maxScore,
      status: "failed",
      title: "Meta Description",
      message: "Meta description is missing.",
      problem: "Your meta description is empty.",
      whyItMatters:
        "Meta descriptions appear in search snippets and help users decide whether to click your result.",
      howToFix: "Write a 140–160 character description that summarizes the article and includes your focus keyword.",
    };
  }

  const len = desc.length;
  if (len >= 140 && len <= 160) score += 4;
  else if (len >= 120 && len <= 170) score += 2;
  else issues.push(len < 120 ? "description is too short" : "description may be truncated");

  if (focus && keywordInText(focus, desc)) score += 3;
  else if (focus) issues.push("focus keyword missing");

  if (/\b(learn|discover|find out|get started|read|explore)\b/i.test(desc)) score += 2;
  if (desc.split(/[.!?]/).filter(Boolean).length >= 1) score += 1;

  const duplicates = existingDescriptions.filter(
    (d) => d.toLowerCase() === desc.toLowerCase()
  );
  if (duplicates.length > 1) {
    issues.push("duplicate meta description");
    score -= 2;
  } else {
    score += 2;
  }

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Meta Description",
    message:
      issues.length === 0
        ? `Meta description looks good (${len} characters).`
        : `Meta description needs work: ${issues.join(", ")}.`,
    problem:
      issues.length > 0
        ? `Meta description issues: ${issues.join(", ")}.`
        : undefined,
    whyItMatters:
      "A clear meta description improves relevance signals and encourages clicks from search results.",
    howToFix:
      focus && !keywordInText(focus, desc)
        ? `Add "${focus}" naturally to the meta description.`
        : len < 120
          ? "Expand your meta description to around 140–160 characters."
          : len > 170
            ? "Trim your meta description to around 140–160 characters."
            : undefined,
  };
}
