"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Save, RefreshCw, GripVertical } from "lucide-react";

type NavLinkArea = "header" | "footer";

interface NavLink {
  id: string;
  label: string;
  href: string;
  area: NavLinkArea;
  position: number;
  openInNewTab: boolean;
}

const EMPTY = {
  label: "",
  href: "",
  area: "header" as NavLinkArea,
  position: 99,
  openInNewTab: false,
};

export default function NavLinksAdminPage() {
  const [links, setLinks]       = useState<NavLink[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState<NavLink | null>(null);
  const [isNew, setIsNew]       = useState(false);
  const [form, setForm]         = useState({ ...EMPTY });
  const [saving, setSaving]     = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("/api/nav-links")
      .then((r) => r.json())
      .then((d) => { setLinks(d.links ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  const headerLinks = links.filter((l) => l.area === "header").sort((a, b) => a.position - b.position);
  const footerLinks = links.filter((l) => l.area === "footer").sort((a, b) => a.position - b.position);

  const openNew = (area: NavLinkArea = "header") => {
    const areaLinks = links.filter((l) => l.area === area);
    const nextPos = areaLinks.length > 0 ? Math.max(...areaLinks.map((l) => l.position)) + 1 : 0;
    setIsNew(true);
    setEditing(null);
    setForm({ ...EMPTY, area, position: nextPos });
  };

  const openEdit = (link: NavLink) => {
    setIsNew(false);
    setEditing(link);
    setForm({
      label: link.label,
      href: link.href,
      area: link.area,
      position: link.position,
      openInNewTab: link.openInNewTab,
    });
  };

  const closeForm = () => { setEditing(null); setIsNew(false); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = isNew
      ? await fetch("/api/nav-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      : await fetch(`/api/nav-links/${editing!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
    if (res.ok) { closeForm(); setRefreshKey((k) => k + 1); }
    else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to save link");
    }
    setSaving(false);
  };

  const handleDelete = async (link: NavLink) => {
    if (!confirm(`Delete "${link.label}"?`)) return;
    await fetch(`/api/nav-links/${link.id}`, { method: "DELETE" });
    setRefreshKey((k) => k + 1);
  };

  const moveLink = async (link: NavLink, direction: "up" | "down") => {
    const areaLinks = links
      .filter((l) => l.area === link.area)
      .sort((a, b) => a.position - b.position);
    const idx = areaLinks.findIndex((l) => l.id === link.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= areaLinks.length) return;

    const posA = areaLinks[idx].position;
    const posB = areaLinks[swapIdx].position;

    await Promise.all([
      fetch(`/api/nav-links/${areaLinks[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position: posB }),
      }),
      fetch(`/api/nav-links/${areaLinks[swapIdx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position: posA }),
      }),
    ]);
    setRefreshKey((k) => k + 1);
  };

  const showForm = editing !== null || isNew;

  const LinkTable = ({ areaLinks, area }: { areaLinks: NavLink[]; area: NavLinkArea }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold capitalize">{area} links</h2>
        <button
          onClick={() => openNew(area)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="size-3.5" /> Add link
        </button>
      </div>

      {areaLinks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
          No {area} links yet
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">Order</th>
                <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">Label</th>
                <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground hidden sm:table-cell">URL</th>
                <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground hidden md:table-cell">New tab</th>
                <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {areaLinks.map((link, i) => (
                <tr
                  key={link.id}
                  className={`${i < areaLinks.length - 1 ? "border-b border-border/60" : ""} hover:bg-muted/30 transition-colors`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <GripVertical className="size-4 text-muted-foreground/50" />
                      <span className="text-muted-foreground text-xs">{i + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-medium">{link.label}</td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs hidden sm:table-cell max-w-[200px] truncate">
                    {link.href}
                  </td>
                  <td className="px-4 py-2.5 hidden md:table-cell">
                    <span className={`text-xs ${link.openInNewTab ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                      {link.openInNewTab ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => moveLink(link, "up")}
                        disabled={i === 0}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-30"
                        title="Move up"
                      >
                        <svg className="size-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4l-5 5h10z"/></svg>
                      </button>
                      <button
                        onClick={() => moveLink(link, "down")}
                        disabled={i === areaLinks.length - 1}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-30"
                        title="Move down"
                      >
                        <svg className="size-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12l5-5H3z"/></svg>
                      </button>
                      <button
                        onClick={() => openEdit(link)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(link)}
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
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Navigation Links</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage the links shown in the site header and footer.
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); setRefreshKey((k) => k + 1); }}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8">
          <LinkTable areaLinks={headerLinks} area="header" />
          <LinkTable areaLinks={footerLinks} area="footer" />
        </div>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold">{isNew ? "New Link" : "Edit Link"}</h2>
              <button
                onClick={closeForm}
                className="flex size-7 items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Label *</label>
                <input
                  required
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="Blog"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">URL *</label>
                <input
                  required
                  value={form.href}
                  onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                  placeholder="/blog or https://example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Area *</label>
                  <select
                    value={form.area}
                    onChange={(e) => setForm((f) => ({ ...f, area: e.target.value as NavLinkArea }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Position</label>
                  <input
                    type="number"
                    min={0}
                    value={form.position}
                    onChange={(e) => setForm((f) => ({ ...f, position: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.openInNewTab}
                    onChange={(e) => setForm((f) => ({ ...f, openInNewTab: e.target.checked }))}
                  />
                  <div className="h-5 w-9 rounded-full bg-muted peer-checked:bg-primary transition-colors" />
                  <div className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-sm font-medium">Open in new tab</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
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
                  {isNew ? "Add Link" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
