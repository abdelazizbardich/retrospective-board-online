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

  const checks = [
    {
      label: validation.valid ? "Schema passes validation" : `Validation errors: ${validation.errors.join(", ")}`,
      passed: validation.valid,
      fix: "Fill in missing fields (title, description, author) to generate valid schema.",
    },
    {
      label: schema["@type"] ? `Schema type: ${schema["@type"]}` : "Schema @type missing",
      passed: !!schema["@type"],
      fix: "Select a schema type (BlogPosting, Article, or FAQPage).",
    },
    {
      label:
        schema.headline && schema.description
          ? "Headline and description present"
          : "Missing headline or description",
      passed: !!(schema.headline && schema.description),
      fix: "Ensure SEO title and meta description are filled in.",
    },
    {
      label:
        content.hasFaq && input.schemaType === "FAQPage"
          ? "FAQPage schema matches FAQ content"
          : content.hasFaq && input.schemaType !== "FAQPage"
            ? "Article has FAQ section but schema is not FAQPage"
            : "FAQ schema not applicable",
      passed: !content.hasFaq || input.schemaType === "FAQPage",
      fix: "Switch schema type to FAQPage since your article has an FAQ section.",
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    status,
    title: "Schema",
    message: validation.valid
      ? `${input.schemaType || "BlogPosting"} schema is valid.`
      : `Schema validation issues: ${validation.errors.join(", ")}.`,
    problem: failedChecks.length > 0 ? failedChecks.map((c) => c.label).join("; ") : undefined,
    whyItMatters:
      "Structured data helps search engines display rich results like article snippets and FAQs.",
    howToFix: failedChecks[0]?.fix,
    checks,
  };
}
