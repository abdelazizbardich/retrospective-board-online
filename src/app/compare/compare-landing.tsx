import Link from "next/link";
import { ArrowRight, CheckCircle2, Scale } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbListSchema, faqPageSchema, webPageSchema } from "@/lib/structured-data";
import {
  compareLandingPath,
  getComparePage,
  type ComparePageContent,
} from "@/lib/compare-pages";
import { compareHub } from "@/lib/compare-pages/hub";
import { getTemplatePage, templateCreatePath, templateLandingPath } from "@/lib/template-pages";

const PRIMARY_CTA =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function CompareLanding({ page }: { page: ComparePageContent }) {
  const path = compareLandingPath(page.slug);
  const related = page.relatedSlugs
    .map((slug) => getComparePage(slug))
    .filter((item): item is ComparePageContent => Boolean(item));
  const relatedTemplates = page.relatedTemplates
    .map((slug) => getTemplatePage(slug))
    .filter((item) => Boolean(item));

  const jsonLd = [
    webPageSchema({
      name: `${page.competitorName} Alternative`,
      path,
      description: page.metaDescription,
    }),
    breadcrumbListSchema([
      { name: "Home", path: "/" },
      { name: "Compare", path: "/compare" },
      { name: page.competitorName, path },
    ]),
    faqPageSchema(page.faqs),
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
                <li>
                  <Link
                    href="/compare"
                    className="rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Compare
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="min-w-0 truncate font-medium text-foreground" aria-current="page">
                  {page.competitorName}
                </li>
              </ol>
            </nav>
          </div>

          <section className="border-b border-border">
            <div className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Scale className="size-4" aria-hidden />
                {page.badge}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                {page.h1Lead}{" "}
                <span className="text-primary">{page.h1Accent}</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{page.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href={page.ctaHref} className={PRIMARY_CTA}>
                  Create a free board
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/compare"
                  className="inline-flex min-h-11 items-center justify-center gap-1 rounded-sm text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  All comparisons <ArrowRight className="size-4" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Free · No sign-up for participants · Ready in seconds
              </p>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.whoHeading}</h2>
                <h3 className="mt-8 text-lg font-semibold">{page.whoCompetitorHeading}</h3>
                <ul className="mt-4 space-y-3">
                  {page.whoCompetitor.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                <h3 className="text-lg font-semibold">{page.whoUsHeading}</h3>
                <ul className="mt-4 space-y-3">
                  {page.whoUs.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="border-t border-border bg-muted/30 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.tableHeading}</h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{page.tableIntro}</p>
              <div className="mt-10 overflow-x-auto overscroll-contain rounded-2xl border border-border bg-background">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <caption className="sr-only">
                    Feature comparison of {page.competitorName} and SprintsPlans
                  </caption>
                  <thead className="bg-muted/60">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Capability
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        {page.competitorName}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        SprintsPlans
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.rows.map((row) => (
                      <tr key={row.label} className="border-t border-border">
                        <th scope="row" className="px-4 py-3 font-semibold">
                          {row.label}
                        </th>
                        <td className="px-4 py-3 text-muted-foreground">{row.competitor}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.sprintsplans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{compareHub.pricingNote}</p>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.pricingHeading}</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
                {page.pricingParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Source:{" "}
                <a
                  href={page.competitorPricingUrl}
                  className="rounded-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {page.competitorName} pricing
                </a>
                .
              </p>
            </div>
          </section>

          <section className="border-t border-border bg-muted/30 py-24">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.pickUsHeading}</h2>
                <ul className="mt-6 space-y-3">
                  {page.pickUs.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
                <h3 className="text-lg font-semibold">{page.pickThemHeading}</h3>
                <ul className="mt-4 space-y-3">
                  {page.pickThem.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.switchHeading}</h2>
              <ol className="mt-12 space-y-6">
                {page.switchSteps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground tabular-nums">
                      {i + 1}
                    </span>
                    <p className="pt-1 leading-relaxed text-muted-foreground">{step}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-10 text-center">
                <Link href={page.ctaHref} className={PRIMARY_CTA}>
                  Create a free board
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </section>

          {relatedTemplates.length > 0 && (
            <section className="border-t border-border bg-muted/30 py-24">
              <div className="mx-auto max-w-6xl px-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Start from a free template
                </h2>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  Same creator the homepage uses. Each template opens a live board.
                </p>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                  {relatedTemplates.map((item) =>
                    item ? (
                      <article
                        key={item.slug}
                        className="flex min-w-0 flex-col rounded-2xl border border-border bg-background p-6"
                      >
                        <h3 className="text-lg font-bold tracking-tight">{item.name}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {item.bestFor}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                          <Link
                            href={templateLandingPath(item.slug)}
                            className="rounded-sm text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            Explore template
                          </Link>
                          <Link
                            href={templateCreatePath(item.slug)}
                            className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            Use free
                          </Link>
                        </div>
                      </article>
                    ) : null
                  )}
                </div>
              </div>
            </section>
          )}

          <section className="py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently asked questions
              </h2>
              <div className="mt-10 space-y-8">
                {page.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {related.length > 0 && (
            <section className="border-t border-border bg-muted/30 py-24">
              <div className="mx-auto max-w-6xl px-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Other comparisons</h2>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  Same free-board angle, different competitor. Each page stays honest about when to stay put.
                </p>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((item) => (
                    <article
                      key={item.slug}
                      className="flex min-w-0 flex-col rounded-2xl border border-border bg-background p-6"
                    >
                      <h3 className="text-lg font-bold tracking-tight">{item.competitorName}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {item.bestFor}
                      </p>
                      <Link
                        href={compareLandingPath(item.slug)}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                      >
                        {item.competitorName} vs SprintsPlans
                        <ArrowRight className="size-4" />
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="border-t border-border py-24">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.ctaHeading}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{page.ctaBody}</p>
              <Link href={page.ctaHref} className={`${PRIMARY_CTA} mt-8 px-8 py-4`}>
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
