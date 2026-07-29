import type { SeoAnalysisResult, SeoPostInput } from "../types";
import { SEO_WEIGHTS } from "../types";
import { clampScore, parseHtmlContent, statusFromScore } from "../utils";
import { generateBlogSchema, validateSchema } from "../schema-generator";

export function analyzeSchema(input: SeoPostInput): SeoAnalysisResult {
  const maxScore = SEO_WEIGHTS.schema;
  const schema = generateBlogSchema(input);
  const validation = validateSchema(schema);
  let score = 0;

  if (validation.valid) score += 3;
  if (schema["@type"]) score += 1;
  if (schema.headline && schema.description) score += 1;

  const content = parseHtmlContent(input.content);
  if (content.hasFaq && input.schemaType === "FAQPage") score += 1;
  else if (!content.hasFaq) score += 0.5;

  const ratio = score / maxScore;
  const status = validation.valid ? statusFromScore(ratio) : "failed";

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Schema",
    message: validation.valid
      ? `${input.schemaType || "BlogPosting"} schema is valid.`
      : `Schema validation issues: ${validation.errors.join(", ")}.`,
    problem: !validation.valid ? validation.errors.join("; ") : undefined,
    whyItMatters:
      "Structured data helps search engines display rich results like article snippets and FAQs.",
    howToFix: !validation.valid
      ? "Fill in missing fields (title, description, author) to generate valid schema."
      : content.hasFaq && input.schemaType !== "FAQPage"
        ? "Consider using FAQPage schema since your article has an FAQ section."
        : undefined,
  };
}
