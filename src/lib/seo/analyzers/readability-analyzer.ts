import type { ParsedContent, SeoAnalysisResult } from "../types";
import { SEO_WEIGHTS } from "../types";
import {
  averageSentenceLength,
  clampScore,
  countLongSentences,
  countPassiveVoice,
  countTransitionWords,
  parseHtmlContent,
  statusFromScore,
} from "../utils";

export type ReadabilityRating = "Excellent" | "Good" | "Needs Improvement" | "Poor";

export function getReadabilityRating(score: number): ReadabilityRating {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Improvement";
  return "Poor";
}

export function analyzeReadability(
  contentHtml: string,
  parsed?: ParsedContent
): SeoAnalysisResult & { readabilityRating: ReadabilityRating } {
  const maxScore = SEO_WEIGHTS.readability;
  const content = parsed ?? parseHtmlContent(contentHtml);
  const text = content.plainText;
  let score = 0;
  const issues: string[] = [];

  if (!text.trim()) {
    return {
      score: 0,
      maxScore,
      status: "failed",
      title: "Readability",
      message: "No content to analyze.",
      readabilityRating: "Poor",
    };
  }

  const avgSentence = averageSentenceLength(text);
  if (avgSentence <= 20) score += 3;
  else if (avgSentence <= 25) score += 2;
  else issues.push("sentences are long on average");

  const longSentences = countLongSentences(text);
  if (longSentences === 0) score += 2;
  else if (longSentences <= 3) score += 1;
  else issues.push(`${longSentences} sentences exceed 25 words`);

  const avgParaLen =
    content.paragraphs.length > 0
      ? content.paragraphs.reduce((s, p) => s + p.split(/\s+/).length, 0) /
        content.paragraphs.length
      : 0;
  if (avgParaLen <= 80) score += 2;
  else issues.push("paragraphs are long");

  const passive = countPassiveVoice(text);
  const passiveRatio = passive / Math.max(1, content.wordCount / 100);
  if (passiveRatio < 2) score += 1;
  else issues.push("passive voice detected frequently");

  const transitions = countTransitionWords(text);
  if (transitions >= 3) score += 1;

  if (content.headings.length >= 2) score += 0.5;
  if (content.hasBulletList || content.hasNumberedList) score += 0.5;

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);
  const readabilityRating = getReadabilityRating((score / maxScore) * 100);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Readability",
    message: `Readability: ${readabilityRating}. Avg sentence: ${avgSentence.toFixed(0)} words.`,
    problem: issues.length > 0 ? issues.join("; ") : undefined,
    whyItMatters:
      "Readable content keeps users engaged and signals quality to search engines.",
    howToFix:
      longSentences > 3
        ? "Break long sentences into shorter ones and use bullet lists where appropriate."
        : avgParaLen > 80
          ? "Split long paragraphs into smaller chunks of 2–4 sentences."
          : undefined,
    readabilityRating,
  };
}
