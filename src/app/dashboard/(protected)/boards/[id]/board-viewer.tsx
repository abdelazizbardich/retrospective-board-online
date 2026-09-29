"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, EyeOff, ThumbsUp, Crown, MessageSquare, Users } from "lucide-react";
import type { Board, Participant } from "@/lib/types";

const POLL_INTERVAL_MS = 3000;

const COLUMN_ACCENTS: Record<string, string> = {
  green:  "bg-green-500",
  red:    "bg-red-500",
  blue:   "bg-blue-500",
  yellow: "bg-yellow-400",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  gray:   "bg-zinc-400",
};

const PHASE_COLORS: Record<string, string> = {
  writing:    "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  grouping:   "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  voting:     "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  discussing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  done:       "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function BoardViewer({ boardId }: { boardId: string }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/boards/${boardId}`, { cache: "no-store" });
        if (cancelled) return;
        if (!res.ok) {
          setError(res.status === 404 ? "Board not found" : "Failed to load board");
          return;
        }
        const data: Board = await res.json();
        if (cancelled) return;
        setBoard(data);
        setError(null);
        setLastUpdated(Date.now());
      } catch {
        if (!cancelled) setError("Failed to load board");
      }
    };
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [boardId]);

  if (error && !board) {
    return (
      <div className="space-y-4">
        <BackLink />
        <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const participantsById = new Map<string, Participant>(board.participants.map((p) => [p.id, p]));
  const nameOf = (id: string) => participantsById.get(id)?.name ?? "Unknown";
  const active = board.participants.filter((p) => !p.left);
  const left = board.participants.filter((p) => p.left);
  const cardCount = board.columns.reduce((sum, c) => sum + c.cards.length, 0);

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{board.name}</h1>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PHASE_COLORS[board.phase] ?? "bg-muted text-muted-foreground"}`}>
              {board.phase}
            </span>
            {board.closed && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Closed
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            <span className="font-mono">{board.id}</span> · {cardCount} cards · {active.length} online
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <EyeOff className="size-3.5" />
          <span>
            Silent view: participants can&apos;t see you
            {lastUpdated && <> · updated {formatTime(lastUpdated)}</>}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}. Showing last loaded data.</p>
      )}

      {/* Columns */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {board.columns.map((col) => (
          <section key={col.id} className="rounded-xl border border-border bg-background overflow-hidden">
            <div className={`h-1 ${COLUMN_ACCENTS[col.color] ?? "bg-muted"}`} />
            <header className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <h2 className="font-semibold">
                <span className="mr-1.5">{col.emoji}</span>
                {col.title}
              </h2>
              <span className="text-xs text-muted-foreground">{col.cards.length}</span>
            </header>
            <div className="p-3 space-y-2">
              {col.cards.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No cards</p>
              ) : (
                [...col.cards]
                  .sort((a, b) => b.votes.length - a.votes.length || a.createdAt - b.createdAt)
                  .map((card) => {
                    const reactions = Object.entries(card.reactions ?? {}).filter(([, ids]) => ids.length > 0);
                    return (
                      <article key={card.id} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                        <p className="text-sm whitespace-pre-wrap break-words">{card.text}</p>
                        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span>{card.anonymous ? "Anonymous" : nameOf(card.authorId)}</span>
                          <div className="flex items-center gap-2">
                            {reactions.map(([emoji, ids]) => (
                              <span key={emoji}>{emoji} {ids.length}</span>
                            ))}
                            {card.votes.length > 0 && (
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="size-3" /> {card.votes.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Participants */}
        <section className="rounded-xl border border-border bg-background">
          <header className="flex items-center gap-2 px-4 py-3 border-b border-border/60 font-semibold">
            <Users className="size-4" /> Participants
          </header>
          <ul className="p-3 space-y-1 text-sm">
            {board.participants.length === 0 && (
              <li className="text-xs text-muted-foreground text-center py-4">Nobody has joined yet</li>
            )}
            {[...active, ...left].map((p) => (
              <li key={p.id} className={`flex items-center justify-between gap-2 px-1 py-1 ${p.left ? "text-muted-foreground" : ""}`}>
                <span className="flex items-center gap-1.5">
                  {p.id === board.hostId && <Crown className="size-3.5 text-yellow-500" />}
                  {p.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {p.left ? "left" : `joined ${formatTime(p.joinedAt)}`}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Chat */}
        <section className="rounded-xl border border-border bg-background lg:col-span-2">
          <header className="flex items-center gap-2 px-4 py-3 border-b border-border/60 font-semibold">
            <MessageSquare className="size-4" /> Chat
          </header>
          <ul className="p-3 space-y-2 text-sm max-h-96 overflow-y-auto">
            {(board.messages ?? []).length === 0 && (
              <li className="text-xs text-muted-foreground text-center py-4">No messages</li>
            )}
            {(board.messages ?? []).map((m) => (
              <li key={m.id} className="rounded-lg bg-muted/30 px-3 py-2">
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground">{m.authorName}</span>
                    {m.toName && <> → {m.toName} (private)</>}
                  </span>
                  <span>{formatTime(m.createdAt)}</span>
                </div>
                {m.replyToText && (
                  <p className="mt-1 border-l-2 border-border pl-2 text-xs text-muted-foreground truncate">
                    {m.replyToAuthor}: {m.replyToText}
                  </p>
                )}
                <p className="mt-1 whitespace-pre-wrap break-words">{m.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/dashboard/boards"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="size-4" /> Back to boards
    </Link>
  );
}
