import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";
import { getPage } from "@/lib/page-store";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sprintsplans.com";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page?.published) return {};
  return {
    title: page.title,
    description: page.metaDescription || undefined,
    alternates: { canonical: `${SITE_URL}/p/${slug}` },
    openGraph: {
      title: page.title,
      description: page.metaDescription || undefined,
      url: `${SITE_URL}/p/${slug}`,
      type: "website",
    },
  };
}

export default async function PublicPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page?.published) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* Content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>
        <div
          className="prose prose-neutral dark:prose-invert max-w-none mt-8"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
