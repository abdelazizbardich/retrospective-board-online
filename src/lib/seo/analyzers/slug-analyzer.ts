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

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  const keywordInSlug =
    input.focusKeyword && keywordInText(input.focusKeyword, slug.replace(/-/g, " "));

  const checks = [
    {
      label: slugValid ? "Valid URL format (lowercase, hyphens only)" : "Invalid characters in slug",
      passed: slugValid,
      fix: "Use only lowercase letters, numbers, and hyphens (e.g. my-article-title).",
    },
    {
      label:
        slug.length <= 50
          ? `Slug length OK (${slug.length} chars)`
          : `Slug too long (${slug.length} chars — max 50)`,
      passed: slug.length <= 50,
      fix: "Shorten the slug by removing unnecessary words.",
    },
    {
      label:
        slug.split("-").length <= 6
          ? "Reasonable number of words in slug"
          : "Too many words in slug (max 6)",
      passed: slug.split("-").length <= 6,
      fix: "Keep the slug to 6 words or fewer.",
    },
    ...(input.focusKeyword
      ? [
          {
            label: keywordInSlug
              ? `Focus keyword in slug`
              : `Focus keyword "${input.focusKeyword}" not in slug`,
            passed: !!keywordInSlug,
            fix: `Include key terms from "${input.focusKeyword}" in the slug using hyphens.`,
          },
        ]
      : []),
    {
      label: !slugHasStopWords(slug) ? "No filler stop words" : "Contains stop words (a, the, and…)",
      passed: !slugHasStopWords(slug),
      fix: "Remove filler words like “the”, “a”, “and” from the slug.",
    },
    {
      label: !slugHasDuplicateWords(slug) ? "No duplicate words" : "Duplicate words in slug",
      passed: !slugHasDuplicateWords(slug),
      fix: "Remove repeated words from the slug.",
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "URL / Slug",
    message:
      issues.length === 0
        ? `Slug /blog/${slug} looks good (${slug.length} chars).`
        : `Slug issues: ${issues.join(", ")}.`,
    problem: failedChecks.length > 0 ? failedChecks.map((c) => c.label).join("; ") : undefined,
    whyItMatters: "Short, keyword-rich URLs are easier to share and may perform better in search.",
    howToFix: failedChecks[0]?.fix,
    checks,
  };
}
