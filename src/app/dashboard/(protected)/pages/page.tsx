"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { RichTextEditor } from "@/app/components/rich-text-editor";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, X, Save, RefreshCw } from "lucide-react";

interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

const EMPTY = {
  slug: "",
  title: "",
  content: "",
  metaDescription: "",
  published: false,
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 100);
}

export default function PagesAdminPage() {
  const [pages, setPages]       = useState<Page[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState<Page | null>(null);
  const [isNew, setIsNew]       = useState(false);
  const [form, setForm]         = useState({ ...EMPTY });
  const [saving, setSaving]     = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((d) => { setPages(d.pages ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  const openNew = () => {
    setIsNew(true);
    setEditing(null);
    setForm({ ...EMPTY });
  };

  const openEdit = (page: Page) => {
    setIsNew(false);
    setEditing(page);
    setForm({
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaDescription: page.metaDescription,
      published: page.published,
    });
  };

  const closeForm = () => { setEditing(null); setIsNew(false); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = isNew
      ? await fetch("/api/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      : await fetch(`/api/pages/${editing!.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
    if (res.ok) { closeForm(); setRefreshKey((k) => k + 1); }
    setSaving(false);
  };

  const handleDelete = async (page: Page) => {
    if (!confirm(`Delete "${page.title}"?`)) return;
    await fetch(`/api/pages/${page.slug}`, { method: "DELETE" });
    setRefreshKey((k) => k + 1);
  };

  const handleTogglePublish = async (page: Page) => {
    await fetch(`/api/pages/${page.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !page.published }),
    });
    setRefreshKey((k) => k + 1);
  };

  const showForm = editing !== null || isNew;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-muted-foreground text-sm mt-1">{pages.length} page{pages.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setLoading(true); setRefreshKey((k) => k + 1); }}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="size-4" /> New Page
          </button>
        </div>
      </div>

      {/* Page list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : pages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground text-sm">
          No pages yet — create your first one!
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Updated</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page, i) => (
                <tr
                  key={page.id}
                  className={`${i < pages.length - 1 ? "border-b border-border/60" : ""} hover:bg-muted/30 transition-colors`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{page.title}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">/p/{page.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        page.published
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {page.published ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      {page.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs">
                    {new Date(page.updatedAt).toLocaleDateString(undefined, {
                      day: "numeric", month: "short", year: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/p/${page.slug}`}
                        target="_blank"
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                        title="View"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(page)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                        title={page.published ? "Unpublish" : "Publish"}
                      >
                        {page.published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                      <button
                        onClick={() => openEdit(page)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(page)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-red-400/50 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold">{isNew ? "New Page" : "Edit Page"}</h2>
              <button
                onClick={closeForm}
                className="flex size-7 items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
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
                    placeholder="About Us"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Slug *</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground shrink-0">/p/</span>
                    <input
                      required
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                      placeholder="about-us"
                      className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Meta Description</label>
                  <textarea
                    value={form.metaDescription}
                    onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                    rows={2}
                    maxLength={300}
                    placeholder="A short description for search engines…"
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <p className="mt-1 text-xs text-muted-foreground text-right">
                    {form.metaDescription.length}/300
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Content *</label>
                  <RichTextEditor
                    value={form.content}
                    onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                    placeholder="Write your page content here…"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                    className="size-4 rounded border-border accent-primary"
                  />
                  Publish immediately
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Save className="size-4" />
                    {saving ? "Saving…" : "Save Page"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
