import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Scale } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/config";
import { buildDocumentTitle } from "@/lib/seo/meta";
import {
  breadcrumbListSchema,
  faqPageSchema,
  itemListSchema,
  webPageSchema,
} from "@/lib/structured-data";
import { compareHub, compareLandingPath, getAllComparePages } from "@/lib/compare-pages";

const PRIMARY_CTA =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export const metadata: Metadata = {
  title: buildDocumentTitle(compareHub.seoTitle),
  description: compareHub.metaDescription,
  alternates: { canonical: `${SITE_URL}/compare` },
  robots: { index: true, follow: true },
  openGraph: {
    url: `${SITE_URL}/compare`,
    type: "website",
    title: compareHub.ogTitle,
    description: compareHub.ogDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: compareHub.ogTitle,
    description: compareHub.ogDescription,
  },
};

export default function CompareHubPage() {
  const pages = getAllComparePages();
  const jsonLd = [
    webPageSchema({
      name: compareHub.h1,
      path: "/compare",
      description: compareHub.metaDescription,
      type: "CollectionPage",
    }),
    breadcrumbListSchema([
      { name: "Home", path: "/" },
      { name: "Compare", path: "/compare" },
    ]),
    itemListSchema(
      pages.map((page) => ({
        name: `${page.competitorName} vs SprintsPlans`,
        path: compareLandingPath(page.slug),
      }))
    ),
    faqPageSchema(compareHub.faqs),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="content" className="flex-1">
          <div className="mx-auto max-w-6xl px-6 pt-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="font-medium text-foreground" aria-current="page">
                  Compare
                </li>
              </ol>
            </nav>
          </div>

          <section className="border-b border-border">
            <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:py-24">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Scale className="size-4" aria-hidden />
                Free for every team
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                {compareHub.h1}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {compareHub.intro}
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/create" className={PRIMARY_CTA}>
                  Create a board
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#comparisons"
                  className="inline-flex min-h-11 items-center gap-1 rounded-sm text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Jump to comparisons <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </section>

          <section id="comparisons" className="scroll-mt-24 bg-gradient-to-br from-primary/5 via-background to-[#2b48a9]/5 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  SprintsPlans vs the tools teams search for
                </h2>
                <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                  Each page targets “X alternative” and “X vs SprintsPlans” with an honest table,
                  a pricing snapshot, and a free-board CTA.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                  <article
                    key={page.slug}
                    className="flex min-w-0 flex-col rounded-2xl border border-primary/20 bg-background p-6 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {page.badge}
                    </p>
                    <h3 className="mt-3 text-lg font-bold tracking-tight">
                      <Link
                        href={compareLandingPath(page.slug)}
                        className="rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {page.competitorName} vs SprintsPlans
                      </Link>
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {page.bestFor}
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                      {page.pricingSnapshot}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <Link
                        href={compareLandingPath(page.slug)}
                        className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        Read the comparison
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-border py-24">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Pricing snapshot
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
                {compareHub.pricingNote}{" "}
                SprintsPlans itself has no paid tier — see{" "}
                <Link
                  href="/pricing"
                  className="rounded-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  free retrospective board pricing
                </Link>
                .
              </p>
              <div className="mt-10 overflow-x-auto overscroll-contain rounded-2xl border border-border">
                <table className="w-full min-w-[44rem] text-left text-sm">
                  <caption className="sr-only">
                    Pricing snapshot of retrospective tools compared to SprintsPlans
                  </caption>
                  <thead className="bg-muted/60">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Tool
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Public free tier (Nov 2026)
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Paid starting point
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <th scope="row" className="px-4 py-3 font-semibold">
                        SprintsPlans
                      </th>
                      <td className="px-4 py-3 text-muted-foreground">
                        Free retrospective boards — no paid tier for the basics
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">None</td>
                    </tr>
                    {pages.map((page) => (
                      <tr key={page.slug} className="border-t border-border">
                        <th scope="row" className="px-4 py-3 font-semibold">
                          <Link
                            href={compareLandingPath(page.slug)}
                            className="rounded-sm text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            {page.competitorName}
                          </Link>
                        </th>
                        <td className="px-4 py-3 text-muted-foreground">
                          {page.rows.find((row) => row.label === "Free plan")?.competitor ??
                            page.pricingSnapshot}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {page.rows.find((row) => row.label === "Paid starting price")?.competitor ??
                            "See comparison"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="border-t border-border bg-muted/30 py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {compareHub.chooseHeading}
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
                {compareHub.chooseParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "EasyRetro if you already like the catalog and will pay for extra boards",
                  "Retrium or TeamRetro if SSO, health checks, or a facilitation suite are required",
                  "Parabol if you also want poker and standups in the same app",
                  "Miro or FigJam if the retro is one frame on a canvas you already live in",
                  "SprintsPlans when the job is a free, fast sprint retrospective",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-muted-foreground">
                Looking for formats instead of vendors? Browse{" "}
                <Link
                  href="/templates"
                  className="rounded-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  retrospective templates
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently asked questions
              </h2>
              <div className="mt-10 space-y-8">
                {compareHub.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-border bg-brand-blue-bg/40 py-24">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {compareHub.ctaHeading}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                {compareHub.ctaBody}
              </p>
              <Link href="/create" className={`${PRIMARY_CTA} mt-8 px-8 py-4`}>
                Create a board
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
