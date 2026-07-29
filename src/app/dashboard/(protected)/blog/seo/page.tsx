"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Pencil,
} from "lucide-react";

interface DashboardSummary {
  averageScore: number;
  totalPosts: number;
  excellent: number;
  below50: number;
  missingMetaDescriptions: number;
  missingFocusKeywords: number;
  missingFeaturedImages: number;
  noInternalLinks: number;
  orphanArticles: number;
  duplicateSeoTitles: number;
  duplicateMetaDescriptions: number;
  longTitles: number;
  longMetaDescriptions: number;
}

interface DashboardPost {
  slug: string;
  title: string;
  category: string;
  seoScore: number;
  rating: string;
  focusKeyword: string;
  wordCount: number;
  internalLinkCount: number;
  isOrphan: boolean;
  published: boolean;
  updatedAt: number;
  missingMeta: boolean;
  missingFocusKeyword: boolean;
  missingCover: boolean;
  noInternalLinks: boolean;
  titleTooLong: boolean;
  metaTooLong: boolean;
}

type Filter = "all" | "excellent" | "good" | "needs-improvement" | "poor";
type Sort = "seoScore" | "updatedAt" | "createdAt" | "wordCount" | "category";

function scoreBadge(score: number) {
  if (score >= 80) return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";
  if (score >= 60) return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
  if (score >= 40) return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";
}

export default function SeoDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("seoScore");

  const load = () => {
    setLoading(true);
    fetch(`/api/blog/seo-dashboard?filter=${filter}&sort=${sort}`)
      .then((r) => r.json())
      .then((data) => {
        setSummary(data.summary);
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter, sort]);

  const statCards = summary
    ? [
        { label: "Average SEO Score", value: summary.averageScore, suffix: "/ 100" },
        { label: "Excellent (80+)", value: summary.excellent, icon: CheckCircle2, color: "text-green-600" },
        { label: "Below 50", value: summary.below50, icon: AlertTriangle, color: "text-red-500" },
        { label: "Missing Meta", value: summary.missingMetaDescriptions },
        { label: "Missing Focus Keyword", value: summary.missingFocusKeywords },
        { label: "Missing Cover Image", value: summary.missingFeaturedImages },
        { label: "No Internal Links", value: summary.noInternalLinks },
        { label: "Orphan Articles", value: summary.orphanArticles },
        { label: "Duplicate SEO Titles", value: summary.duplicateSeoTitles },
        { label: "Long Titles", value: summary.longTitles },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="size-6" />
            SEO Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor and improve SEO across all blog posts
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/dashboard/blog"
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Pencil className="size-4" />
            Edit Posts
          </Link>
        </div>
      </div>

      {loading && !summary ? (
        <div className="flex justify-center py-20">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {statCards.map((card) => (
              <div key={card.label} className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color ?? ""}`}>
                  {card.value}{card.suffix ?? ""}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-1 flex-wrap">
              {(["all", "excellent", "good", "needs-improvement", "poor"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {f === "needs-improvement" ? "Needs Improvement" : f}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
            >
              <option value="seoScore">Sort: SEO Score</option>
              <option value="updatedAt">Sort: Last Updated</option>
              <option value="createdAt">Sort: Published Date</option>
              <option value="wordCount">Sort: Word Count</option>
              <option value="category">Sort: Category</option>
            </select>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-background">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Score</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Focus Keyword</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Words</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Links</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Issues</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      No posts match this filter.
                    </td>
                  </tr>
                ) : (
                  posts.map((post, i) => {
                    const issues = [
                      post.missingMeta && "No meta",
                      post.missingFocusKeyword && "No keyword",
                      post.missingCover && "No cover",
                      post.noInternalLinks && "No links",
                      post.isOrphan && "Orphan",
                      post.titleTooLong && "Long title",
                      post.metaTooLong && "Long meta",
                    ].filter(Boolean);

                    return (
                      <tr
                        key={post.slug}
                        className={`${i < posts.length - 1 ? "border-b border-border/60" : ""} hover:bg-muted/30 transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium line-clamp-1">{post.title}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">/blog/{post.slug}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${scoreBadge(post.seoScore)}`}>
                            {post.seoScore}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                          {post.focusKeyword || <span className="italic">—</span>}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                          {post.wordCount}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                          {post.internalLinkCount}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {issues.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {issues.map((issue) => (
                                <span key={issue as string} className="inline-flex rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 text-[10px] font-medium">
                                  {issue}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <CheckCircle2 className="size-4 text-green-500" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {post.published && (
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                              >
                                <ExternalLink className="size-3.5" />
                              </Link>
                            )}
                            <Link
                              href="/dashboard/blog"
                              className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                              title="Edit in Blog admin"
                            >
                              <Pencil className="size-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
