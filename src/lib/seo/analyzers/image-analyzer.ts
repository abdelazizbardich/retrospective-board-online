import type { ParsedContent, SeoAnalysisResult, SeoPostInput } from "../types";
import { SEO_WEIGHTS } from "../types";
import { clampScore, isKeywordStuffed, parseHtmlContent, statusFromScore } from "../utils";

export function analyzeImages(
  input: SeoPostInput,
  parsed?: ParsedContent
): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.images;
  const content = parsed ?? parseHtmlContent(input.content);
  let score = 0;
  const issues: string[] = [];

  if (input.coverImage.trim()) score += 2;
  else issues.push("no featured image");

  const contentImages = content.images;
  if (contentImages.length > 0) score += 1;

  const withAlt = contentImages.filter((img) => img.alt.trim().length > 0);
  if (contentImages.length === 0) {
    score += 1; // no penalty if no content images
  } else if (withAlt.length === contentImages.length) {
    score += 1;
  } else {
    issues.push(`${contentImages.length - withAlt.length} image(s) missing alt text`);
  }

  const descriptiveAlt = withAlt.filter(
    (img) => img.alt.length >= 5 && !isKeywordStuffed(input.focusKeyword, img.alt)
  );
  if (withAlt.length > 0 && descriptiveAlt.length === withAlt.length) score += 1;
  else if (withAlt.some((img) => isKeywordStuffed(input.focusKeyword, img.alt))) {
    issues.push("alt text may be keyword-stuffed");
    score = Math.max(0, score - 1);
  }

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Images",
    message:
      issues.length === 0
        ? `Featured image set. ${contentImages.length} content image${contentImages.length !== 1 ? "s" : ""} with alt text.`
        : `Image issues: ${issues.join(", ")}.`,
    problem: issues.length > 0 ? issues.join("; ") : undefined,
    whyItMatters:
      "Images with descriptive alt text improve accessibility and help search engines understand visual content.",
    howToFix: !input.coverImage.trim()
      ? "Add a featured cover image for social sharing and search results."
      : issues.some((i) => i.includes("alt"))
        ? "Add descriptive alt text to all images that describes what the image shows."
        : undefined,
  };
}
