export type CompareFaq = {
  question: string;
  answer: string;
};

export type CompareRow = {
  label: string;
  competitor: string;
  sprintsplans: string;
};

export type ComparePageContent = {
  slug: string;
  competitorName: string;
  competitorUrl: string;
  competitorPricingUrl: string;
  badge: string;
  h1Lead: string;
  h1Accent: string;
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  intro: string;
  bestFor: string;
  pricingSnapshot: string;
  whoHeading: string;
  whoCompetitorHeading: string;
  whoCompetitor: string[];
  whoUsHeading: string;
  whoUs: string[];
  tableHeading: string;
  tableIntro: string;
  rows: CompareRow[];
  pricingHeading: string;
  pricingParagraphs: string[];
  pickUsHeading: string;
  pickUs: string[];
  pickThemHeading: string;
  pickThem: string[];
  switchHeading: string;
  switchSteps: string[];
  faqs: CompareFaq[];
  relatedSlugs: string[];
  relatedTemplates: string[];
  ctaHeading: string;
  ctaBody: string;
  ctaHref: string;
};

export type CompareHubContent = {
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  h1: string;
  intro: string;
  chooseHeading: string;
  chooseParagraphs: string[];
  faqs: CompareFaq[];
  ctaHeading: string;
  ctaBody: string;
  pricingNote: string;
};
