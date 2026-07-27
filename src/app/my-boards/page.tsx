"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/lib/user-context";
import {
  LayoutGrid,
  Plus,
  ExternalLink,
  Trash2,
  LogOut,
  Clock,
  Search,
  Lock,
} from "lucide-react";

interface BoardSummary {
  id: string;
  name: string;
  phase: string;
  createdAt: number;
  participantCount: number;
  cardCount: number;
  columnCount: number;
}

const PHASE_COLORS: Record<string, string> = {
  writing: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  grouping: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  voting: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  discussing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  done: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Sign-in / Register form ────────────────────────────────────────────────

function AuthForm() {
  const { login, register } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { setError("Username is required"); return; }
    setLoading(true);
    setError("");
    const fn = mode === "login" ? login : register;
    const result = await fn(username.trim(), usePassword ? password : undefined);
    if (!result.success) setError(result.error ?? "Something went wrong");
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Image src="/sprintsplans-logo.png" alt="SprintsPlans" width={160} height={32} className="h-8 w-auto" />
        </div>

        <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-8 shadow-2xl">
          <h1 className="text-xl font-bold mb-1">My Boards</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to access your boards, or create a new account.
          </p>

          {/* Mode tabs */}
          <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-0.5 mb-6">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${
                  mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. john_doe"
                maxLength={50}
                autoFocus
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={usePassword}
                  onChange={(e) => setUsePassword(e.target.checked)}
                  className="rounded"
                />
                <Lock className="size-3.5 text-muted-foreground" />
                {mode === "login" ? "Use a password" : "Protect with a password (optional)"}
              </label>
              {usePassword && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  maxLength={200}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

// ── Main boards list ───────────────────────────────────────────────────────

export default function MyBoardsPage() {
  const { user, loading: userLoading, logout } = useUser();
  const router = useRouter();
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/users/${user.id}/boards`)
      .then((r) => r.json())
      .then((d) => { setBoards(d.boards ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Delete this board? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/boards/${id}?userId=${user.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert((data as { error?: string }).error ?? "Failed to delete board");
        return;
      }
      setBoards((prev) => prev.filter((b) => b.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  // Not yet loaded
  if (userLoading) return null;

  // Not signed in
  if (!user) return <AuthForm />;

  const filtered = boards.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <Link href="/">
            <Image src="/sprintsplans-logo.png" alt="SprintsPlans" width={140} height={28} className="h-7 w-auto" />
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.username}
              {user.hasPassword && <Lock className="inline ml-1 size-3 text-muted-foreground" />}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Boards</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, <span className="font-medium text-foreground">{user.username}</span>!
            </p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 transition-opacity"
          >
            <Plus className="size-4" />
            New Board
          </Link>
        </div>

        {/* Search */}
        {boards.length > 4 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search boards…"
              className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <LayoutGrid className="size-12 text-muted-foreground/30 mb-4" />
            <p className="font-semibold text-muted-foreground">
              {boards.length === 0 ? "No boards yet" : "No boards match your search"}
            </p>
            {boards.length === 0 && (
              <Link
                href="/create"
                className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 transition-opacity"
              >
                <Plus className="size-4" />
                Create your first board
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((board) => (
              <div
                key={board.id}
                className="group flex flex-col rounded-2xl border border-border bg-background p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold leading-snug line-clamp-2">{board.name}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      PHASE_COLORS[board.phase] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {board.phase}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span>{board.columnCount} columns</span>
                  <span>·</span>
                  <span>{board.cardCount} cards</span>
                  <span>·</span>
                  <span>{board.participantCount} participants</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-4">
                  <Clock className="size-3" />
                  {timeAgo(board.createdAt)}
                </div>
                <div className="mt-auto flex items-center gap-2">
                  <Link
                    href={`/board/${board.id}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <ExternalLink className="size-3.5" />
                    {board.phase === "done" ? "Reopen Session" : "Open"}
                  </Link>
                  <button
                    onClick={() => handleDelete(board.id)}
                    disabled={deletingId === board.id}
                    className="flex items-center justify-center rounded-lg border border-border p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 dark:hover:border-red-800/50 transition-colors disabled:opacity-40"
                    title="Delete board"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
