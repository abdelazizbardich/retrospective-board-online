import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { SITE_URL, SITE_EMAIL } from "@/lib/config";
import ContactForm from "./ContactForm";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact SprintsPlans for product questions, bug reports, or partnership ideas. We read every message and reply by email.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Have a question, found a bug, or want to share feedback? We&apos;d love to hear from you.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-background p-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="mt-1 text-sm text-muted-foreground break-all">{SITE_EMAIL}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Copy the address above or use the form below — we do not use redirect links for email.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-12 space-y-4 text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">How we can help</h2>
          <p className="leading-relaxed">
            Ask about running your first online retrospective, reporting a problem with a board, or
            suggesting a feature for agile facilitators. We typically respond within two business
            days.
          </p>
          <p className="leading-relaxed">
            For urgent board access issues, include your board link and the email you used if you
            signed in. We do not offer phone support; email and the form below are the fastest ways
            to reach us.
          </p>
        </section>

        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-8">
          <h2 className="text-lg font-semibold">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the form below and we&apos;ll get back to you as soon as possible.
          </p>
          <ContactForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
