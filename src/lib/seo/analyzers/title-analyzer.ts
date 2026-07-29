import type { SeoAnalysisResult, SeoPostInput } from "../types";
import { SEO_WEIGHTS } from "../types";
import {
  clampScore,
  hasNumbers,
  hasPowerWords,
  keywordInText,
  keywordNearBeginning,
  statusFromScore,
} from "../utils";
export function analyzeTitle(
  input: SeoPostInput,
  existingTitles: string[] = []
): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.seoTitle;
  const title = input.seoTitle || input.title;
  const focus = input.focusKeyword;
  let score = 0;
  const issues: string[] = [];

  if (!title.trim()) {
    return {
      score: 0,
      maxScore,
      status: "failed",
      title: "SEO Title",
      message: "SEO title is missing.",
      problem: "Your SEO title is empty.",
      whyItMatters: "The SEO title is the main headline shown in search results and strongly influences click-through rate.",
      howToFix: "Add a compelling SEO title that describes the article and includes your focus keyword.",
    };
  }

  const len = title.length;
  if (len >= 50 && len <= 60) score += 4;
  else if (len >= 40 && len <= 70) score += 2;
  else issues.push(len < 40 ? "title is too short" : "title may be truncated in search results");

  if (focus && keywordInText(focus, title)) {
    score += 4;
    if (keywordNearBeginning(focus, title)) score += 2;
    else issues.push("focus keyword is not near the beginning");
  } else if (focus) {
    issues.push("focus keyword missing from title");
  } else {
    score += 3;
  }

  if (hasPowerWords(title)) score += 2;
  if (hasNumbers(title)) score += 1;

  const duplicates = existingTitles.filter(
    (t) => t.toLowerCase() === title.toLowerCase()
  );
  if (duplicates.length > 1) {
    issues.push("duplicate SEO title detected");
    score -= 2;
  } else {
    score += 2;
  }

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);
  const finalScore = clampScore(score, maxScore);

  return {    score: finalScore,
    maxScore,
    status,
    title: "SEO Title",
    message:
      issues.length === 0
        ? `SEO title looks good (${len} characters).`
        : `SEO title needs work: ${issues.join(", ")}.`,
    problem: issues.length > 0 ? `SEO title issues: ${issues.join(", ")}.` : undefined,
    whyItMatters: "Search engines and users rely on the title to understand and click your result.",
    howToFix:
      focus && !keywordInText(focus, title)
        ? `Add "${focus}" naturally near the beginning of your SEO title.`
        : len > 70
          ? "Shorten your SEO title to around 50–60 characters."
          : undefined,
  };
}
