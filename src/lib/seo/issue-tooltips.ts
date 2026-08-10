/** Short hover explanations for SEO dashboard issue badges. */
export const SEO_ISSUE_TOOLTIPS: Record<string, string> = {
  "No meta":
    "This post has no meta description. Search engines may auto-generate a snippet, which is less compelling in results.",
  "No keyword":
    "No focus keyword is set. A target phrase helps align the title, meta description, and content for ranking.",
  "No cover":
    "No featured cover image. Cover images improve social shares and can appear in rich search results.",
  "No cover alt":
    "The cover image has no alt text (or it is too short). Alt text helps accessibility and search engines understand the image.",
  "No links":
    "This post links to no other blog articles. Internal links help readers discover related content and spread SEO value.",
  Orphan:
    "No other published posts link to this article. Orphan pages are harder for search engines and readers to discover.",
  "Long title":
    "The SEO title exceeds 70 characters and may be truncated in Google search results.",
  "Long meta":
    "The meta description exceeds 170 characters and may be cut off in search result snippets.",
};

export function getIssueTooltip(issue: string): string {
  return SEO_ISSUE_TOOLTIPS[issue] ?? issue;
}
