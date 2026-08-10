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

  const checks = [
    {
      label:
        avgSentence <= 20
          ? `Avg sentence length OK (${avgSentence.toFixed(0)} words)`
          : avgSentence <= 25
            ? `Avg sentence length acceptable (${avgSentence.toFixed(0)} words — aim for ≤20)`
            : `Sentences too long on average (${avgSentence.toFixed(0)} words)`,
      passed: avgSentence <= 20,
      fix: "Break long sentences into shorter ones (aim for ≤20 words per sentence).",
    },
    {
      label:
        longSentences === 0
          ? "No sentences over 25 words"
          : `${longSentences} sentence(s) exceed 25 words`,
      passed: longSentences <= 3,
      fix: `Split ${longSentences} long sentence(s) into shorter, clearer ones.`,
    },
    {
      label:
        avgParaLen <= 80
          ? `Paragraph length OK (avg ${Math.round(avgParaLen)} words)`
          : `Paragraphs too long (avg ${Math.round(avgParaLen)} words)`,
      passed: avgParaLen <= 80,
      fix: "Split long paragraphs into smaller chunks of 2–4 sentences.",
    },
    {
      label:
        passiveRatio < 2
          ? "Passive voice usage is low"
          : `Passive voice used frequently (${passive} instances)`,
      passed: passiveRatio < 2,
      fix: "Rewrite passive sentences in active voice (e.g. “We recommend…” instead of “It is recommended…”).",
    },
    {
      label:
        transitions >= 3
          ? `Uses transition words (${transitions} found)`
          : `Few transition words (${transitions} — aim for 3+)`,
      passed: transitions >= 3,
      fix: "Add transition words (however, therefore, for example) to improve flow between ideas.",
    },
    {
      label: content.headings.length >= 2 ? "Headings break up content" : "Few headings for readability",
      passed: content.headings.length >= 2,
      fix: "Add subheadings to make the article easier to scan.",
    },
    {
      label:
        content.hasBulletList || content.hasNumberedList
          ? "Uses lists for scannability"
          : "No bullet or numbered lists",
      passed: content.hasBulletList || content.hasNumberedList,
      fix: "Use bullet or numbered lists for steps, tips, or grouped points.",
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Readability",
    message: `Readability: ${readabilityRating}. Avg sentence: ${avgSentence.toFixed(0)} words.`,
    problem: failedChecks.length > 0 ? failedChecks.map((c) => c.label).join("; ") : undefined,
    whyItMatters:
      "Readable content keeps users engaged and signals quality to search engines.",
    howToFix: failedChecks[0]?.fix,
    readabilityRating,
    checks,
  };
}
