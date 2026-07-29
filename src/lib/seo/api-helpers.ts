export function parseSeoFieldsFromBody(body: Record<string, unknown>) {
  return {
    ...(body.focusKeyword !== undefined && { focusKeyword: String(body.focusKeyword).trim().slice(0, 100) }),
    ...(body.secondaryKeywords !== undefined && { secondaryKeywords: String(body.secondaryKeywords).trim().slice(0, 300) }),
    ...(body.seoTitle !== undefined && { seoTitle: String(body.seoTitle).trim().slice(0, 200) }),
    ...(body.canonicalUrl !== undefined && { canonicalUrl: String(body.canonicalUrl).trim().slice(0, 500) }),
    ...(body.robotsIndex !== undefined && { robotsIndex: body.robotsIndex !== false }),
    ...(body.robotsFollow !== undefined && { robotsFollow: body.robotsFollow !== false }),
    ...(body.ogTitle !== undefined && { ogTitle: String(body.ogTitle).trim().slice(0, 200) }),
    ...(body.ogDescription !== undefined && { ogDescription: String(body.ogDescription).trim().slice(0, 300) }),
    ...(body.ogImage !== undefined && { ogImage: String(body.ogImage).trim().slice(0, 500) }),
    ...(body.twitterTitle !== undefined && { twitterTitle: String(body.twitterTitle).trim().slice(0, 200) }),
    ...(body.twitterDescription !== undefined && { twitterDescription: String(body.twitterDescription).trim().slice(0, 300) }),
    ...(body.twitterImage !== undefined && { twitterImage: String(body.twitterImage).trim().slice(0, 500) }),
    ...(body.schemaType !== undefined && { schemaType: String(body.schemaType).trim().slice(0, 50) }),
  };
}

export const EMPTY_SEO_FORM = {
  focusKeyword: "",
  secondaryKeywords: "",
  seoTitle: "",
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
};
