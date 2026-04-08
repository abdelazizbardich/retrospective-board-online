"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ExternalLink, RefreshCw, Search } from "lucide-react";

interface BoardSummary {
  id: string;
  name: string;
  phase: string;
  createdAt: number;
  participantCount: number;
  cardCount: number;
  columnCount: number;
  hostId: string | null;
}

const PHASE_COLORS: Record<string, string> = {
  writing:    "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  grouping:   "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  voting:     "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  discussing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  done:       "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
};

export default function BoardsPage() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/boards")
      .then((r) => r.json())
      .then((data) => { if (!cancelled) { setBoards(data.boards); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const fetchBoards = () => { setLoading(true); setRefreshKey((k) => k + 1); };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete board "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    await fetch(`/api/admin/boards/${id}`, { method: "DELETE" });
    setBoards((prev) => prev.filter((b) => b.id !== id));
    setDeletingId(null);
  };

  const filtered = boards.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) || b.id.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Boards</h1>
          <p className="text-muted-foreground text-sm mt-1">{boards.length} total boards</p>
        </div>
        <button
          onClick={fetchBoards}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground text-sm">
          {search ? "No boards match your search" : "No boards yet"}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Phase</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Columns</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Cards</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Participants</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Created</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr
                  key={b.id}
                  className={`${i < filtered.length - 1 ? "border-b border-border/60" : ""} hover:bg-muted/30 transition-colors`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{b.id}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PHASE_COLORS[b.phase] ?? "bg-muted text-muted-foreground"}`}>
                      {b.phase}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{b.columnCount}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{b.cardCount}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{b.participantCount}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {new Date(b.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/board/${b.id}`}
                        target="_blank"
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                        title="Open board"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        disabled={deletingId === b.id}
                        className="flex size-7 items-center justify-center rounded-lg border border-border hover:border-red-400/50 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete board"
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
}
