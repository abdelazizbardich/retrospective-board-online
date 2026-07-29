import { analyzeContent } from "./analyzers/content-analyzer";
import { analyzeContentStructure } from "./analyzers/structure-analyzer";
import { analyzeExternalLinks } from "./analyzers/external-link-analyzer";
import { analyzeImages } from "./analyzers/image-analyzer";
import { analyzeInternalLinks } from "./analyzers/internal-link-analyzer";
import { analyzeKeywords } from "./analyzers/keyword-analyzer";
import { analyzeMetaDescription } from "./analyzers/meta-description-analyzer";
import { analyzeReadability } from "./analyzers/readability-analyzer";
import { analyzeSchema } from "./analyzers/schema-analyzer";
import { analyzeSlug } from "./analyzers/slug-analyzer";
import { analyzeSocial } from "./analyzers/social-analyzer";
import { analyzeTitle } from "./analyzers/title-analyzer";
import type { InternalLinkSuggestion, SeoAnalysisOutput, SeoPostInput, SeoRecommendation } from "./types";
import { getSeoRating } from "./types";
import { makeRecommendation, parseHtmlContent } from "./utils";
import { findInternalLinkSuggestions, type LinkCandidatePost } from "./internal-linking";

export interface SeoAnalyzerOptions {
  existingTitles?: string[];
  existingDescriptions?: string[];
  allPosts?: { slug: string; title: string; content: string; category: string; tags: string }[];
}

export class SeoAnalyzerService {
  static analyze(input: SeoPostInput, options: SeoAnalyzerOptions = {}): SeoAnalysisOutput {
    const parsed = parseHtmlContent(input.content);

    const categories = [
      analyzeTitle(input, options.existingTitles),
      analyzeMetaDescription(input, options.existingDescriptions),
      analyzeKeywords(input, parsed),
      analyzeContent(input, parsed),
      analyzeContentStructure(input, parsed),
      analyzeInternalLinks(input.content, parsed),
      analyzeReadability(input.content, parsed),
      analyzeImages(input, parsed),
      analyzeSlug(input),
      analyzeSchema(input),
      analyzeSocial(input),
    ];

    const totalScore = categories.reduce((sum, c) => sum + c.score, 0);
    const maxTotal = categories.reduce((sum, c) => sum + c.maxScore, 0);
    const normalizedScore = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0;

    const recommendations = SeoAnalyzerService.buildRecommendations(categories);

    return {
      totalScore: normalizedScore,
      rating: getSeoRating(normalizedScore),
      categories,
      recommendations,
    };
  }

  static getInternalLinkSuggestions(
    input: SeoPostInput,
    allPosts: SeoAnalyzerOptions["allPosts"] = []
  ): InternalLinkSuggestion[] {
    if (!allPosts || allPosts.length === 0) return [];
    return findInternalLinkSuggestions(
      {
        slug: input.slug,
        title: input.title,
        content: input.content,
        category: input.category,
        tags: input.tags,
        focusKeyword: input.focusKeyword,
      },
      allPosts as LinkCandidatePost[]
    );
  }

  private static buildRecommendations(
    categories: ReturnType<typeof analyzeTitle>[]
  ): SeoRecommendation[] {
    const recs: SeoRecommendation[] = [];

    for (const cat of categories) {
      if (cat.status === "passed") continue;
      if (!cat.problem || !cat.howToFix) continue;

      recs.push(
        makeRecommendation(
          cat.title.toLowerCase().replace(/\s+/g, "-"),
          cat.title,
          cat.status,
          cat.problem,
          cat.whyItMatters ?? "This affects your search visibility.",
          cat.howToFix
        )
      );
    }

    return recs;
  }
}

export {
  analyzeTitle,
  analyzeMetaDescription,
  analyzeKeywords,
  analyzeContent,
  analyzeContentStructure,
  analyzeInternalLinks,
  analyzeExternalLinks,
  analyzeReadability,
  analyzeImages,
  analyzeSlug,
  analyzeSchema,
  analyzeSocial,
};
