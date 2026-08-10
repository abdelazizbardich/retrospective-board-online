import type { ParsedContent, SeoAnalysisResult, SeoPostInput } from "../types";
import { SEO_WEIGHTS } from "../types";
import {
  clampScore,
  estimateReadingTime,
  parseHtmlContent,
  statusFromScore,
} from "../utils";

export function analyzeContent(
  input: SeoPostInput,
  parsed?: ParsedContent
): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.contentQuality;
  const content = parsed ?? parseHtmlContent(input.content);
  const { wordCount } = content;
  let score = 0;
  const issues: string[] = [];

  if (wordCount === 0) {
    return {
      score: 0,
      maxScore,
      status: "failed",
      title: "Content Quality",
      message: "Article has no content.",
      problem: "The article body is empty.",
      whyItMatters: "Thin content rarely ranks well and does not satisfy search intent.",
      howToFix: "Add substantive content that answers the reader's question thoroughly.",
    };
  }

  // Intent-based length scoring
  if (wordCount < 300) {
    issues.push("content may be too short for most topics");
    score += 3;
  } else if (wordCount < 800) {
    score += 8;
  } else if (wordCount < 2000) {
    score += 12;
  } else {
    score += 10; // comprehensive but don't over-reward filler
  }

  if (content.paragraphs.length >= 3) score += 1;
  if (content.headings.length >= 2) score += 1;
  if (input.excerpt.trim().length > 20) score += 1;

  const readingTime = estimateReadingTime(wordCount);
  const ratio = score / maxScore;
  const status = statusFromScore(ratio);

  let lengthLabel = "reasonable";
  if (wordCount < 300) lengthLabel = "may be too short";
  else if (wordCount >= 1500) lengthLabel = "comprehensive";

  const checks = [
    {
      label:
        wordCount >= 800
          ? `Substantial length (${wordCount} words)`
          : wordCount >= 300
            ? `Moderate length (${wordCount} words — aim for 800+)`
            : `Too short (${wordCount} words — aim for 300+)`,
      passed: wordCount >= 800,
      fix:
        wordCount < 300
          ? "Expand to at least 300 words with useful, relevant content."
          : "Add more depth — comprehensive articles typically have 800+ words.",
    },
    {
      label: `At least 3 paragraphs (currently ${content.paragraphs.length})`,
      passed: content.paragraphs.length >= 3,
      fix: "Break content into at least 3 distinct paragraphs.",
    },
    {
      label: `At least 2 headings (currently ${content.headings.length})`,
      passed: content.headings.length >= 2,
      fix: "Add H2/H3 subheadings to structure the article.",
    },
    {
      label: "Excerpt / summary provided",
      passed: input.excerpt.trim().length > 20,
      fix: "Write a short excerpt (20+ characters) that summarizes the post.",
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Content Quality",
    message: `${wordCount} words · ~${readingTime} min read · ${content.paragraphs.length} paragraphs · Content length is ${lengthLabel}.`,
    problem: failedChecks.length > 0 ? failedChecks.map((c) => c.label).join("; ") : undefined,
    whyItMatters:
      "Content depth should match search intent — comprehensive guides need more words than quick answers.",
    howToFix: failedChecks[0]?.fix,
    checks,
  };
}
