import { easyretroPage } from "./easyretro";
import { miroPage } from "./miro";
import { parabolPage } from "./parabol";
import { retriumPage } from "./retrium";
import { teamretroPage } from "./teamretro";
import type { ComparePageContent } from "./types";

export type { CompareFaq, CompareHubContent, ComparePageContent, CompareRow } from "./types";
export { compareHub } from "./hub";

const PAGES: ComparePageContent[] = [
  easyretroPage,
  retriumPage,
  teamretroPage,
  parabolPage,
  miroPage,
];

const PAGES_BY_SLUG: Record<string, ComparePageContent> = Object.fromEntries(
  PAGES.map((page) => [page.slug, page])
);

export function getComparePage(slug: string): ComparePageContent | undefined {
  return PAGES_BY_SLUG[slug];
}

export function getAllComparePages(): ComparePageContent[] {
  return PAGES;
}

export function compareLandingPath(slug: string): string {
  return `/compare/${slug}`;
}

export function comparePageWordCount(page: ComparePageContent): number {
  const chunks = [
    page.intro,
    page.bestFor,
    page.pricingSnapshot,
    ...page.whoCompetitor,
    ...page.whoUs,
    page.tableIntro,
    ...page.rows.map((row) => `${row.label} ${row.competitor} ${row.sprintsplans}`),
    ...page.pricingParagraphs,
    ...page.pickUs,
    ...page.pickThem,
    ...page.switchSteps,
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
    page.ctaBody,
  ];
  return chunks
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
