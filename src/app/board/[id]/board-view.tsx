"use client";

import { useState } from "react";
import { useBoardContext } from "@/lib/board-context";
import { JoinForm } from "./join-form";
import { BoardHeader } from "./board-header";
import { BoardColumn } from "./board-column";
import { AddColumnButton } from "./add-column-button";
import { ChatDrawer } from "./chat-drawer";
import { FluentEmoji } from "@/lib/fluent-emoji";
import { useUser } from "@/lib/user-context";

export function BoardView() {
  const { board, participant, loading, error, kicked, roomClosed, newJoinName, leftName, reopenSession } = useBoardContext();
  const { user } = useUser();
  const [activeColIdx, setActiveColIdx] = useState(0);
  const isDone = board?.phase === "done";
  const isHost = participant?.id === board?.hostId;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Board not found</h2>
          <p className="mt-2 text-muted-foreground">
            {error || "This board doesn't exist or has been deleted."}
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  if (kicked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 text-5xl">🚫</div>
          <h2 className="text-2xl font-bold">You&apos;ve been removed</h2>
          <p className="mt-2 text-muted-foreground">
            The host has removed you from this retrospective board.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  if (roomClosed) {
    const isOwner = !!(user?.id && board?.ownerId && user.id === board.ownerId);
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 text-5xl">🔒</div>
          <h2 className="text-2xl font-bold">Session ended</h2>
          <p className="mt-2 text-muted-foreground">
            The host has closed the retrospective session.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            {isOwner && (
              <button
                onClick={reopenSession}
                className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Reopen Session
              </button>
            )}
            <a
              href="/"
              className="inline-flex rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:bg-accent transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!participant) {
    return <JoinForm boardName={board.name} />;
  }

  const safeIdx = Math.min(activeColIdx, board.columns.length - 1);

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      <BoardHeader />

      {/* Join toast */}
      {newJoinName && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-lg">
            <span className="flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-sm">
              👋
            </span>
            <div>
              <p className="text-sm font-semibold">{newJoinName} joined</p>
              <p className="text-xs text-muted-foreground">New participant</p>
            </div>
          </div>
        </div>
      )}

      {/* Left toast */}
      {leftName && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-lg">
            <span className="flex size-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40 text-sm">
              🚪
            </span>
            <div>
              <p className="text-sm font-semibold">{leftName} left</p>
              <p className="text-xs text-muted-foreground">Left the session</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile column tab bar */}
      <div className="md:hidden flex overflow-x-auto gap-2 px-3 pt-3 pb-2 border-b border-border/40 bg-background/95 backdrop-blur-sm shrink-0">
        {board.columns.map((col, idx) => (
          <button
            key={col.id}
            onClick={() => setActiveColIdx(idx)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              idx === safeIdx
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <FluentEmoji emoji={col.emoji} size="1rem" />
            <span>{col.title}</span>
            <span className="ml-0.5 rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[10px] font-bold">{col.cards.length}</span>
          </button>
        ))}
      </div>

      {/* Mobile: single column view */}
      <main className="md:hidden flex flex-1 flex-col p-3">
        {board.columns[safeIdx] && (
          <BoardColumn column={board.columns[safeIdx]} index={safeIdx} total={board.columns.length} />
        )}
      </main>

      {/* Desktop: columns */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <main className="flex flex-1 gap-4 overflow-x-auto p-4">
          {board.columns.map((column, idx) => (
            <div
              key={column.id}
              className="animate-slide-in-right flex min-w-0 flex-1 relative hover:z-50"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <BoardColumn column={column} index={idx} total={board.columns.length} />
            </div>
          ))}
          {!isDone && isHost && (
          <div className="animate-fade-in-scale" style={{ animationDelay: `${board.columns.length * 80}ms` }}>
            <AddColumnButton />
          </div>
          )}
        </main>
      </div>

      <ChatDrawer />
    </div>
  );
}
