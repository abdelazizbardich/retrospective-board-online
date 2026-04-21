import Link from "next/link";
import Image from "next/image";
import { getNavLinks } from "@/lib/nav-link-store";

export async function SiteHeader() {
  const links = await getNavLinks("header");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Image
            src="/sprintsplans-logo.png"
            alt="SprintsPlans"
            width={160}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {links.length > 0 && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="hover:text-foreground transition-colors"
                {...(link.openInNewTab
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/my-boards"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            My Boards
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}

export async function SiteFooter() {
  const links = await getNavLinks("footer");

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} SprintsPlans. All rights reserved.</p>
        {links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="hover:text-foreground transition-colors"
                {...(link.openInNewTab
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
