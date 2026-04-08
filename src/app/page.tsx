import {
  ArrowRight,
  MessageSquare,
  Vote,
  Zap,
  Users,
  LayoutGrid,
  CheckCircle2,
  Timer,
  Shield,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://retroboard.app";

export const metadata: Metadata = {
  title: "Free Online Retrospective Board for Agile Teams",
  description:
    "Run better agile retrospectives online. Collect feedback, vote anonymously, and turn insights into action — in real time. Free for up to 5 participants.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    type: "website",
    title: "SprintsPlans — Free Online Retrospective Board",
    description:
      "Run better agile retrospectives online. Collect feedback, vote anonymously, and turn insights into action — in real time.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SprintsPlans — Free Online Retrospective Board",
    description:
      "Run better agile retrospectives online. Collect feedback, vote anonymously, and turn insights into action — in real time.",
  },
};

const features = [
  {
    icon: MessageSquare,
    title: "Collect Feedback",
    description:
      "Team members add cards to columns like \"What went well\", \"What didn't\", and \"Action items\" in real time.",
  },
  {
    icon: Vote,
    title: "Anonymous Voting",
    description:
      "Let everyone vote on the most important topics without bias. Prioritize what matters most to your team.",
  },
  {
    icon: Zap,
    title: "Real-Time Collaboration",
    description:
      "See updates instantly across all participants. No need to refresh — everything syncs live.",
  },
  {
    icon: CheckCircle2,
    title: "Action Items Tracking",
    description:
      "Turn insights into actions. Assign owners, set deadlines, and track progress across sprints.",
  },
  {
    icon: LayoutGrid,
    title: "Customizable Templates",
    description:
      "Start from classic retrospective formats or create your own custom board layout to fit your needs.",
  },
  {
    icon: Shield,
    title: "Safe & Private",
    description:
      "Your data stays yours. Boards are private by default with optional password protection.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Board",
    description:
      "Choose a template or start blank. Share the link with your team — no sign-up required for participants.",
  },
  {
    step: "02",
    title: "Gather & Discuss",
    description:
      "Team members add cards, group similar items, and discuss each topic. Use the built-in timer to stay on track.",
  },
  {
    step: "03",
    title: "Vote & Prioritize",
    description:
      "Everyone votes anonymously on the most impactful items. The board auto-sorts by priority.",
  },
  {
    step: "04",
    title: "Take Action",
    description:
      "Convert top-voted items into action items with owners and deadlines. Export to Jira, Trello, or CSV.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SprintsPlans",
    url: SITE_URL,
    description:
      "Run better agile retrospectives online. Collect feedback, vote anonymously, and turn insights into action — in real time.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="flex flex-col min-h-screen">
      {/* ─── NAVBAR ─── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <LayoutGrid className="size-6 text-primary" />
            <span>SprintsPlans</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Gradient blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-400/30 to-purple-400/20 blur-3xl"
        />
        <div className="mx-auto max-w-4xl px-6 pt-28 pb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <Timer className="size-4" />
            <span>Run a retro in under 30 minutes</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Better Retrospectives,{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Happier Teams
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            The simplest way to run agile retrospectives online. Gather feedback,
            vote anonymously, and turn insights into action — all in real time.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              Start Your Free Retro
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1 text-base font-semibold text-foreground hover:text-muted-foreground transition-colors"
            >
              See how it works <ArrowRight className="size-4" />
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required · Free for up to 5 participants
          </p>
        </div>

        {/* Board preview mock */}
        <div className="mx-auto max-w-5xl px-6 pb-20">
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-yellow-400" />
              <span className="size-3 rounded-full bg-green-400" />
              <div className="ml-3 flex-1 rounded-md border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                sprintsplans.app/room/abc123
              </div>
            </div>
            {/* Board title bar */}
            <div className="border-b border-border px-6 py-3">
              <p className="text-sm font-semibold">Sprint 24 Retrospective</p>
            </div>
            {/* Columns */}
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
              {/* What went well */}
              <div className="rounded-xl border border-green-200 bg-green-50/70 p-3.5 dark:border-green-900 dark:bg-green-950/30">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-green-700 dark:text-green-400">
                  ✅ What went well
                </h3>
                <div className="space-y-2">
                  <div className="rounded-lg border border-green-100 bg-white p-3 text-sm shadow-sm dark:border-green-900/40 dark:bg-green-900/20">
                    <p className="font-medium leading-snug text-foreground">Great team collaboration on the API redesign</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="size-3" /> 5 votes
                    </p>
                  </div>
                  <div className="rounded-lg border border-green-100 bg-white p-3 text-sm shadow-sm dark:border-green-900/40 dark:bg-green-900/20">
                    <p className="font-medium leading-snug text-foreground">Deployed to production with zero downtime</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="size-3" /> 3 votes
                    </p>
                  </div>
                </div>
              </div>
              {/* What didn't go well */}
              <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 dark:border-red-900 dark:bg-red-950/30">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-red-700 dark:text-red-400">
                  ❌ What didn&apos;t go well
                </h3>
                <div className="space-y-2">
                  <div className="rounded-lg border border-red-100 bg-white p-3 text-sm shadow-sm dark:border-red-900/40 dark:bg-red-900/20">
                    <p className="font-medium leading-snug text-foreground">Sprint scope changed mid-week again</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="size-3" /> 7 votes
                    </p>
                  </div>
                  <div className="rounded-lg border border-red-100 bg-white p-3 text-sm shadow-sm dark:border-red-900/40 dark:bg-red-900/20">
                    <p className="font-medium leading-snug text-foreground">Staging environment was unstable</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="size-3" /> 4 votes
                    </p>
                  </div>
                </div>
              </div>
              {/* Action items */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 dark:border-blue-900 dark:bg-blue-950/30">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                  🎯 Action Items
                </h3>
                <div className="space-y-2">
                  <div className="rounded-lg border border-blue-100 bg-white p-3 text-sm shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20">
                    <p className="font-medium leading-snug text-foreground">Set up scope-change review meeting</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="size-3" /> Sarah · Due Apr 5
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-100 bg-white p-3 text-sm shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20">
                    <p className="font-medium leading-snug text-foreground">Improve staging CI pipeline</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="size-3" /> Alex · Due Apr 8
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="border-t border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for effective retros
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Built by agile teams, for agile teams. Simple, fast, and focused on
              what matters — continuous improvement.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              No installation, no complex setup. Just create a board and invite
              your team.
            </p>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <div className="mb-4 text-4xl font-extrabold text-primary/20">
                  {s.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Users className="mx-auto mb-4 size-8 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by 2,000+ agile teams
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            From startups to enterprises, teams use SprintsPlans to run better
            sprints and build stronger products.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                quote:
                  "Our retros went from boring meetings to the most engaging ceremony of the sprint.",
                author: "Marie D.",
                role: "Scrum Master",
              },
              {
                quote:
                  "Anonymous voting changed everything. We finally get honest feedback from the whole team.",
                author: "Karim A.",
                role: "Tech Lead",
              },
              {
                quote:
                  "We cut our retro time in half and the action items actually get done now.",
                author: "Julie P.",
                role: "Product Owner",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className="rounded-xl border border-border bg-background p-6 text-left"
              >
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="border-t border-border bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to transform your retrospectives?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join thousands of teams already running better retros with SprintsPlans.
            It takes less than a minute to get started.
          </p>
          <div className="mt-8">
            <a
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              Create Your First Board — It&apos;s Free
              <ArrowRight className="size-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <LayoutGrid className="size-5 text-primary" />
            SprintsPlans
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 SprintsPlans. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
