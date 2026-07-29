import type { ParsedContent, SeoAnalysisResult, SeoPostInput } from "../types";
import { SEO_WEIGHTS } from "../types";
import {
  clampScore,
  getConclusion,
  getFirstPercentText,
  getIntroduction,
  isKeywordStuffed,
  keywordInText,
  parseHtmlContent,
  statusFromScore,
} from "../utils";

export function analyzeKeywords(
  input: SeoPostInput,
  parsed?: ParsedContent
): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.focusKeyword;
  const focus = input.focusKeyword.trim();
  const content = parsed ?? parseHtmlContent(input.content);
  const seoTitle = input.seoTitle || input.title;

  if (!focus) {
    return {
      score: 0,
      maxScore,
      status: "failed",
      title: "Focus Keyword",
      message: "No focus keyword set.",
      problem: "You have not set a primary focus keyword.",
      whyItMatters:
        "A focus keyword helps align your content with the search query you want to rank for.",
      howToFix: "Enter a primary focus keyword that matches the search intent of this article.",
    };
  }

  let score = 0;
  const checks: { label: string; passed: boolean }[] = [
    { label: "SEO title", passed: keywordInText(focus, seoTitle) },
    { label: "H1 title", passed: keywordInText(focus, input.title) },
    { label: "introduction", passed: keywordInText(focus, getIntroduction(content)) },
    { label: "first 10% of content", passed: keywordInText(focus, getFirstPercentText(content)) },
    { label: "meta description", passed: keywordInText(focus, input.metaDescription || input.excerpt) },
    { label: "URL slug", passed: keywordInText(focus, input.slug.replace(/-/g, " ")) },
    {
      label: "heading (H2/H3)",
      passed: content.headings.some(
        (h) => h.level >= 2 && keywordInText(focus, h.text)
      ),
    },
    {
      label: "image alt text",
      passed: content.images.some((img) => keywordInText(focus, img.alt)),
    },
    { label: "body content", passed: keywordInText(focus, content.plainText) },
    { label: "conclusion", passed: keywordInText(focus, getConclusion(content)) },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  score = (passedCount / checks.length) * maxScore;

  if (isKeywordStuffed(focus, content.plainText)) {
    score = Math.max(0, score - 4);
  }

  const secondary = input.secondaryKeywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  if (secondary.length > 0) {
    const secondaryUsed = secondary.filter((k) => keywordInText(k, content.plainText)).length;
    if (secondaryUsed >= Math.min(secondary.length, 2)) score = Math.min(maxScore, score + 1);
  }

  const missing = checks.filter((c) => !c.passed).map((c) => c.label);
  const stuffed = isKeywordStuffed(focus, content.plainText);
  const ratio = score / maxScore;
  const status = stuffed ? "warning" : statusFromScore(ratio);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Focus Keyword",
    message: stuffed
      ? `Focus keyword "${focus}" may be overused. Missing from: ${missing.join(", ") || "none"}.`
      : missing.length === 0
        ? `Focus keyword "${focus}" is well distributed.`
        : `Focus keyword missing from: ${missing.join(", ")}.`,
    problem: stuffed
      ? `Keyword "${focus}" appears too frequently and may look unnatural.`
      : missing.length > 0
        ? `Focus keyword is missing from: ${missing.join(", ")}.`
        : undefined,
    whyItMatters:
      "Natural keyword placement helps search engines understand your topic without keyword stuffing penalties.",
    howToFix: stuffed
      ? `Reduce repetition of "${focus}" and use synonyms or related terms instead.`
      : missing.length > 0
        ? `Add "${focus}" naturally to your ${missing[0]}.`
        : undefined,
  };
}
