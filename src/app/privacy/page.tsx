import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SprintsPlans collects, uses, and protects your data.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: March 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none mt-8 space-y-8">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              SprintsPlans is designed to be used without creating an account. We collect minimal
              information to provide the service:
            </p>
            <ul>
              <li><strong>Board data</strong> — the content you create in boards (columns, cards, votes) is stored in our database to enable sharing with your team.</li>
              <li><strong>Usage data</strong> — we may collect anonymised analytics such as page views and feature interactions to improve the product.</li>
              <li><strong>Cookies</strong> — we use a session cookie for admin authentication. No tracking or advertising cookies are set.</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use the data we collect solely to:</p>
            <ul>
              <li>Provide and maintain the retrospective board service.</li>
              <li>Improve performance and fix bugs.</li>
              <li>Detect and prevent abuse.</li>
            </ul>
            <p>We do not sell, rent, or share your data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2>3. Data Storage & Security</h2>
            <p>
              Board data is stored in a local SQLite database. We apply industry-standard security
              practices to protect your information.
            </p>
          </section>

          <section>
            <h2>4. Data Retention</h2>
            <p>
              Boards that have not been accessed for more than 90 days may be deleted automatically
              to keep the service lean and secure. Pages are retained indefinitely
              until deleted by an administrator.
            </p>
          </section>

          <section>
            <h2>5. Your Rights</h2>
            <p>
              You may request deletion of any board you own at any time by contacting us. If you
              believe any personal information has been stored in connection with your use of the
              service, please reach out and we will address your request promptly.
            </p>
          </section>

          <section>
            <h2>6. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be noted with an
              updated date at the top of this page.
            </p>
          </section>

          <section>
            <h2>7. Contact</h2>
            <p>
              Questions about this policy? <Link href="/contact">Get in touch</Link>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
