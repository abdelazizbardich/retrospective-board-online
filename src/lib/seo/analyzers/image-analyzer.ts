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

  if (input.coverImage.trim()) {
    const coverAlt = input.coverImageAlt.trim();
    if (!coverAlt) issues.push("featured image missing alt text");
    else if (coverAlt.length < 5) issues.push("featured image alt text is too short");
    else if (isKeywordStuffed(input.focusKeyword, coverAlt)) {
      issues.push("featured image alt text may be keyword-stuffed");
      score = Math.max(0, score - 1);
    } else {
      score += 1;
    }
  }

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

  const coverAlt = input.coverImageAlt.trim();
  const coverAltOk = Boolean(
    input.coverImage.trim() &&
      coverAlt.length >= 5 &&
      !isKeywordStuffed(input.focusKeyword, coverAlt)
  );
  const contentAltOk =
    contentImages.length === 0 || withAlt.length === contentImages.length;
  const descriptiveOk =
    (!input.coverImage.trim() || coverAltOk) &&
    (withAlt.length === 0 ||
      (descriptiveAlt.length === withAlt.length &&
        !withAlt.some((img) => isKeywordStuffed(input.focusKeyword, img.alt))));

  const checks = [
    {
      label: input.coverImage.trim() ? "Featured / cover image set" : "No featured image",
      passed: !!input.coverImage.trim(),
      fix: "Add a featured cover image for social sharing and search results.",
    },
    {
      label: coverAltOk
        ? "Cover image has descriptive alt text"
        : !input.coverImage.trim()
          ? "Cover image alt text (no image to check)"
          : !coverAlt
            ? "Cover image missing alt text"
            : coverAlt.length < 5
              ? "Cover image alt text too short"
              : "Cover image alt text may be keyword-stuffed",
      passed: !input.coverImage.trim() || coverAltOk,
      fix: "Add alt text (5+ characters) that describes what the cover image shows.",
    },
    {
      label:
        contentImages.length > 0
          ? `${contentImages.length} image(s) in content`
          : "No images in article body (optional)",
      passed: true,
    },
    {
      label: contentAltOk
        ? "All content images have alt text"
        : `${contentImages.length - withAlt.length} content image(s) missing alt text`,
      passed: contentAltOk,
      fix: "Add descriptive alt text to every image in the article body.",
    },
    {
      label: descriptiveOk
        ? "Alt text is descriptive and natural"
        : "Some alt text is too short or keyword-stuffed",
      passed: descriptiveOk,
      fix: "Write natural alt text (5+ chars) that describes each image — avoid repeating the focus keyword.",
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Images",
    message:
      issues.length === 0
        ? `Featured image with alt text. ${contentImages.length} content image${contentImages.length !== 1 ? "s" : ""} checked.`
        : `Image issues: ${issues.join(", ")}.`,
    problem: failedChecks.length > 0 ? failedChecks.map((c) => c.label).join("; ") : undefined,
    whyItMatters:
      "Images with descriptive alt text improve accessibility and help search engines understand visual content.",
    howToFix: failedChecks[0]?.fix,
    checks,
  };
}
