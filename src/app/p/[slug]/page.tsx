import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { getPage } from "@/lib/page-store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://retroboard.app";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || !page.published) return {};
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page || !page.published) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <LayoutGrid className="size-6 text-primary" />
            <span>SprintsPlans</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>
        <div
          className="prose prose-neutral dark:prose-invert max-w-none mt-8"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SprintsPlans. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
