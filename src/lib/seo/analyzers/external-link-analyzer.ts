import type { ParsedContent, SeoAnalysisResult } from "../types";
import { parseHtmlContent } from "../utils";

export function analyzeExternalLinks(
  contentHtml: string,
  parsed?: ParsedContent
): SeoAnalysisResult {
  const content = parsed ?? parseHtmlContent(contentHtml);  const links = content.externalLinks;

  const descriptive = links.filter(
    (l) => l.text.trim().length > 3 && !/^(click here|read more|here|link)$/i.test(l.text.trim())
  );

  const status =
    links.length === 0
      ? "warning"
      : descriptive.length === links.length
        ? "passed"
        : "warning";

  return {
    score: links.length > 0 && descriptive.length === links.length ? 3 : links.length > 0 ? 2 : 1,
    maxScore: 3,
    status,
    title: "External Links",
    message:
      links.length === 0
        ? "No external links. Consider adding authoritative references when relevant."
        : `${links.length} external link${links.length !== 1 ? "s" : ""} found.`,
    problem:
      links.length > 0 && descriptive.length < links.length
        ? "Some external links use non-descriptive anchor text."
        : undefined,
    whyItMatters:
      "Linking to authoritative sources can support claims and improve trust, but is not required for every article.",
    howToFix:
      links.length === 0
        ? "Add 1–2 links to reputable sources when citing data or external concepts."
        : "Use descriptive anchor text that tells readers what they will find at the destination.",
  };
}
