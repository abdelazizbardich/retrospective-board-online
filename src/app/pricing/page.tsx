import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  CircleOff,
  Sparkles,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import { compareLandingPath, getAllComparePages } from "@/lib/compare-pages";
import { pricingPage } from "@/lib/pricing-page";
import { buildDocumentTitle } from "@/lib/seo/meta";
import { breadcrumbListSchema, faqPageSchema, webPageSchema } from "@/lib/structured-data";

const PRIMARY_CTA =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const CANONICAL = `${SITE_URL}/pricing`;

export const metadata: Metadata = {
  title: buildDocumentTitle(pricingPage.seoTitle),
  description: pricingPage.metaDescription,
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    url: CANONICAL,
    type: "website",
    title: pricingPage.ogTitle,
    description: pricingPage.ogDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: pricingPage.ogTitle,
    description: pricingPage.ogDescription,
  },
};

function offerSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      name: "Free retrospective board",
      price: "0",
      priceCurrency: "USD",
      url: CANONICAL,
    },
  };
}

export default function PricingPage() {
  const competitors = getAllComparePages();
  const jsonLd = [
    webPageSchema({
      name: pricingPage.h1,
      path: "/pricing",
      description: pricingPage.metaDescription,
    }),
    breadcrumbListSchema([
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ]),
    faqPageSchema(pricingPage.faqs),
    offerSchema(),
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
                  Pricing
                </li>
              </ol>
            </nav>
          </div>

          <section className="border-b border-border">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
              <div className="min-w-0">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                  <BadgeDollarSign className="size-4" aria-hidden />
                  Retrospective board pricing
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                  {pricingPage.h1}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {pricingPage.intro}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/create" className={PRIMARY_CTA}>
                    Create a free board
                    <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href="#whats-included"
                    className="inline-flex min-h-11 items-center gap-1 rounded-sm text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    See what’s included <ArrowRight className="size-4" />
                  </a>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Free · No credit card · No participant sign-up
                </p>
              </div>

              <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  The whole product
                </p>
                <p className="mt-3 text-5xl font-bold tracking-tight tabular-nums">$0</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  No seats. No trial cliff. No “unlock anonymous voting” upgrade.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Templates, live cards, anonymous votes",
                    "Share a link — teammates join in the browser",
                    "Excel export when you want a file",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/create" className={`${PRIMARY_CTA} mt-8 w-full`}>
                  Create a free board
                  <ArrowRight className="size-4" />
                </Link>
              </aside>
            </div>
          </section>

          <section
            id="whats-included"
            className="scroll-mt-24 bg-gradient-to-br from-primary/5 via-background to-[#2b48a9]/5 py-24"
          >
            <div className="mx-auto max-w-6xl px-6">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {pricingPage.includedHeading}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {pricingPage.includedIntro}
                </p>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {pricingPage.included.map((item) => (
                  <article
                    key={item.title}
                    className="min-w-0 rounded-2xl border border-primary/20 bg-background p-6 shadow-sm"
                  >
                    <h3 className="flex gap-3 text-lg font-bold tracking-tight">
                      <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
                      <span className="min-w-0">{item.title}</span>
                    </h3>
                    <p className="mt-3 pl-8 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-border py-24">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {pricingPage.limitsHeading}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {pricingPage.limitsIntro}
                </p>
                <ul className="mt-8 space-y-6">
                  {pricingPage.limits.map((item) => (
                    <li key={item.title}>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 leading-relaxed text-muted-foreground">{item.body}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-sm text-muted-foreground">
                  Retention language lives in the{" "}
                  <Link
                    href="/privacy"
                    className="rounded-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
                <h3 className="text-lg font-semibold">{pricingPage.notIncludedHeading}</h3>
                <ul className="mt-6 space-y-4">
                  {pricingPage.notIncluded.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <CircleOff className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-sm text-muted-foreground">
                  Need those extras? Read the{" "}
                  <Link
                    href="/compare"
                    className="rounded-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    tool comparisons
                  </Link>{" "}
                  and stay on the vendor that actually ships them.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-border bg-muted/30 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {pricingPage.whyHeading}
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
                {pricingPage.whyIntro}
              </p>
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {pricingPage.why.map((item) => (
                  <article
                    key={item.title}
                    className="min-w-0 rounded-2xl border border-border bg-background p-6"
                  >
                    <h3 className="flex gap-3 text-lg font-bold tracking-tight">
                      <Sparkles className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
                      <span className="min-w-0">{item.title}</span>
                    </h3>
                    <p className="mt-3 pl-8 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Paid tools vs a free retrospective board
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
                Snapshot from each vendor’s public pricing page (November 2026). Plans change —
                confirm on their site before you buy. SprintsPlans does not have a paid starting
                price.
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
                      <td className="px-4 py-3 font-medium tabular-nums text-foreground">
                        $0
                      </td>
                    </tr>
                    {competitors.map((page) => (
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
              <p className="mt-4 text-sm text-muted-foreground">
                Full write-ups:{" "}
                <Link
                  href="/compare"
                  className="rounded-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  compare retrospective tools
                </Link>
                . Formats instead of vendors?{" "}
                <Link
                  href="/templates"
                  className="rounded-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Retrospective templates
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="border-t border-border bg-muted/30 py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {pricingPage.chooseHeading}
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
                {pricingPage.chooseParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently asked questions
              </h2>
              <div className="mt-10 space-y-8">
                {pricingPage.faqs.map((faq) => (
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
                {pricingPage.ctaHeading}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                {pricingPage.ctaBody}
              </p>
              <Link href="/create" className={`${PRIMARY_CTA} mt-8 px-8 py-4`}>
                Create a free board
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
