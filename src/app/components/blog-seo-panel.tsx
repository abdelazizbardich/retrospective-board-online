"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Link2,
  Search,
  Share2,
} from "lucide-react";
import { SeoAnalyzerService } from "@/lib/seo/seo-analyzer-service";
import { getCategoryTooltip } from "@/lib/seo/category-tooltips";
import type { InternalLinkSuggestion, SeoAnalysisOutput, SeoPostInput } from "@/lib/seo/types";
import { SITE_URL } from "@/lib/config";
import { generateBlogSchema } from "@/lib/seo/schema-generator";

export interface SeoFormFields {
  focusKeyword: string;
  secondaryKeywords: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  schemaType: string;
}

interface BlogSeoPanelProps {
  postInput: SeoPostInput;
  seoFields: SeoFormFields;
  onSeoChange: (fields: Partial<SeoFormFields>) => void;
  onInsertLink?: (slug: string, anchor: string) => void;
  allPosts?: { slug: string; title: string; content: string; category: string; tags: string }[];
}

function StatusIcon({ status }: { status: "passed" | "warning" | "failed" }) {
  if (status === "passed") return <CheckCircle2 className="size-4 text-green-500 shrink-0" />;
  if (status === "warning") return <AlertTriangle className="size-4 text-amber-500 shrink-0" />;
  return <XCircle className="size-4 text-red-500 shrink-0" />;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-blue-600 dark:text-blue-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function scoreRingColor(score: number): string {
  if (score >= 80) return "stroke-green-500";
  if (score >= 60) return "stroke-blue-500";
  if (score >= 40) return "stroke-amber-500";
  return "stroke-red-500";
}

function LengthBar({ length, idealMin, idealMax, max }: { length: number; idealMin: number; idealMax: number; max: number }) {
  const pct = Math.min(100, (length / max) * 100);
  const inRange = length >= idealMin && length <= idealMax;
  return (
    <div className="mt-1">
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${inRange ? "bg-green-500" : length > idealMax ? "bg-amber-500" : "bg-red-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">
        {length} / {max} chars {inRange ? "✓" : length < idealMin ? "(too short)" : "(too long)"}
      </p>
    </div>
  );
}

function CategoryRowTooltip({ text }: { text: string }) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute inset-x-2 top-full z-50 mt-1 rounded-lg border border-border bg-background px-2.5 py-2 text-xs leading-relaxed text-muted-foreground shadow-lg opacity-0 translate-y-0.5 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0"
    >
      {text}
    </div>
  );
}

export function BlogSeoPanel({
  postInput,
  seoFields,
  onSeoChange,
  onInsertLink,
  allPosts = [],
}: BlogSeoPanelProps) {
  const [analysis, setAnalysis] = useState<SeoAnalysisOutput | null>(null);
  const [linkSuggestions, setLinkSuggestions] = useState<InternalLinkSuggestion[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"score" | "settings" | "social" | "schema">("score");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const fullInput: SeoPostInput = useMemo(
    () => ({
      ...postInput,
      focusKeyword: seoFields.focusKeyword,
      secondaryKeywords: seoFields.secondaryKeywords,
      seoTitle: seoFields.seoTitle,
      metaDescription: seoFields.metaDescription,
      canonicalUrl: seoFields.canonicalUrl,
      robotsIndex: seoFields.robotsIndex,
      robotsFollow: seoFields.robotsFollow,
      ogTitle: seoFields.ogTitle,
      ogDescription: seoFields.ogDescription,
      ogImage: seoFields.ogImage,
      twitterTitle: seoFields.twitterTitle,
      twitterDescription: seoFields.twitterDescription,
      twitterImage: seoFields.twitterImage,
      schemaType: seoFields.schemaType,
    }),
    [postInput, seoFields]
  );

  const runAnalysis = useCallback(() => {
    const result = SeoAnalyzerService.analyze(fullInput, {
      existingTitles: allPosts.map((p) => p.title),
      existingDescriptions: [],
    });
    setAnalysis(result);
    setLinkSuggestions(
      SeoAnalyzerService.getInternalLinkSuggestions(fullInput, allPosts)
    );
  }, [fullInput, allPosts]);

  useEffect(() => {
    const timer = setTimeout(runAnalysis, 400);
    return () => clearTimeout(timer);
  }, [runAnalysis]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchAiSuggestions = async (type: string) => {
    setAiLoading(type);
    setAiSuggestions([]);
    try {
      const res = await fetch("/api/blog/seo-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...fullInput }),
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions ?? []);
    } catch {
      setAiSuggestions([]);
    } finally {
      setAiLoading(null);
    }
  };

  const seoTitle = seoFields.seoTitle || postInput.title;
  const metaDesc = seoFields.metaDescription || postInput.excerpt;
  const displayUrl = `${SITE_URL.replace("https://", "")}/blog/${postInput.slug}`;
  const schema = generateBlogSchema({ ...fullInput, createdAt: Date.now(), updatedAt: Date.now() });

  const score = analysis?.totalScore ?? 0;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border shrink-0">
        {(["score", "settings", "social", "schema"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-2 py-2.5 text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "score" ? "SEO Score" : tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "score" && (
          <>
            {/* Score ring */}
            <div className="flex items-center gap-4">
              <div className="relative size-20 shrink-0">
                <svg className="size-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                  <circle
                    cx="40" cy="40" r="36" fill="none" strokeWidth="6"
                    strokeLinecap="round"
                    className={scoreRingColor(score)}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-xl font-bold ${scoreColor(score)}`}>{score}</span>
                  <span className="text-[10px] text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div>
                <p className={`font-semibold ${scoreColor(score)}`}>{analysis?.rating ?? "—"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {analysis?.recommendations.length ?? 0} recommendation{(analysis?.recommendations.length ?? 0) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Category checklist */}
            <div className="space-y-1">
              {analysis?.categories.map((cat) => {
                const tooltip = getCategoryTooltip(cat.title, cat.whyItMatters);
                return (
                <div key={cat.title} className="group relative rounded-lg border border-border">
                  <CategoryRowTooltip text={tooltip} />
                  <button
                    type="button"
                    onClick={() => cat.recommendation && toggleExpand(cat.title)}
                    title={tooltip}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors rounded-lg"
                  >
                    <StatusIcon status={cat.status} />
                    <span className="flex-1 font-medium">{cat.title}</span>
                    <span className="text-xs text-muted-foreground">{cat.score}/{cat.maxScore}</span>
                    {cat.howToFix && (
                      expanded.has(cat.title)
                        ? <ChevronDown className="size-3.5 text-muted-foreground" />
                        : <ChevronRight className="size-3.5 text-muted-foreground" />
                    )}
                  </button>
                  {expanded.has(cat.title) && cat.howToFix && (
                    <div className="px-3 pb-3 text-xs space-y-2 border-t border-border bg-muted/20 rounded-b-lg">
                      {cat.problem && (
                        <div>
                          <p className="font-semibold text-foreground">Problem</p>
                          <p className="text-muted-foreground">{cat.problem}</p>
                        </div>
                      )}
                      {cat.whyItMatters && (
                        <div>
                          <p className="font-semibold text-foreground">Why it matters</p>
                          <p className="text-muted-foreground">{cat.whyItMatters}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">How to fix</p>
                        <p className="text-muted-foreground">{cat.howToFix}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
              })}
            </div>

            {/* Google preview */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Search className="size-3.5 text-muted-foreground" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Google Search Preview</p>
              </div>
              <div className="rounded-lg border border-border p-3 bg-muted/20">
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium line-clamp-1">{seoTitle || "SEO Title"}</p>
                <p className="text-green-700 dark:text-green-500 text-xs mt-0.5">{displayUrl}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{metaDesc || "Meta description will appear here…"}</p>
              </div>
              <LengthBar length={seoTitle.length} idealMin={50} idealMax={60} max={70} />
            </div>

            {/* Internal link suggestions */}
            {linkSuggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Link2 className="size-3.5 text-muted-foreground" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggested Internal Links</p>
                </div>
                <div className="space-y-2">
                  {linkSuggestions.map((s) => (
                    <div key={s.slug} className="rounded-lg border border-border p-3 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium line-clamp-1">{s.title}</p>
                        <span className="shrink-0 text-primary font-semibold">{s.relevance}%</span>
                      </div>
                      <p className="text-muted-foreground mt-1">Anchor: <em>{s.suggestedAnchor}</em></p>
                      {onInsertLink && (
                        <button
                          type="button"
                          onClick={() => onInsertLink(s.slug, s.suggestedAnchor)}
                          className="mt-2 text-primary hover:underline font-medium"
                        >
                          Insert link
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Focus Keyword</label>
              <div className="flex gap-2">
                <input
                  value={seoFields.focusKeyword}
                  onChange={(e) => onSeoChange({ focusKeyword: e.target.value })}
                  placeholder="e.g. online retrospective tools"
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => fetchAiSuggestions("focusKeyword")}
                  disabled={aiLoading === "focusKeyword"}
                  className="shrink-0 flex items-center gap-1 rounded-lg border border-border px-2 py-2 text-xs hover:bg-muted transition-colors disabled:opacity-50"
                  title="AI suggest keywords"
                >
                  <Sparkles className="size-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Secondary Keywords</label>
              <input
                value={seoFields.secondaryKeywords}
                onChange={(e) => onSeoChange({ secondaryKeywords: e.target.value })}
                placeholder="comma-separated"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">SEO Title</label>
              <div className="flex gap-2">
                <input
                  value={seoFields.seoTitle}
                  onChange={(e) => onSeoChange({ seoTitle: e.target.value })}
                  placeholder={postInput.title || "Defaults to post title"}
                  maxLength={200}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => fetchAiSuggestions("seoTitle")}
                  disabled={aiLoading === "seoTitle"}
                  className="shrink-0 flex items-center gap-1 rounded-lg border border-border px-2 py-2 text-xs hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Sparkles className="size-3.5" />
                </button>
              </div>
              <LengthBar length={(seoFields.seoTitle || postInput.title).length} idealMin={50} idealMax={60} max={70} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Meta Description</label>
              <div className="flex gap-2">
                <textarea
                  value={seoFields.metaDescription}
                  onChange={(e) => onSeoChange({ metaDescription: e.target.value })}
                  placeholder={postInput.excerpt || "140–160 characters recommended"}
                  maxLength={300}
                  rows={3}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
                <button
                  type="button"
                  onClick={() => fetchAiSuggestions("metaDescription")}
                  disabled={aiLoading === "metaDescription"}
                  className="shrink-0 flex items-center gap-1 rounded-lg border border-border px-2 py-2 text-xs hover:bg-muted transition-colors disabled:opacity-50 self-start"
                >
                  <Sparkles className="size-3.5" />
                </button>
              </div>
              <LengthBar length={seoFields.metaDescription.length} idealMin={140} idealMax={160} max={300} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Canonical URL</label>
              <input
                value={seoFields.canonicalUrl}
                onChange={(e) => onSeoChange({ canonicalUrl: e.target.value })}
                placeholder={`${SITE_URL}/blog/${postInput.slug}`}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={seoFields.robotsIndex}
                  onChange={(e) => onSeoChange({ robotsIndex: e.target.checked })}
                  className="rounded accent-primary"
                />
                Index
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={seoFields.robotsFollow}
                  onChange={(e) => onSeoChange({ robotsFollow: e.target.checked })}
                  className="rounded accent-primary"
                />
                Follow
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Schema Type</label>
              <select
                value={seoFields.schemaType}
                onChange={(e) => onSeoChange({ schemaType: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="BlogPosting">BlogPosting</option>
                <option value="Article">Article</option>
                <option value="FAQPage">FAQPage</option>
              </select>
            </div>

            {aiSuggestions.length > 0 && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
                <p className="text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="size-3.5" /> AI Suggestions
                </p>
                {aiSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (aiLoading === "seoTitle") onSeoChange({ seoTitle: s });
                      else if (aiLoading === "metaDescription") onSeoChange({ metaDescription: s });
                      else if (aiLoading === "focusKeyword") onSeoChange({ focusKeyword: s });
                      else if (aiLoading === "secondaryKeywords") onSeoChange({ secondaryKeywords: s });
                      setAiSuggestions([]);
                    }}
                    className="block w-full text-left text-xs rounded-md border border-border bg-background px-2 py-1.5 hover:border-primary/40 transition-colors"
                  >
                    {s}
                  </button>
                ))}
                <p className="text-[10px] text-muted-foreground">Click to apply. Edit before saving.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Share2 className="size-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Social Preview</p>
            </div>
            <div className="rounded-lg border border-border overflow-hidden">
              {(seoFields.ogImage || postInput.coverImage) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={seoFields.ogImage || postInput.coverImage}
                  alt="Social preview"
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-3 bg-muted/20">
                <p className="text-xs text-muted-foreground uppercase">{SITE_URL.replace("https://", "")}</p>
                <p className="text-sm font-semibold mt-0.5 line-clamp-2">
                  {seoFields.ogTitle || seoFields.seoTitle || postInput.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {seoFields.ogDescription || seoFields.metaDescription || postInput.excerpt}
                </p>
              </div>
            </div>

            {[
              ["ogTitle", "Open Graph Title", seoFields.ogTitle],
              ["ogDescription", "Open Graph Description", seoFields.ogDescription],
              ["ogImage", "Open Graph Image URL", seoFields.ogImage],
              ["twitterTitle", "Twitter Title", seoFields.twitterTitle],
              ["twitterDescription", "Twitter Description", seoFields.twitterDescription],
              ["twitterImage", "Twitter Image URL", seoFields.twitterImage],
            ].map(([key, label, value]) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1">{label}</label>
                <input
                  value={value}
                  onChange={(e) => onSeoChange({ [key]: e.target.value } as Partial<SeoFormFields>)}
                  placeholder={`Defaults to ${key.includes("Image") ? "cover image" : "SEO field"}`}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "schema" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Auto-generated JSON-LD schema for this post. Validated before publishing.
            </p>
            <pre className="rounded-lg border border-border bg-muted/30 p-3 text-[10px] overflow-x-auto leading-relaxed">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
