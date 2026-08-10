import type { SeoAnalysisResult, SeoPostInput } from "../types";
import { SEO_WEIGHTS } from "../types";
import { clampScore, statusFromScore } from "../utils";

export function analyzeSocial(input: SeoPostInput): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.socialSeo;
  let score = 0;
  const issues: string[] = [];

  const ogTitle = input.ogTitle || input.seoTitle || input.title;
  const ogDesc = input.ogDescription || input.metaDescription || input.excerpt;
  const ogImage = input.ogImage || input.coverImage;

  if (ogTitle.trim()) score += 1.5;
  else issues.push("Open Graph title missing");

  if (ogDesc.trim()) score += 1.5;
  else issues.push("Open Graph description missing");

  if (ogImage.trim()) score += 1;
  else issues.push("Open Graph image missing");

  const twTitle = input.twitterTitle || ogTitle;
  const twDesc = input.twitterDescription || ogDesc;
  if (twTitle.trim() && twDesc.trim()) score += 1;

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);

  const checks = [
    {
      label: ogTitle.trim() ? "Open Graph title set" : "Open Graph title missing",
      passed: !!ogTitle.trim(),
      fix: "Set an Open Graph title (or fill in SEO title — it will be used as fallback).",
    },
    {
      label: ogDesc.trim() ? "Open Graph description set" : "Open Graph description missing",
      passed: !!ogDesc.trim(),
      fix: "Set an Open Graph description (or fill in meta description).",
    },
    {
      label: ogImage.trim() ? "Open Graph image set" : "Open Graph image missing",
      passed: !!ogImage.trim(),
      fix: "Add an Open Graph image (1200×630 recommended) or set a cover image.",
    },
    {
      label:
        twTitle.trim() && twDesc.trim()
          ? "Twitter card title and description set"
          : "Twitter card fields incomplete",
      passed: !!(twTitle.trim() && twDesc.trim()),
      fix: "Fill in Twitter title and description (or they will fall back to Open Graph fields).",
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Social SEO",
    message:
      issues.length === 0
        ? "Social sharing metadata is configured."
        : `Social SEO issues: ${issues.join(", ")}.`,
    problem: failedChecks.length > 0 ? failedChecks.map((c) => c.label).join("; ") : undefined,
    whyItMatters:
      "Open Graph and Twitter metadata control how your article appears when shared on social platforms.",
    howToFix: failedChecks[0]?.fix,
    checks,
  };
}
