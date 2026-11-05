import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/config";
import { buildDocumentTitle } from "@/lib/seo/meta";
import { compareLandingPath, getAllComparePages, getComparePage } from "@/lib/compare-pages";
import { CompareLanding } from "../compare-landing";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllComparePages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) return {};

  const canonical = `${SITE_URL}${compareLandingPath(slug)}`;
  return {
    title: buildDocumentTitle(page.seoTitle),
    description: page.metaDescription,
    alternates: { canonical },
    robots: { index: true, follow: true },
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

export default async function ComparePage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();
  return <CompareLanding page={page} />;
}
