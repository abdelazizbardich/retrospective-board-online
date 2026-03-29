import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid, Mail, MessageSquare } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sprintsplans.app";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the SprintsPlans team.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <LayoutGrid className="size-6 text-primary" />
            <span>SprintsPlans</span>
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Have a question, found a bug, or want to share feedback? We&apos;d love to hear from you.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:hello@sprintsplans.app"
            className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="mt-1 text-sm text-muted-foreground break-all">hello@sprintsplans.app</p>
            </div>
          </a>

          <a
            href="/blog"
            className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Blog & Updates</p>
              <p className="mt-1 text-sm text-muted-foreground">Read our latest articles and product news.</p>
            </div>
          </a>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-8">
          <h2 className="text-lg font-semibold">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the form below and we&apos;ll get back to you as soon as possible.
          </p>
          <form
            action={`mailto:hello@sprintsplans.app`}
            method="GET"
            className="mt-6 space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Subject</label>
              <input
                type="text"
                name="subject"
                required
                placeholder="How can we help?"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Message</label>
              <textarea
                name="body"
                required
                rows={5}
                placeholder="Tell us more…"
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} SprintsPlans. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors font-medium text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
