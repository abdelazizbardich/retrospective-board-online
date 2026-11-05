import { BOARD_TEMPLATES } from "@/lib/types";
import { classicPage } from "./classic";
import { fourLsPage } from "./four-ls";
import { madSadGladPage } from "./mad-sad-glad";
import { sailboatPage } from "./sailboat";
import { starfishPage } from "./starfish";
import { startStopContinuePage } from "./start-stop-continue";
import type { TemplatePageContent } from "./types";

export type { TemplateFaq, TemplateHubContent, TemplatePageContent } from "./types";
export { templateHub } from "./hub";

const PAGES: Record<string, TemplatePageContent> = {
  classic: classicPage,
  "4ls": fourLsPage,
  "start-stop-continue": startStopContinuePage,
  "mad-sad-glad": madSadGladPage,
  sailboat: sailboatPage,
  starfish: starfishPage,
};

export function getTemplatePage(slug: string): TemplatePageContent | undefined {
  return PAGES[slug];
}

export function getAllTemplatePages(): TemplatePageContent[] {
  return BOARD_TEMPLATES.map((template) => {
    const page = PAGES[template.id];
    if (!page) {
      throw new Error(`Missing landing page copy for template "${template.id}"`);
    }
    return page;
  });
}

export function templateLandingPath(slug: string): string {
  return `/templates/${slug}`;
}

export function templateCreatePath(slug: string): string {
  return `/create?template=${slug}`;
}

export function templatePageWordCount(page: TemplatePageContent): number {
  const chunks = [
    page.intro,
    ...page.whatParagraphs,
    page.whenIntro,
    ...page.whenItems,
    ...page.whenSkip,
    page.columnsIntro,
    ...page.columns.map((column) => `${column.title} ${column.description}`),
    ...page.tips.map((tip) => `${tip.title} ${tip.body}`),
    ...page.howSteps,
    page.featuresIntro ?? "",
    ...(page.features ?? []).map((feature) => `${feature.title} ${feature.description}`),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
    page.ctaBody,
  ];
  return chunks
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
