"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Save, RefreshCw } from "lucide-react";

interface BlogCategory {
  id: string;
  name: string;
  createdAt: number;
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("/api/blog-categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  const openNew = () => {
    setIsNew(true);
    setEditing(null);
    setName("");
  };

  const openEdit = (category: BlogCategory) => {
    setIsNew(false);
    setEditing(category);
    setName(category.name);
  };

  const closeForm = () => {
    setEditing(null);
    setIsNew(false);
    setName("");
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = isNew
      ? await fetch("/api/blog-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        })
      : await fetch(`/api/blog-categories/${editing!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });

    if (res.ok) {
      closeForm();
      setRefreshKey((k) => k + 1);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to save category");
    }
    setSaving(false);
  };

  const handleDelete = async (category: BlogCategory) => {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    await fetch(`/api/blog-categories/${category.id}`, { method: "DELETE" });
    setRefreshKey((k) => k + 1);
  };

  const showForm = editing !== null || isNew;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setLoading(true);
              setRefreshKey((k) => k + 1);
            }}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="size-4" /> New Category
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground text-sm">
          No categories yet — create your first one!
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">
                  Created
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, i) => (
                <tr
                  key={category.id}
                  className={`${i < categories.length - 1 ? "border-b border-border/60" : ""} hover:bg-muted/30 transition-colors`}
                >
                  <td className="px-4 py-3 font-medium">{category.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                    {new Date(category.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(category)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold">{isNew ? "New Category" : "Edit Category"}</h2>
              <button
                onClick={closeForm}
                className="flex size-7 items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Guides"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

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
                  {isNew ? "Create Category" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
