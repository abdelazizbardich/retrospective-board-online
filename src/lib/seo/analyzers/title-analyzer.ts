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

  const lenIdeal = len >= 50 && len <= 60;
  const keywordInTitle = focus ? keywordInText(focus, title) : false;
  const keywordNearStart = focus ? keywordNearBeginning(focus, title) : false;
  const hasPower = hasPowerWords(title);
  const hasNum = hasNumbers(title);
  const isUnique = duplicates.length <= 1;

  const checks = [
    {
      label: `Length 50–60 characters (currently ${len})`,
      passed: lenIdeal,
      fix: len < 50 ? "Expand the title to at least 50 characters." : "Shorten to 50–60 characters to avoid truncation in search results.",
    },
    ...(focus
      ? [
          {
            label: `Focus keyword "${focus}" in title`,
            passed: keywordInTitle,
            fix: `Add "${focus}" to the SEO title.`,
          },
          {
            label: "Focus keyword near the beginning",
            passed: keywordNearStart,
            fix: `Move "${focus}" closer to the start of the title (within the first ~30 characters).`,
          },
        ]
      : []),
    {
      label: "Uses a power word (e.g. guide, best, how)",
      passed: hasPower,
      fix: "Add an engaging word like “guide”, “best”, or “how to” to improve click-through rate.",
    },
    {
      label: "Includes a number",
      passed: hasNum,
      fix: "Add a number if relevant (e.g. “5 tips”, “2026 guide”) — numbers often boost clicks.",
    },
    {
      label: "Unique across your blog posts",
      passed: isUnique,
      fix: "Another post uses this exact title — write a unique SEO title for this article.",
    },
  ];

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);
  const finalScore = clampScore(score, maxScore);
  const failedChecks = checks.filter((c) => !c.passed);

  return {
    score: finalScore,
    maxScore,
    status,
    title: "SEO Title",
    message:
      issues.length === 0
        ? `SEO title looks good (${len} characters).`
        : `SEO title needs work: ${issues.join(", ")}.`,
    problem:
      failedChecks.length > 0
        ? failedChecks.map((c) => c.label).join("; ")
        : undefined,
    whyItMatters: "Search engines and users rely on the title to understand and click your result.",
    howToFix: failedChecks[0]?.fix,
    checks,
  };
}
