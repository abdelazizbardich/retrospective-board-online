"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { RichTextEditor } from "@/app/components/rich-text-editor";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, X, Save, RefreshCw, Upload } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverEmoji: string;
  coverImage: string;
  publishedAt: number;
  published: boolean;
  tags: string[];
}

const EMPTY: Omit<BlogPost, "id" | "publishedAt"> = {
  slug: "", title: "", excerpt: "", content: "", author: "SprintsPlans Team",
  coverEmoji: "📝", coverImage: "", published: false, tags: [],
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 100);
}

export default function BlogAdminPage() {
  const [posts, setPosts]         = useState<BlogPost[]>([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState<BlogPost | null>(null);
  const [isNew, setIsNew]         = useState(false);
  const [form, setForm]           = useState({ ...EMPTY });
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]    = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [refreshKey, setRefreshKey]  = useState(0);
  const fileInputRef                 = useRef<HTMLInputElement>(null);
  const emojiPickerRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  const openNew = () => {
    setIsNew(true);
    setEditing(null);
    setForm({ ...EMPTY });
    setTagsInput("");
  };

  const openEdit = (post: BlogPost) => {
    setIsNew(false);
    setEditing(post);
    setForm({ slug: post.slug, title: post.title, excerpt: post.excerpt, content: post.content, author: post.author, coverEmoji: post.coverEmoji, coverImage: post.coverImage ?? "", published: post.published, tags: post.tags });
    setTagsInput(post.tags.join(", "));
  };

  const closeForm = () => { setEditing(null); setIsNew(false); setEmojiPickerOpen(false); };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/blog/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm((f) => ({ ...f, coverImage: url }));
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
    const res = isNew
      ? await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch(`/api/blog/${editing!.slug}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { closeForm(); setRefreshKey((k) => k + 1); }
    setSaving(false);
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    await fetch(`/api/blog/${post.slug}`, { method: "DELETE" });
    setRefreshKey((k) => k + 1);
  };

  const handleTogglePublish = async (post: BlogPost) => {
    await fetch(`/api/blog/${post.slug}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    setRefreshKey((k) => k + 1);
  };

  const showForm = editing !== null || isNew;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">{posts.length} posts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setLoading(true); setRefreshKey((k) => k + 1); }}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            <Plus className="size-4" /> New Post
          </button>
        </div>
      </div>

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
        <div className="rounded-xl border border-border overflow-hidden bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Published</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id} className={`${i < posts.length - 1 ? "border-b border-border/60" : ""} hover:bg-muted/30 transition-colors`}>
                  <td className="px-4 py-3">
                    <p className="font-medium flex items-center gap-2">{post.coverEmoji} {post.title}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${post.published ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {post.published ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs">
                    {new Date(post.publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/blog/${post.slug}`} target="_blank"
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors" title="View">
                        <ExternalLink className="size-3.5" />
                      </Link>
                      <button onClick={() => handleTogglePublish(post)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                        title={post.published ? "Unpublish" : "Publish"}>
                        {post.published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                      <button onClick={() => openEdit(post)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors" title="Edit">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => handleDelete(post)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-red-400/50 hover:text-red-500 transition-colors" title="Delete">
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
              <h2 className="text-lg font-bold">{isNew ? "New Post" : "Edit Post"}</h2>
              <button onClick={closeForm} className="flex size-7 items-center justify-center rounded-lg hover:bg-muted transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Title *</label>
                  <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: isNew ? slugify(e.target.value) : f.slug }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Slug *</label>
                  <input required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium mb-1.5">Cover Emoji (fallback)</label>
                  <button
                    type="button"
                    onClick={() => setEmojiPickerOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <span className="text-xl leading-none">{form.coverEmoji}</span>
                    <span className="text-muted-foreground text-xs">Change</span>
                  </button>
                  {emojiPickerOpen && (
                    <div ref={emojiPickerRef} className="absolute z-50 mt-1">
                      <EmojiPicker
                        onEmojiClick={(data: EmojiClickData) => {
                          setForm((f) => ({ ...f, coverEmoji: data.emoji }));
                          setEmojiPickerOpen(false);
                        }}
                        autoFocusSearch
                        height={380}
                      />
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Cover Image</label>
                  <div className="space-y-2">
                    {form.coverImage && (
                      <div className="relative h-32 w-full overflow-hidden rounded-xl border border-border bg-muted">
                        <Image src={form.coverImage} alt="cover preview" fill className="object-cover" />
                        <button type="button" onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
                          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                          <X className="size-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                        placeholder="https://…  or upload below"
                        className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileUpload} />
                      <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()}
                        className="flex shrink-0 items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50">
                        {uploading ? <RefreshCw className="size-4 animate-spin" /> : <Upload className="size-4" />}
                        {uploading ? "Uploading…" : "Upload"}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Author</label>
                  <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label>
                  <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="agile, tips, remote"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Excerpt</label>
                  <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} maxLength={500}
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Content *</label>
                  <RichTextEditor
                    value={form.content}
                    onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                    placeholder="Write your post content here…"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                    className="size-4 rounded border-border accent-primary" />
                  Publish immediately
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={closeForm} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                  <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                    <Save className="size-4" />{saving ? "Saving…" : "Save Post"}
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
