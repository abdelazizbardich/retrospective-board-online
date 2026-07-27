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
  const url = `${SITE_URL}/blog/${post.slug}`;
  const description = post.metaDescription || post.excerpt || undefined;
  const coverImage = toAbsoluteUrl(getPostCoverImage(post));

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
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
