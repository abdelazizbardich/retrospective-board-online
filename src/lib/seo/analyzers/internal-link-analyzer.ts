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

  const checks = [
    {
      label:
        blogLinks.length >= 3
          ? `${blogLinks.length} internal blog links (excellent)`
          : blogLinks.length >= 2
            ? `${blogLinks.length} internal blog links (good)`
            : blogLinks.length >= 1
              ? `Only ${blogLinks.length} internal blog link (aim for 2–4)`
              : "No internal blog links",
      passed: blogLinks.length >= 2,
      fix: "Add 2–4 links to other blog posts on your site.",
    },
    {
      label:
        blogLinks.length === 0 || descriptive.length === blogLinks.length
          ? "All anchor text is descriptive"
          : "Some anchor text is generic (click here, read more…)",
      passed: blogLinks.length === 0 || descriptive.length === blogLinks.length,
      fix: "Replace generic links like “click here” with descriptive phrases about the linked article.",
    },
    {
      label:
        blogLinks.length >= 3
          ? "3+ blog links for strong internal linking"
          : `${blogLinks.length}/3 recommended blog links`,
      passed: blogLinks.length >= 3,
      fix: "Add more relevant links to related articles (3+ is ideal).",
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);

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
      failedChecks.length > 0
        ? failedChecks.map((c) => c.label).join("; ")
        : undefined,
    whyItMatters:
      "Internal links help distribute authority and guide readers to related content on your site.",
    howToFix: failedChecks[0]?.fix,
    checks,
  };
}
