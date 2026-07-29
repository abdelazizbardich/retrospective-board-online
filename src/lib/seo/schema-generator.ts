import { SITE_NAME, SITE_URL } from "@/lib/config";
import type { SeoPostInput } from "./types";
import { parseHtmlContent } from "./utils";

export function generateBlogSchema(
  input: SeoPostInput & { createdAt?: number; updatedAt?: number }
): Record<string, unknown> {
  const schemaType = input.schemaType || "BlogPosting";
  const url = input.canonicalUrl || `${SITE_URL}/blog/${input.slug}`;
  const description = input.metaDescription || input.excerpt || "";
  const image = input.ogImage || input.coverImage || "";
  const absoluteImage = image.startsWith("http") ? image : image ? `${SITE_URL}${image}` : "";

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: input.seoTitle || input.title,
    description,
    ...(absoluteImage ? { image: [absoluteImage] } : {}),
    ...(input.author
      ? {
          author: {
            "@type": "Person",
            name: input.author,
          },
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/sprintsplans-logo.png`,
      },
    },
    ...(input.createdAt
      ? { datePublished: new Date(input.createdAt).toISOString() }
      : {}),
    ...(input.updatedAt
      ? { dateModified: new Date(input.updatedAt).toISOString() }
      : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };

  if (schemaType === "FAQPage") {
    const content = parseHtmlContent(input.content);
    const faqHeadings = content.headings.filter((h) =>
      /faq|frequently asked/i.test(h.text)
    );
    if (faqHeadings.length > 0) {
      base.mainEntity = [];
    }
  }

  return base;
}

export function validateSchema(schema: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!schema["@context"]) errors.push("Missing @context");
  if (!schema["@type"]) errors.push("Missing @type");
  if (!schema.headline) errors.push("Missing headline");
  if (!schema.description) errors.push("Missing description");

  return { valid: errors.length === 0, errors };
}

export function generateBreadcrumbSchema(slug: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };
}
