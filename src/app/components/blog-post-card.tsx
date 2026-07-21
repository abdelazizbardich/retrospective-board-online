import Link from "next/link";
import { Calendar, User } from "lucide-react";
import type { BlogPost } from "@/lib/blog-store";
import { getPostCoverImage } from "@/lib/blog-thumbnail";
import { BlogCategoryLink } from "@/app/components/blog-category-link";
import { BlogTagLink } from "@/app/components/blog-tag-link";

export function BlogPostCard({ post }: Readonly<{ post: BlogPost }>) {
  const coverImage = getPostCoverImage(post);
  const tags = post.tags
    ? post.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/40 hover:shadow-md transition-all">
      <Link href={`/blog/${post.slug}`} className="block aspect-video overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={post.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="flex flex-col flex-1 p-5">
        {post.category && <BlogCategoryLink category={post.category} />}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <BlogTagLink key={tag} tag={tag} />
            ))}
          </div>
        )}
        <Link href={`/blog/${post.slug}`} className="block">
          <h2 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="size-3" />
              {post.author}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </article>
  );
}
