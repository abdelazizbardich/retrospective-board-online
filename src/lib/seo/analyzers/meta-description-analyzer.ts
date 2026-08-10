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

  const lenIdeal = len >= 140 && len <= 160;
  const keywordPresent = focus ? keywordInText(focus, desc) : true;
  const hasCta = /\b(learn|discover|find out|get started|read|explore)\b/i.test(desc);
  const hasSentence = desc.split(/[.!?]/).filter(Boolean).length >= 1;
  const isUnique = duplicates.length <= 1;

  const checks = [
    {
      label: `Length 140–160 characters (currently ${len})`,
      passed: lenIdeal,
      fix:
        len < 140
          ? `Add ${140 - len} more characters to reach the ideal 140–160 range.`
          : "Trim to 140–160 characters so Google doesn't cut off your snippet.",
    },
    ...(focus
      ? [
          {
            label: `Focus keyword "${focus}" in description`,
            passed: keywordPresent,
            fix: `Work "${focus}" naturally into the meta description.`,
          },
        ]
      : []),
    {
      label: "Includes a call to action (learn, discover, read…)",
      passed: hasCta,
      fix: 'End with an action phrase like "Learn how…" or "Discover…" to encourage clicks.',
    },
    {
      label: "Complete sentence(s)",
      passed: hasSentence,
      fix: "Write at least one full sentence that summarizes the article.",
    },
    {
      label: "Unique across your blog posts",
      passed: isUnique,
      fix: "Another post uses this exact meta description — write a unique one for this article.",
    },
  ];

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);
  const failedChecks = checks.filter((c) => !c.passed);

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
      failedChecks.length > 0
        ? failedChecks.map((c) => c.label).join("; ")
        : undefined,
    whyItMatters:
      "A clear meta description improves relevance signals and encourages clicks from search results.",
    howToFix: failedChecks[0]?.fix,
    checks,
  };
}
