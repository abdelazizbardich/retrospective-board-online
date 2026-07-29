/** Short hover explanations for each SEO score category in the editor panel. */
export const SEO_CATEGORY_TOOLTIPS: Record<string, string> = {
  "SEO Title":
    "The headline shown in Google results. Checks length (50–60 chars), focus keyword placement, uniqueness, and click appeal.",
  "Meta Description":
    "The snippet under your title in search results. Checks length (140–160 chars), keyword use, and a clear call to action.",
  "Focus Keyword":
    "Your primary target phrase. Checks that it appears naturally in the title, meta description, headings, and body without overuse.",
  "Content Quality":
    "Article depth and substance. Checks word count, paragraph coverage, and whether the content fully addresses the topic.",
  "Content Structure":
    "How scannable the post is. Checks heading hierarchy (H2/H3), lists, tables, and FAQ sections.",
  "Internal Links":
    "Links to other posts on your site. Checks how many blog links you have and whether anchor text is descriptive.",
  "Readability":
    "How easy the post is to read. Checks sentence length, paragraph length, and passive voice.",
  "Images":
    "Visual content SEO. Checks that images are present and include descriptive alt text.",
  "URL / Slug":
    "The post permalink. Checks length, keyword inclusion, and a clean, readable format.",
  Schema:
    "Structured data (JSON-LD) for search engines. Checks validity and completeness for rich result eligibility.",
  "Social SEO":
    "Open Graph and Twitter card fields. Controls how your article preview looks when shared on social platforms.",
  "External Links":
    "Links to authoritative outside sources. Checks that credible references are included where appropriate.",
};

export function getCategoryTooltip(title: string, whyItMatters?: string): string {
  return SEO_CATEGORY_TOOLTIPS[title] ?? whyItMatters ?? title;
}
