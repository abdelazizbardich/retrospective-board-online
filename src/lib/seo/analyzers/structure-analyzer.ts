import type { ParsedContent, SeoAnalysisResult, SeoPostInput } from "../types";
import { SEO_WEIGHTS } from "../types";
import {
  clampScore,
  getConclusion,
  getIntroduction,
  parseHtmlContent,
  statusFromScore,
} from "../utils";

export function analyzeContentStructure(
  input: SeoPostInput,
  parsed?: ParsedContent
): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.contentStructure;
  const content = parsed ?? parseHtmlContent(input.content);
  let score = 0;
  const issues: string[] = [];

  const h1Count = content.headings.filter((h) => h.level === 1).length;
  const h2Count = content.headings.filter((h) => h.level === 2).length;
  const h3Count = content.headings.filter((h) => h.level === 3).length;

  // H1 should be in title field, not duplicated in content ideally
  if (h1Count <= 1) score += 2;
  else issues.push("multiple H1 headings in content");

  if (h2Count >= 1) score += 2;
  else issues.push("no H2 headings");

  if (h3Count >= 1 || h2Count >= 2) score += 1;

  // Heading hierarchy check
  let hierarchyOk = true;
  for (let i = 1; i < content.headings.length; i++) {
    const jump = content.headings[i].level - content.headings[i - 1].level;
    if (jump > 1) {
      hierarchyOk = false;
      break;
    }
  }
  if (hierarchyOk) score += 2;
  else issues.push("heading hierarchy skips levels (e.g. H2 → H4)");

  const avgParaLen =
    content.paragraphs.length > 0
      ? content.paragraphs.reduce((s, p) => s + p.split(/\s+/).length, 0) /
        content.paragraphs.length
      : 0;
  if (avgParaLen <= 120) score += 1;
  else issues.push("some paragraphs are quite long");

  if (content.hasBulletList || content.hasNumberedList) score += 1;
  if (getIntroduction(content).length > 30) score += 0.5;
  if (getConclusion(content).length > 30) score += 0.5;

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Content Structure",
    message:
      issues.length === 0
        ? `Good structure: ${h2Count} H2, ${h3Count} H3, ${content.paragraphs.length} paragraphs.`
        : `Structure issues: ${issues.join(", ")}.`,
    problem: issues.length > 0 ? `Structure issues: ${issues.join(", ")}.` : undefined,
    whyItMatters:
      "Clear heading hierarchy and scannable structure help readers and search engines understand your content.",
    howToFix:
      h2Count === 0
        ? "Add H2 subheadings to break the article into logical sections."
        : !hierarchyOk
          ? "Fix heading levels so they follow a logical order (H2 → H3, not H2 → H4)."
          : undefined,
  };
}
