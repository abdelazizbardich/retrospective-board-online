import type { ParsedContent, SeoAnalysisResult } from "../types";
import { SEO_WEIGHTS } from "../types";
import { clampScore, parseHtmlContent, statusFromScore } from "../utils";

export function analyzeInternalLinks(
  contentHtml: string,
  parsed?: ParsedContent
): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.internalLinks;
  const content = parsed ?? parseHtmlContent(contentHtml);
  const links = content.internalLinks;
  let score = 0;
  const issues: string[] = [];

  const blogLinks = links.filter((l) => l.href.includes("/blog/"));

  if (blogLinks.length >= 3) score += 6;
  else if (blogLinks.length >= 2) score += 4;
  else if (blogLinks.length >= 1) score += 2;
  else issues.push("no internal links to other blog posts");

  const descriptive = blogLinks.filter(
    (l) => l.text.trim().length > 3 && !/^(click here|read more|here|link)$/i.test(l.text.trim())
  );
  if (descriptive.length === blogLinks.length && blogLinks.length > 0) score += 2;
  else if (blogLinks.length > 0) issues.push("some anchor text is not descriptive");

  const genericAnchors = blogLinks.filter((l) =>
    /^(click here|read more|here|link)$/i.test(l.text.trim())
  );
  if (genericAnchors.length === 0 && blogLinks.length > 0) score += 2;

  const ratio = score / maxScore;
  const status = statusFromScore(ratio);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Internal Links",
    message:
      blogLinks.length >= 2
        ? `${blogLinks.length} internal blog links found.`
        : `Only ${blogLinks.length} internal blog link${blogLinks.length !== 1 ? "s" : ""} found.`,
    problem:
      blogLinks.length < 2
        ? `Your article contains only ${blogLinks.length} internal link${blogLinks.length !== 1 ? "s" : ""}.`
        : genericAnchors.length > 0
          ? "Some internal links use generic anchor text like 'click here'."
          : undefined,
    whyItMatters:
      "Internal links help distribute authority and guide readers to related content on your site.",
    howToFix:
      blogLinks.length < 2
        ? "Add 2–4 relevant links to other SprintsPlans articles with descriptive anchor text."
        : "Replace generic anchor text with descriptive phrases that describe the linked article.",
  };
}
