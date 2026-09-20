const META_DESCRIPTION_MIN = 70;
const META_DESCRIPTION_MAX = 160;
const DOCUMENT_TITLE_MAX = 60;
const SITE_TITLE_SUFFIX = " | SprintsPlans";

/** Keep meta descriptions within common SERP snippet limits. */
export function clampMetaDescription(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const trimmed = text.trim();
  if (trimmed.length <= META_DESCRIPTION_MAX) return trimmed;
  return `${trimmed.slice(0, META_DESCRIPTION_MAX - 1).trimEnd()}…`;
}

/** Build a document title that does not rely on the root layout template. */
/** Pad or generate meta descriptions that are too short for SERP snippets. */
export function ensureMetaDescription(
  description: string | undefined,
  topic: string
): string {
  const clamped = clampMetaDescription(description);
  if (clamped && clamped.length >= META_DESCRIPTION_MIN) return clamped;
  const topicClean = topic.trim().replace(/\s+/g, " ");
  const generated = `Explore SprintsPlans articles on ${topicClean} — agile retrospective guides, templates, and facilitation tips for software teams.`;
  return clampMetaDescription(generated) ?? generated.slice(0, META_DESCRIPTION_MAX);
}

export function buildDocumentTitle(baseTitle: string): { absolute: string } {
  const maxBase = DOCUMENT_TITLE_MAX - SITE_TITLE_SUFFIX.length;
  let base = baseTitle.trim();
  if (base.length > maxBase) {
    base = `${base.slice(0, maxBase - 1).trimEnd()}…`;
  }
  return { absolute: `${base}${SITE_TITLE_SUFFIX}` };
}
