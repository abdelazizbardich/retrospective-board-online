import type { BlogPost } from "@/lib/blog-store";
import { getPostCoverImage } from "@/lib/blog-thumbnail";
import { SITE_NAME, SITE_URL } from "@/lib/config";

function toAbsoluteUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: toAbsoluteUrl("/sprintsplans-logo.png"),
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/sprintsplans-logo.png"),
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function blogPostingSchema(post: BlogPost) {
  const url = post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
  const description = post.metaDescription || post.excerpt || undefined;
  const coverImage = toAbsoluteUrl(post.ogImage || getPostCoverImage(post));
  const headline = post.seoTitle || post.title;

  return {
    "@context": "https://schema.org",
    "@type": post.schemaType || "BlogPosting",
    headline,
    description,
    image: [coverImage],
    author: post.author
      ? {
          "@type": "Person",
          name: post.author,
          url: `${SITE_URL}/blog`,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/sprintsplans-logo.png"),
      },
    },
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.tags
      ? {
          keywords: post.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
            .join(", "),
        }
      : {}),
  };
}

export function webPageSchema(input: {
  name: string;
  path: string;
  description: string;
  type?: "WebPage" | "CollectionPage";
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    name: input.name,
    url: `${SITE_URL}${input.path}`,
    description: input.description,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbListSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}

export function itemListSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  };
}
