import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BOARD_TEMPLATES } from "@/lib/types";
import { SITE_URL } from "@/lib/config";
import { buildDocumentTitle } from "@/lib/seo/meta";
import { getTemplatePage, templateLandingPath } from "@/lib/template-pages";
import { TemplateLanding } from "../template-landing";

export const dynamicParams = false;

export function generateStaticParams() {
  return BOARD_TEMPLATES.map((template) => ({ slug: template.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getTemplatePage(slug);
  if (!page) return {};

  const canonical = `${SITE_URL}${templateLandingPath(slug)}`;
  return {
    title: buildDocumentTitle(page.seoTitle),
    description: page.metaDescription,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      type: "website",
      title: page.ogTitle,
      description: page.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: page.ogTitle,
      description: page.ogDescription,
    },
  };
}

export default async function TemplatePage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const page = getTemplatePage(slug);
  if (!page) notFound();
  return <TemplateLanding page={page} />;
}
