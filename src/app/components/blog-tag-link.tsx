import Link from "next/link";
import { Tag } from "lucide-react";
import { blogTagHref } from "@/lib/blog-links";

export function BlogTagLink({
  tag,
  className = "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors",
}: Readonly<{
  tag: string;
  className?: string;
}>) {
  return (
    <Link href={blogTagHref(tag)} className={className}>
      <Tag className="size-2.5" />
      {tag}
    </Link>
  );
}
