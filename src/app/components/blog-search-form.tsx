import { Search } from "lucide-react";

export function BlogSearchForm({
  defaultValue = "",
}: Readonly<{
  defaultValue?: string;
}>) {
  return (
    <form action="/blog/search" method="get" className="mt-8 mx-auto max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search posts…"
          aria-label="Search blog posts"
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
    </form>
  );
}
