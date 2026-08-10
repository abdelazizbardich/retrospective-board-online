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

  const checks = [
    {
      label: h1Count <= 1 ? "At most one H1 in content" : `Only one H1 allowed (found ${h1Count})`,
      passed: h1Count <= 1,
      fix: "Use only one H1 — the post title serves as H1; use H2/H3 in the body.",
    },
    {
      label: h2Count >= 1 ? `${h2Count} H2 heading(s)` : "At least one H2 heading",
      passed: h2Count >= 1,
      fix: "Add H2 subheadings to break the article into logical sections.",
    },
    {
      label: h3Count >= 1 || h2Count >= 2 ? "Sub-sections present" : "H3 subheadings or multiple H2s",
      passed: h3Count >= 1 || h2Count >= 2,
      fix: "Add H3 subheadings under your H2 sections for better scannability.",
    },
    {
      label: hierarchyOk ? "Heading hierarchy is logical" : "Heading levels don't skip (e.g. H2 → H4)",
      passed: hierarchyOk,
      fix: "Fix heading levels so they follow order: H2 → H3, not H2 → H4.",
    },
    {
      label:
        avgParaLen <= 120
          ? `Paragraph length OK (avg ${Math.round(avgParaLen)} words)`
          : `Paragraphs too long (avg ${Math.round(avgParaLen)} words)`,
      passed: avgParaLen <= 120,
      fix: "Split long paragraphs into chunks of 2–4 sentences.",
    },
    {
      label: content.hasBulletList || content.hasNumberedList ? "Uses bullet or numbered lists" : "No lists found",
      passed: content.hasBulletList || content.hasNumberedList,
      fix: "Add bullet or numbered lists where you enumerate steps or points.",
    },
    {
      label: getIntroduction(content).length > 30 ? "Has an introduction" : "Introduction is short or missing",
      passed: getIntroduction(content).length > 30,
      fix: "Write an opening paragraph (30+ characters) that sets up the topic.",
    },
    {
      label: getConclusion(content).length > 30 ? "Has a conclusion" : "Conclusion is short or missing",
      passed: getConclusion(content).length > 30,
      fix: "Add a closing paragraph that summarizes key takeaways.",
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Content Structure",
    message:
      issues.length === 0
        ? `Good structure: ${h2Count} H2, ${h3Count} H3, ${content.paragraphs.length} paragraphs.`
        : `Structure issues: ${issues.join(", ")}.`,
    problem: failedChecks.length > 0 ? failedChecks.map((c) => c.label).join("; ") : undefined,
    whyItMatters:
      "Clear heading hierarchy and scannable structure help readers and search engines understand your content.",
    howToFix: failedChecks[0]?.fix,
    checks,
  };
}
