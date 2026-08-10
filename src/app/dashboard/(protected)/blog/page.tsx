"use client";

import { useState, useEffect, FormEvent, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RichTextEditor } from "@/app/components/rich-text-editor";
import { TagInput } from "@/app/components/tag-input";
import { BlogSeoPanel, type SeoFormFields } from "@/app/components/blog-seo-panel";
import { EMPTY_SEO_FORM } from "@/lib/seo/api-helpers";
import { insertInternalLink } from "@/lib/seo/internal-linking";
import { analyzeImages } from "@/lib/seo/analyzers/image-analyzer";
import type { SeoPostInput } from "@/lib/seo/types";
import {
  downloadBlogImportTemplate,
  parseBlogExcelFile,
  type ImportedBlogPost,
} from "@/lib/import-blog";
import { isPhantomLocalCoverPath } from "@/lib/blog-thumbnail";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, X, Save, RefreshCw, Upload, Download, FileSpreadsheet, ImageIcon, Sparkles, Clock, BarChart3, Search, CheckCircle2, AlertTriangle,
} from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  tags: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  seoTitle: string;
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
  seoScore: number;
  published: boolean;
  scheduledAt: number | null;
  createdAt: number;
  updatedAt: number;
}

type PublishMode = "draft" | "now" | "schedule";
type StatusFilter = "all" | "published" | "draft" | "scheduled";
type BlogSort = "updatedAt" | "title" | "seoScore" | "category";

function toDatetimeLocalValue(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getPublishMode(post: BlogPost): PublishMode {
  if (post.published) return "now";
  if (post.scheduledAt != null && post.scheduledAt > Date.now()) return "schedule";
  return "draft";
}

function getPostStatus(post: BlogPost): "published" | "scheduled" | "draft" {
  if (post.published) return "published";
  if (post.scheduledAt != null && post.scheduledAt > Date.now()) return "scheduled";
  return "draft";
}

interface BlogCategory {
  id: string;
  name: string;
}

const EMPTY = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  author: "",
  category: "",
  coverImage: "",
  coverImageAlt: "",
  tags: "",
  metaDescription: "",
  ...EMPTY_SEO_FORM,
  publishMode: "draft" as PublishMode,
  scheduledAtLocal: "",
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 100);
}

function getTableCoverImage(post: BlogPost): string {
  const cover = post.coverImage.trim();
  if (cover && !isPhantomLocalCoverPath(cover)) return cover;
  return "";
}

export default function BlogAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingEditSlug = useRef<string | null>(null);
  const [posts, setPosts]       = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState<BlogPost | null>(null);
  const [isNew, setIsNew]       = useState(false);
  const [form, setForm]         = useState({ ...EMPTY });
  const [saving, setSaving]     = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkPublishing, setBulkPublishing] = useState(false);

  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPosts, setImportPosts] = useState<ImportedBlogPost[] | null>(null);
  const [importError, setImportError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [importErrorDetails, setImportErrorDetails] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [coverUploading, setCoverUploading] = useState(false);
  const [coverGenerating, setCoverGenerating] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState("");
  const [coverDragOver, setCoverDragOver] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [seoMigrated, setSeoMigrated] = useState<boolean | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<BlogSort>("updatedAt");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/blog").then((r) => r.json()),
      fetch("/api/blog-categories").then((r) => r.json()),
      fetch("/api/blog/seo-migration-status").then((r) => r.json()).catch(() => ({ migrated: null })),
    ])
      .then(([postsData, categoriesData, seoStatus]) => {
        setPosts(postsData.posts ?? []);
        setCategories(categoriesData.categories ?? []);
        setSeoMigrated(seoStatus.migrated === true ? true : seoStatus.migrated === false ? false : null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  useEffect(() => {
    const editSlug = searchParams.get("edit");
    if (editSlug) pendingEditSlug.current = editSlug;
  }, [searchParams]);

  const openNew = () => {
    setIsNew(true);
    setEditing(null);
    setForm({ ...EMPTY });
    setCoverUploadError("");
    setCoverGenerating(false);
  };

  const openEdit = (post: BlogPost) => {
    setIsNew(false);
    setEditing(post);
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category ?? "",
      coverImage: isPhantomLocalCoverPath(post.coverImage) ? "" : post.coverImage,
      coverImageAlt: post.coverImageAlt ?? "",
      tags: post.tags,
      metaDescription: post.metaDescription,
      focusKeyword: post.focusKeyword ?? "",
      secondaryKeywords: post.secondaryKeywords ?? "",
      seoTitle: post.seoTitle ?? "",
      canonicalUrl: post.canonicalUrl ?? "",
      robotsIndex: post.robotsIndex ?? true,
      robotsFollow: post.robotsFollow ?? true,
      ogTitle: post.ogTitle ?? "",
      ogDescription: post.ogDescription ?? "",
      ogImage: post.ogImage ?? "",
      twitterTitle: post.twitterTitle ?? "",
      twitterDescription: post.twitterDescription ?? "",
      twitterImage: post.twitterImage ?? "",
      schemaType: post.schemaType ?? "BlogPosting",
      publishMode: getPublishMode(post),
      scheduledAtLocal:
        post.scheduledAt != null && post.scheduledAt > Date.now()
          ? toDatetimeLocalValue(post.scheduledAt)
          : "",
    });
    setCoverUploadError("");
    setCoverGenerating(false);
  };

  useEffect(() => {
    if (loading || !pendingEditSlug.current) return;
    const post = posts.find((p) => p.slug === pendingEditSlug.current);
    if (!post) return;
    pendingEditSlug.current = null;
    openEdit(post);
    router.replace("/dashboard/blog", { scroll: false });
  }, [loading, posts, router]);

  const closeForm = () => {
    setEditing(null);
    setIsNew(false);
    setCoverUploadError("");
    setCoverGenerating(false);
  };

  const handleCoverUpload = async (file: File) => {
    setCoverUploadError("");
    if (!file.type.startsWith("image/")) {
      setCoverUploadError("Please upload an image file (JPEG, PNG, WebP, or GIF)");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setCoverUploadError("Image must be under 4 MB");
      return;
    }

    setCoverUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("slug", form.slug || slugify(form.title) || "cover");

      const res = await fetch("/api/blog/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCoverUploadError(data.error ?? "Upload failed");
        return;
      }
      setForm((f) => ({
        ...f,
        coverImage: data.url,
        coverImageAlt: f.coverImageAlt.trim() || f.title.trim(),
      }));
    } catch {
      setCoverUploadError("Upload failed");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleCoverGenerate = async () => {
    setCoverUploadError("");
    if (!form.title.trim()) {
      setCoverUploadError("Add a title before generating a cover image");
      return;
    }

    setCoverGenerating(true);
    try {
      const res = await fetch("/api/blog/generate-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt,
          slug: form.slug || slugify(form.title) || "cover",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCoverUploadError(data.error ?? "Image generation failed");
        return;
      }
      const url = String(data.url ?? "");
      setForm((f) => ({
        ...f,
        coverImage: url,
        coverImageAlt: f.coverImageAlt.trim() || f.title.trim(),
      }));

      if (!isNew && editing && url) {
        const saveRes = await fetch(`/api/blog/${editing.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coverImage: url }),
        });
        if (!saveRes.ok) {
          const saveData = await saveRes.json().catch(() => ({}));
          setCoverUploadError(saveData.error ?? "Cover generated but failed to save — click Save to retry");
          return;
        }
        setRefreshKey((k) => k + 1);
      }
    } catch {
      setCoverUploadError("Image generation failed");
    } finally {
      setCoverGenerating(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    let published = false;
    let scheduledAt: number | null = null;

    if (form.publishMode === "now") {
      published = true;
    } else if (form.publishMode === "schedule") {
      if (!form.scheduledAtLocal) {
        alert("Pick a publish date and time");
        return;
      }
      scheduledAt = new Date(form.scheduledAtLocal).getTime();
      if (!Number.isFinite(scheduledAt) || scheduledAt <= Date.now()) {
        alert("Schedule time must be in the future");
        return;
      }
    }

    const { publishMode: _publishMode, scheduledAtLocal: _scheduledAtLocal, ...rest } = form;
    const payload = { ...rest, published, scheduledAt };

    setSaving(true);
    const res = isNew
      ? await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/blog/${editing!.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    if (res.ok) { closeForm(); setRefreshKey((k) => k + 1); }
    else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to save post");
    }
    setSaving(false);
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    await fetch(`/api/blog/${post.slug}`, { method: "DELETE" });
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      next.delete(post.slug);
      return next;
    });
    setRefreshKey((k) => k + 1);
  };

  const toggleSelect = (slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (statusFilter !== "all") {
      result = result.filter((post) => getPostStatus(post) === statusFilter);
    }

    if (categoryFilter) {
      result = result.filter((post) => post.category === categoryFilter);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.slug.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "seoScore":
          return (b.seoScore ?? 0) - (a.seoScore ?? 0);
        case "category":
          return (a.category ?? "").localeCompare(b.category ?? "");
        default:
          return b.updatedAt - a.updatedAt;
      }
    });

    return result;
  }, [posts, statusFilter, categoryFilter, searchQuery, sort]);

  const categoryOptions = useMemo(() => {
    const names = new Set(categories.map((c) => c.name));
    for (const post of posts) {
      if (post.category) names.add(post.category);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [categories, posts]);

  const toggleSelectAll = () => {
    setSelectedSlugs((prev) => {
      const filteredSlugs = filteredPosts.map((p) => p.slug);
      const allSelected =
        filteredSlugs.length > 0 && filteredSlugs.every((slug) => prev.has(slug));
      if (allSelected) {
        const next = new Set(prev);
        for (const slug of filteredSlugs) next.delete(slug);
        return next;
      }
      return new Set([...prev, ...filteredSlugs]);
    });
  };

  const selectedPosts = posts.filter((p) => selectedSlugs.has(p.slug));
  const selectedDraftCount = selectedPosts.filter((p) => getPostStatus(p) !== "published").length;
  const selectedPublishedCount = selectedPosts.filter((p) => getPostStatus(p) === "published").length;

  const handleBulkPublish = async (published: boolean) => {
    const count = selectedSlugs.size;
    if (count === 0) return;

    const action = published ? "publish" : "unpublish";
    if (!confirm(`${published ? "Publish" : "Unpublish"} ${count} post${count !== 1 ? "s" : ""}?`)) return;

    setBulkPublishing(true);
    try {
      const res = await fetch("/api/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: [...selectedSlugs], published }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? `Bulk ${action} failed`);
        return;
      }
      setSelectedSlugs(new Set());
      setRefreshKey((k) => k + 1);
    } catch {
      alert(`Bulk ${action} failed`);
    } finally {
      setBulkPublishing(false);
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedSlugs.size;
    if (count === 0) return;
    if (!confirm(`Delete ${count} post${count !== 1 ? "s" : ""}? This cannot be undone.`)) return;

    setBulkDeleting(true);
    try {
      const res = await fetch("/api/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: [...selectedSlugs] }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Bulk delete failed");
        return;
      }
      setSelectedSlugs(new Set());
      setRefreshKey((k) => k + 1);
    } catch {
      alert("Bulk delete failed");
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const willPublish = getPostStatus(post) !== "published";
    await fetch(`/api/blog/${post.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: willPublish, scheduledAt: null }),
    });
    setRefreshKey((k) => k + 1);
  };

  const closeImport = () => {
    setShowImport(false);
    setImportFile(null);
    setImportPosts(null);
    setImportError("");
    setImportResult(null);
    setImportErrorDetails([]);
    setDragOver(false);
  };

  const handleImportFile = async (file: File) => {
    setImportError("");
    setImportResult(null);
    setImportErrorDetails([]);
    setImportPosts(null);
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setImportError("Please upload an Excel file (.xlsx or .xls)");
      setImportFile(null);
      return;
    }
    setImportFile(file);
    try {
      const posts = await parseBlogExcelFile(file);
      if (posts.length === 0) {
        setImportError("No valid posts found. Ensure title and content columns are filled.");
        return;
      }
      setImportPosts(posts);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Failed to parse Excel file");
    }
  };

  const handleImport = async () => {
    if (!importPosts || importPosts.length === 0) return;
    setImporting(true);
    setImportError("");
    setImportResult(null);
    setImportErrorDetails([]);
    try {
      const res = await fetch("/api/blog/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: importPosts }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setImportError(data.error ?? "Import failed");
        setImporting(false);
        return;
      }
      setImportResult(
        `Imported ${data.created} post${data.created !== 1 ? "s" : ""}` +
          (data.skipped ? `, skipped ${data.skipped}` : "") +
          (data.errors ? `, ${data.errors} error${data.errors !== 1 ? "s" : ""}` : "")
      );
      const reasons = Array.from(
        new Set(
          ((data.details?.errors ?? []) as { reason?: string }[])
            .map((e) => e.reason)
            .filter(Boolean) as string[]
        )
      ).slice(0, 5);
      setImportErrorDetails(reasons);
      setRefreshKey((k) => k + 1);
    } catch {
      setImportError("Import failed");
    }
    setImporting(false);
  };

  const showForm = editing !== null || isNew;

  const seoFields: SeoFormFields = useMemo(() => ({
    focusKeyword: form.focusKeyword,
    secondaryKeywords: form.secondaryKeywords,
    seoTitle: form.seoTitle,
    metaDescription: form.metaDescription,
    canonicalUrl: form.canonicalUrl,
    robotsIndex: form.robotsIndex,
    robotsFollow: form.robotsFollow,
    ogTitle: form.ogTitle,
    ogDescription: form.ogDescription,
    ogImage: form.ogImage,
    twitterTitle: form.twitterTitle,
    twitterDescription: form.twitterDescription,
    twitterImage: form.twitterImage,
    schemaType: form.schemaType,
  }), [form]);

  const seoPostInput: SeoPostInput = useMemo(() => ({
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    content: form.content,
    coverImage: form.coverImage,
    coverImageAlt: form.coverImageAlt,
    tags: form.tags,
    category: form.category,
    author: form.author,
    ...seoFields,
  }), [form, seoFields]);

  const coverAltSeoCheck = useMemo(() => {
    if (!form.coverImage.trim()) return null;
    return analyzeImages(seoPostInput).checks?.find((check) =>
      check.label.toLowerCase().includes("cover image")
    );
  }, [form.coverImage, seoPostInput]);

  const allPostsForSeo = useMemo(
    () => posts.map((p) => ({ slug: p.slug, title: p.title, content: p.content, category: p.category, tags: p.tags })),
    [posts]
  );

  const handleSeoChange = (fields: Partial<SeoFormFields>) => {
    setForm((f) => ({ ...f, ...fields }));
  };

  const handleInsertLink = (slug: string, anchor: string, title: string) => {
    setForm((f) => ({
      ...f,
      content: insertInternalLink(f.content, slug, anchor, title),
    }));
  };

  function seoScoreBadge(score: number) {
    if (score >= 80) return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";
    if (score >= 60) return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
    if (score >= 40) return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
    return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredPosts.length === posts.length
              ? `${posts.length} post${posts.length !== 1 ? "s" : ""}`
              : `${filteredPosts.length} of ${posts.length} post${posts.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {selectedSlugs.size > 0 && (
            <>
              {selectedDraftCount > 0 && (
                <button
                  onClick={() => handleBulkPublish(true)}
                  disabled={bulkPublishing || bulkDeleting}
                  className="flex items-center gap-2 rounded-lg border border-green-400/50 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30 transition-colors disabled:opacity-50"
                >
                  {bulkPublishing ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                  Publish {selectedDraftCount} selected
                </button>
              )}
              {selectedPublishedCount > 0 && (
                <button
                  onClick={() => handleBulkPublish(false)}
                  disabled={bulkPublishing || bulkDeleting}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {bulkPublishing ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                  Unpublish {selectedPublishedCount} selected
                </button>
              )}
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting || bulkPublishing}
                className="flex items-center gap-2 rounded-lg border border-red-400/50 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
              >
                {bulkDeleting ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Delete {selectedSlugs.size} selected
              </button>
            </>
          )}
          <button
            onClick={() => { setLoading(true); setRefreshKey((k) => k + 1); }}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/dashboard/blog/seo"
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <BarChart3 className="size-4" />
            SEO Dashboard
          </Link>
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <ExternalLink className="size-4" />
            View Blog
          </Link>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Upload className="size-4" />
            Import
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="size-4" /> New Post
          </button>
        </div>
      </div>

      {seoMigrated === false && (
        <div className="rounded-xl border border-amber-400/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          <p className="font-medium">SEO database migration pending</p>
          <p className="mt-1 text-xs opacity-90">
            Posts save normally, but SEO scores and focus keywords won&apos;t persist until you run{" "}
            <code className="font-mono">scripts/migrate-blog-seo.sql</code> in the Supabase SQL Editor.
          </p>
        </div>
      )}

      {/* Post list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground text-sm">
          No posts yet — create your first one!
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative min-w-[200px] flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title or slug..."
                className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {(["all", "published", "draft", "scheduled"] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    statusFilter === status
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
            >
              <option value="">All categories</option>
              {categoryOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as BlogSort)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
            >
              <option value="updatedAt">Sort: Last Updated</option>
              <option value="title">Sort: Title</option>
              <option value="seoScore">Sort: SEO Score</option>
              <option value="category">Sort: Category</option>
            </select>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground text-sm">
              No posts match this filter.
            </div>
          ) : (
        <div className="rounded-xl border border-border overflow-hidden bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      filteredPosts.length > 0 &&
                      filteredPosts.every((post) => selectedSlugs.has(post.slug))
                    }
                    ref={(el) => {
                      if (!el) return;
                      const selectedCount = filteredPosts.filter((post) =>
                        selectedSlugs.has(post.slug)
                      ).length;
                      el.indeterminate =
                        selectedCount > 0 && selectedCount < filteredPosts.length;
                    }}
                    onChange={toggleSelectAll}
                    className="size-4 rounded border-border accent-primary cursor-pointer"
                    title="Select all"
                  />
                </th>
                <th className="w-14 px-2 py-3 text-left font-semibold text-muted-foreground">Image</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">SEO</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Tags</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden xl:table-cell">Author</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden xl:table-cell">Updated</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post, i) => {
                const coverImage = getTableCoverImage(post);

                return (
                <tr
                  key={post.id}
                  className={`${i < filteredPosts.length - 1 ? "border-b border-border/60" : ""} ${selectedSlugs.has(post.slug) ? "bg-primary/5" : ""} hover:bg-muted/30 transition-colors`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedSlugs.has(post.slug)}
                      onChange={() => toggleSelect(post.slug)}
                      className="size-4 rounded border-border accent-primary cursor-pointer"
                      aria-label={`Select ${post.title}`}
                    />
                  </td>
                  <td className="px-2 py-3">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt=""
                        className="size-10 rounded-md border border-border object-cover"
                      />
                    ) : (
                      <div
                        className="flex size-10 items-center justify-center rounded-md border border-dashed border-border bg-muted/50 text-muted-foreground"
                        title="No cover image"
                      >
                        <ImageIcon className="size-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{post.title}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${seoScoreBadge(post.seoScore ?? 0)}`}>
                      {post.seoScore ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {(() => {
                      const status = getPostStatus(post);
                      return (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            status === "published"
                              ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                              : status === "scheduled"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {status === "published" ? (
                            <Eye className="size-3" />
                          ) : status === "scheduled" ? (
                            <Clock className="size-3" />
                          ) : (
                            <EyeOff className="size-3" />
                          )}
                          {status === "published"
                            ? "Published"
                            : status === "scheduled"
                              ? `Scheduled ${new Date(post.scheduledAt!).toLocaleString(undefined, {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`
                              : "Draft"}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                    {post.category || <span className="italic">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs">
                    {post.tags ? (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="italic">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell text-xs">
                    {post.author || <span className="italic">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell text-xs">
                    {new Date(post.updatedAt).toLocaleDateString(undefined, {
                      day: "numeric", month: "short", year: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {getPostStatus(post) === "published" && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                          title="View"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>
                      )}
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                        title={getPostStatus(post) === "published" ? "Unpublish" : "Publish now"}
                      >
                        {getPostStatus(post) === "published" ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                      <button
                        onClick={() => openEdit(post)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-red-400/50 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
          )}
        </>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl rounded-2xl border border-border bg-background shadow-2xl my-8 flex flex-col max-h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
              <h2 className="text-lg font-bold">{isNew ? "New Post" : "Edit Post"}</h2>
              <button
                onClick={closeForm}
                className="flex size-7 items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden">
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      title: e.target.value,
                      slug: isNew ? slugify(e.target.value) : f.slug,
                    }))
                  }
                  placeholder="My First Blog Post"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Slug *</label>
                <div className="flex items-center gap-0">
                  <span className="rounded-l-xl border border-r-0 border-border bg-muted px-3 py-2.5 text-xs text-muted-foreground select-none">
                    /blog/
                  </span>
                  <input
                    required
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    placeholder="my-first-blog-post"
                    className="flex-1 rounded-r-xl border border-border bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Author, Category & Tags */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Author</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">No category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    {form.category &&
                      !categories.some((c) => c.name === form.category) && (
                        <option value={form.category}>{form.category} (missing)</option>
                      )}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      No categories yet —{" "}
                      <Link href="/dashboard/categories" className="text-primary hover:underline">
                        create one
                      </Link>
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Tags</label>
                  <TagInput
                    value={form.tags}
                    onChange={(tags) => setForm((f) => ({ ...f, tags }))}
                    placeholder="Type a tag and press comma…"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Cover Image</label>

                {form.coverImage && (
                  <div className="relative mb-3 rounded-xl overflow-hidden border border-border">
                    <img
                      src={form.coverImage}
                      alt={form.coverImageAlt.trim() || form.title.trim() || "Cover preview"}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, coverImage: "", coverImageAlt: "" }))}
                      className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-muted transition-colors"
                      title="Remove cover image"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                <div
                  onDragOver={(e) => { e.preventDefault(); setCoverDragOver(true); }}
                  onDragLeave={() => setCoverDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setCoverDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) void handleCoverUpload(file);
                  }}
                  className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors mb-3 ${
                    coverDragOver ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <ImageIcon className="size-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">
                    {coverGenerating
                      ? "Generating cover image…"
                      : coverUploading
                        ? "Uploading…"
                        : "Drop image here or choose file"}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">JPEG, PNG, WebP, or GIF — max 4 MB</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={coverUploading || coverGenerating || !form.title.trim()}
                      onClick={() => coverFileInputRef.current?.click()}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      <Upload className="size-3.5 inline mr-1.5 -mt-0.5" />
                      Upload image
                    </button>
                    <button
                      type="button"
                      disabled={coverUploading || coverGenerating || !form.title.trim()}
                      onClick={() => void handleCoverGenerate()}
                      className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="size-3.5 inline mr-1.5 -mt-0.5" />
                      {coverGenerating ? "Generating…" : "Generate from title"}
                    </button>
                  </div>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleCoverUpload(file);
                      e.target.value = "";
                    }}
                  />
                </div>

                {coverUploadError && (
                  <p className="text-xs text-red-500 mb-2">{coverUploadError}</p>
                )}

                <p className="text-xs text-muted-foreground mb-1.5">Or paste a URL</p>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                  placeholder="https://images.unsplash.com/…"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                <label className="block text-sm font-medium mt-3 mb-1.5">Image alt text</label>
                <input
                  type="text"
                  value={form.coverImageAlt}
                  onChange={(e) => setForm((f) => ({ ...f, coverImageAlt: e.target.value }))}
                  placeholder="Describe the cover image for accessibility and SEO"
                  maxLength={200}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Shown to screen readers and search engines. Defaults to the post title if left empty.
                </p>
                {coverAltSeoCheck && (
                  <div className="mt-2 flex items-start gap-1.5">
                    {coverAltSeoCheck.passed ? (
                      <CheckCircle2 className="size-3.5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <p className="text-xs text-muted-foreground">
                      {coverAltSeoCheck.passed
                        ? coverAltSeoCheck.label
                        : coverAltSeoCheck.fix ?? coverAltSeoCheck.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  rows={2}
                  placeholder="A short summary shown on the blog listing page…"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Content *</label>
                <div className="rounded-xl border border-border overflow-hidden">
                  <RichTextEditor
                    value={form.content}
                    onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                    placeholder="Write your post here…"
                    uploadSlug={form.slug || slugify(form.title) || "content"}
                  />
                </div>
              </div>

              {/* Publish options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">Publishing</label>
                <div className="flex flex-wrap gap-2">
                  {([
                    ["draft", "Draft"],
                    ["now", "Publish now"],
                    ["schedule", "Schedule"],
                  ] as const).map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, publishMode: mode }))}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        form.publishMode === mode
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {form.publishMode === "schedule" && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Publish at</label>
                    <input
                      type="datetime-local"
                      value={form.scheduledAtLocal}
                      min={toDatetimeLocalValue(Date.now() + 60_000)}
                      onChange={(e) => setForm((f) => ({ ...f, scheduledAtLocal: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      The post will go live automatically at the chosen time.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 pb-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {isNew ? "Create Post" : "Save Changes"}
                </button>
              </div>
            </form>

              {/* SEO Sidebar */}
              <div className="hidden lg:flex w-80 xl:w-96 shrink-0 border-l border-border flex-col min-h-0">
                <BlogSeoPanel
                  postInput={seoPostInput}
                  seoFields={seoFields}
                  onSeoChange={handleSeoChange}
                  onInsertLink={handleInsertLink}
                  allPosts={allPostsForSeo}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold">Import from Excel</h2>
              <button
                onClick={closeImport}
                className="flex size-7 items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm text-muted-foreground">
                Upload an .xlsx or .xls file with columns for title and content.
                Optional: slug, excerpt, author, category, coverImage, tags, metaDescription, focusKeyword.
                Imported posts are saved as drafts — publish them from the dashboard when ready.
                Mentions of other post titles are auto-linked to <code className="text-xs">/blog/…</code> during import.
                <strong>SprintsPlans</strong> is linked to <code className="text-xs">https://sprintsplans.com</code>.
                Missing cover images use the first image in content, or a generated thumbnail.
              </p>

              <button
                type="button"
                onClick={() => downloadBlogImportTemplate()}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Download className="size-4" />
                Download template
              </button>

              {!importFile ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) void handleImportFile(file);
                  }}
                  className={`rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
                    dragOver ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <FileSpreadsheet className="size-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Drop Excel file here</p>
                  <p className="text-xs text-muted-foreground mb-4">.xlsx or .xls</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Choose file
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleImportFile(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{importFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {importPosts
                          ? `${importPosts.length} post${importPosts.length !== 1 ? "s" : ""} ready to import`
                          : "Parsing…"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImportFile(null);
                        setImportPosts(null);
                        setImportError("");
                        setImportResult(null);
                        setImportErrorDetails([]);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>

                  {importPosts && importPosts.length > 0 && (
                    <ul className="max-h-40 overflow-y-auto text-xs text-muted-foreground space-y-1 border-t border-border pt-3">
                      {importPosts.slice(0, 8).map((p) => (
                        <li key={p.slug} className="truncate">
                          <span className="font-medium text-foreground">{p.title}</span>
                          {" — "}/blog/{p.slug}
                        </li>
                      ))}
                      {importPosts.length > 8 && (
                        <li>…and {importPosts.length - 8} more</li>
                      )}
                    </ul>
                  )}
                </div>
              )}

              {importError && (
                <p className="text-sm text-red-500 font-medium">{importError}</p>
              )}
              {importResult && (
                <div className="space-y-2">
                  <p
                    className={`text-sm font-medium ${
                      importErrorDetails.length > 0
                        ? "text-red-500"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {importResult}
                  </p>
                  {importErrorDetails.length > 0 && (
                    <ul className="text-xs text-red-500/90 space-y-1 list-disc pl-4">
                      {importErrorDetails.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeImport}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                >
                  {importResult ? "Close" : "Cancel"}
                </button>
                {!importResult && (
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={importing || !importPosts || importPosts.length === 0}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {importing ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    Import {importPosts ? `${importPosts.length} Post${importPosts.length !== 1 ? "s" : ""}` : "Posts"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
