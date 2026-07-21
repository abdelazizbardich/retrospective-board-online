import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);
  return pages;
}

export function BlogPagination({
  page,
  totalPages,
  hrefForPage = (p) => (p <= 1 ? "/blog" : `/blog?page=${p}`),
}: Readonly<{
  page: number;
  totalPages: number;
  hrefForPage?: (page: number) => string;
}>) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={hrefForPage(page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
          <ChevronLeft className="size-4" />
          Previous
        </span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-muted-foreground"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={hrefForPage(item)}
              aria-current={item === page ? "page" : undefined}
              className={`inline-flex min-w-9 items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                item === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item}
            </Link>
          )
        )}
      </div>

      {page < totalPages ? (
        <Link
          href={hrefForPage(page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          Next
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
          Next
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
