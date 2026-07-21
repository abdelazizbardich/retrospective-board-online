import Link from "next/link";
import { Folder } from "lucide-react";
import { blogCategoryHref } from "@/lib/blog-links";

export function BlogCategoryLink({
  category,
  className = "inline-flex items-center gap-1 mb-2 text-xs font-semibold uppercase tracking-wide text-primary hover:underline",
}: Readonly<{
  category: string;
  className?: string;
}>) {
  return (
    <Link href={blogCategoryHref(category)} className={className}>
      <Folder className="size-3" />
      {category}
    </Link>
  );
}
