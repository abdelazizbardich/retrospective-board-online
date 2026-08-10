export type SeoStatus = "passed" | "warning" | "failed";

export interface SeoCheckItem {
  label: string;
  passed: boolean;
  /** Short hint shown when this check failed or only partially passed */
  fix?: string;
}

export interface SeoAnalysisResult {
  score: number;
  maxScore: number;
  status: SeoStatus;
  title: string;
  message: string;
  recommendation?: string;
  problem?: string;
  whyItMatters?: string;
  howToFix?: string;
  /** Per-criterion breakdown so authors know exactly what to improve */
  checks?: SeoCheckItem[];
}

export interface SeoRecommendation {
  id: string;
  category: string;
  status: SeoStatus;
  problem: string;
  whyItMatters: string;
  howToFix: string;
}

export interface SeoAnalysisOutput {
  totalScore: number;
  rating: "Poor" | "Needs Improvement" | "Good" | "Excellent";
  categories: SeoAnalysisResult[];
  recommendations: SeoRecommendation[];
}

export interface SeoPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  tags: string;
  category: string;
  author: string;
  focusKeyword: string;
  secondaryKeywords: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  schemaType: string;
}

export interface ParsedContent {
  plainText: string;
  wordCount: number;
  headings: { level: number; text: string }[];
  paragraphs: string[];
  images: { src: string; alt: string }[];
  internalLinks: { href: string; text: string }[];
  externalLinks: { href: string; text: string }[];
  hasBulletList: boolean;
  hasNumberedList: boolean;
  hasTable: boolean;
  hasFaq: boolean;
}

export interface InternalLinkSuggestion {
  slug: string;
  title: string;
  relevance: number;
  suggestedAnchor: string;
}

export const SEO_WEIGHTS = {
  seoTitle: 15,
  metaDescription: 10,
  focusKeyword: 10,
  contentQuality: 15,
  contentStructure: 10,
  internalLinks: 10,
  readability: 10,
  images: 5,
  urlSlug: 5,
  schema: 5,
  socialSeo: 5,
} as const;

export function getSeoRating(score: number): SeoAnalysisOutput["rating"] {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Improvement";
  return "Poor";
}

export function emptySeoFields() {
  return {
    focusKeyword: "",
    secondaryKeywords: "",
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    schemaType: "BlogPosting",
    seoScore: 0,
    seoAnalysis: null as SeoAnalysisOutput | null,
  };
}
