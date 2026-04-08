import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions governing your use of SprintsPlans.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
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
            Get Started
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: March 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none mt-8 space-y-8">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using SprintsPlans ("the Service"), you agree to be bound by these
              Terms of Service. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2>2. Use of the Service</h2>
            <p>You may use the Service to create and share retrospective boards for team collaboration. You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose.</li>
              <li>Upload or post content that is harmful, abusive, or infringes third-party rights.</li>
              <li>Attempt to gain unauthorised access to the Service or its infrastructure.</li>
              <li>Interfere with or disrupt the integrity or performance of the Service.</li>
            </ul>
          </section>

          <section>
            <h2>3. Content Ownership</h2>
            <p>
              You retain ownership of any content you create using the Service. By creating a board,
              you grant SprintsPlans a limited licence to store and display that content for the
              purpose of providing the Service.
            </p>
          </section>

          <section>
            <h2>4. Availability</h2>
            <p>
              We strive to keep the Service available at all times but do not guarantee uninterrupted
              access. The Service is provided "as is" without warranties of any kind. We reserve the
              right to modify or discontinue features at any time.
            </p>
          </section>

          <section>
            <h2>5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, SprintsPlans shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of the
              Service, including loss of data.
            </p>
          </section>

          <section>
            <h2>6. Changes to Terms</h2>
            <p>
              We may update these terms at any time. Continued use of the Service after changes are
              posted constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2>7. Contact</h2>
            <p>
              Questions about these terms? <Link href="/contact">Get in touch</Link>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} SprintsPlans. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors font-medium text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
