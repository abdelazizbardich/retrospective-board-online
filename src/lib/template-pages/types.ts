export type TemplateFaq = {
  question: string;
  answer: string;
};

export type TemplateColumnCopy = {
  title: string;
  emoji: string;
  color: string;
  description: string;
  sampleNotes: string[];
};

export type TemplateTip = {
  title: string;
  body: string;
};

export type TemplateFeature = {
  title: string;
  description: string;
};

export type TemplatePageContent = {
  slug: string;
  name: string;
  badge: string;
  h1Lead: string;
  h1Accent: string;
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  intro: string;
  bestFor: string;
  whatHeading: string;
  whatParagraphs: string[];
  whenHeading: string;
  whenIntro: string;
  whenItems: string[];
  whenSkipHeading: string;
  whenSkip: string[];
  columnsHeading: string;
  columnsIntro: string;
  columns: TemplateColumnCopy[];
  tipsHeading: string;
  tips: TemplateTip[];
  howHeading: string;
  howSteps: string[];
  featuresHeading?: string;
  featuresIntro?: string;
  features?: TemplateFeature[];
  faqs: TemplateFaq[];
  relatedSlugs: string[];
  ctaHeading: string;
  ctaBody: string;
};

export type TemplateHubContent = {
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  h1: string;
  intro: string;
  chooseHeading: string;
  chooseParagraphs: string[];
  faqs: TemplateFaq[];
  ctaHeading: string;
  ctaBody: string;
};
