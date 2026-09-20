/** Old blog slugs that still appear in content or external links → current published slug. */
export const LEGACY_BLOG_SLUG_REDIRECTS: Record<string, string> = {
  "10-best-parabol-alternatives-for-agile-retrospectives-in-2026": "parabol-alternatives",
  "agile-retrospective": "online-retrospective-tools",
  "agile-retrospective-anti-patterns": "retrospective-fatigue-solutions",
  "run-sprint-retrospective": "first-sprint-retrospective-guide",
  "sprint-retrospective-template": "kalm-retrospective-template",
};

export function rewriteLegacyBlogLinks(html: string): string {
  let out = html;
  for (const [fromSlug, toSlug] of Object.entries(LEGACY_BLOG_SLUG_REDIRECTS)) {
    const patterns = [
      `/blog/${fromSlug}`,
      `https://sprintsplans.com/blog/${fromSlug}`,
      `http://sprintsplans.com/blog/${fromSlug}`,
    ];
    for (const pattern of patterns) {
      out = out.split(pattern).join(pattern.replace(fromSlug, toSlug));
    }
  }
  return out;
}
