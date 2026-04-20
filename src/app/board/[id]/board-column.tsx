"use client";

import { useRef, useState } from "react";
import { useBoardContext } from "@/lib/board-context";
import type { Column, Card } from "@/lib/types";
import { sfxPop, sfxClick, sfxDrop } from "@/lib/sounds";
import {
  Plus,
  ThumbsUp,
  Pencil,
  Trash2,
  X,
  Check,
  Send,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FluentEmoji } from "@/lib/fluent-emoji";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";

const COLOR_MAP: Record<string, { border: string; bg: string; bodyBg: string; title: string; cardBg: string; cardStripe: string; accent: string; countBg: string }> = {
  green: {
    border: "border-green-200 dark:border-green-900",
    bg: "bg-green-50 dark:bg-green-950/40",
    bodyBg: "bg-green-50/40 dark:bg-green-950/10",
    title: "text-green-700 dark:text-green-400",
    cardBg: "bg-white dark:bg-zinc-900",
    cardStripe: "bg-green-400 dark:bg-green-500",
    accent: "bg-green-400 dark:bg-green-600",
    countBg: "bg-green-100 dark:bg-green-900/50",
  },
  red: {
    border: "border-red-200 dark:border-red-900",
    bg: "bg-red-50 dark:bg-red-950/40",
    bodyBg: "bg-red-50/40 dark:bg-red-950/10",
    title: "text-red-700 dark:text-red-400",
    cardBg: "bg-white dark:bg-zinc-900",
    cardStripe: "bg-red-400 dark:bg-red-500",
    accent: "bg-red-400 dark:bg-red-600",
    countBg: "bg-red-100 dark:bg-red-900/50",
  },
  blue: {
    border: "border-blue-200 dark:border-blue-900",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    bodyBg: "bg-blue-50/40 dark:bg-blue-950/10",
    title: "text-blue-700 dark:text-blue-400",
    cardBg: "bg-white dark:bg-zinc-900",
    cardStripe: "bg-blue-400 dark:bg-blue-500",
    accent: "bg-blue-400 dark:bg-blue-600",
    countBg: "bg-blue-100 dark:bg-blue-900/50",
  },
  yellow: {
    border: "border-yellow-200 dark:border-yellow-900",
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    bodyBg: "bg-yellow-50/40 dark:bg-yellow-950/10",
    title: "text-yellow-700 dark:text-yellow-400",
    cardBg: "bg-white dark:bg-zinc-900",
    cardStripe: "bg-yellow-400 dark:bg-yellow-500",
    accent: "bg-yellow-400 dark:bg-yellow-600",
    countBg: "bg-yellow-100 dark:bg-yellow-900/50",
  },
  purple: {
    border: "border-purple-200 dark:border-purple-900",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    bodyBg: "bg-purple-50/40 dark:bg-purple-950/10",
    title: "text-purple-700 dark:text-purple-400",
    cardBg: "bg-white dark:bg-zinc-900",
    cardStripe: "bg-purple-400 dark:bg-purple-500",
    accent: "bg-purple-400 dark:bg-purple-600",
    countBg: "bg-purple-100 dark:bg-purple-900/50",
  },
};

const AVAILABLE_COLORS = [
  { key: "green", label: "Green" },
  { key: "red", label: "Red" },
  { key: "blue", label: "Blue" },
  { key: "yellow", label: "Yellow" },
  { key: "purple", label: "Purple" },
];

export function BoardColumn({ column, index, total }: { column: Column; index: number; total: number }) {
  const { board, participant, addCard, editColumn, deleteColumn, moveCard, moveColumn } = useBoardContext();
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isHost = !!participant && participant.id === board?.hostId;
  const [dragOver, setDragOver] = useState(false);
  const [newCardText, setNewCardText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingColumn, setEditingColumn] = useState(false);
  const [colTitle, setColTitle] = useState(column.title);
  const [colEmoji, setColEmoji] = useState(column.emoji);
  const [colColor, setColColor] = useState(column.color);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postAnonymous, setPostAnonymous] = useState(
    () => board?.participants.find((p) => p.id === participant?.id)?.anonymous ?? false
  );

  const colors = COLOR_MAP[column.color] || COLOR_MAP.blue;
  const isWritePhase = board?.phase === "writing";
  const isDone = board?.phase === "done";

  // Sort cards by votes in voting/discussing/done phase
  const sortedCards =
    board?.phase === "voting" || board?.phase === "discussing" || board?.phase === "done"
      ? [...column.cards].sort((a, b) => b.votes.length - a.votes.length)
      : column.cards;

  const handleAdd = async () => {
    if (!newCardText.trim()) return;
    setSubmitting(true);
    try {
      await addCard(column.id, newCardText.trim(), postAnonymous);
      sfxPop();
      setNewCardText("");
      setShowInput(false);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === "Escape") {
      setShowInput(false);
      setNewCardText("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only count as leave if we're leaving the column itself
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const cardId = e.dataTransfer.getData("text/card-id");
    const fromColumnId = e.dataTransfer.getData("text/column-id");
    if (cardId && fromColumnId && fromColumnId !== column.id) {
      await moveCard(cardId, fromColumnId, column.id);
      sfxDrop();
    }
  };

  return (
    <div
      className={`flex min-w-75 w-full flex-1 flex-col rounded-xl overflow-hidden bg-background border ${colors.border} shadow-md transition-all animate-fade-in-scale relative hover:z-50 ${
        dragOver ? "ring-2 ring-primary/40 shadow-lg shadow-primary/10 scale-[1.01]" : "hover:shadow-lg"
      }`}
      onDragOver={isDone || !isHost ? undefined : handleDragOver}
      onDragLeave={isDone || !isHost ? undefined : handleDragLeave}
      onDrop={isDone || !isHost ? undefined : handleDrop}
    >
      {/* Column header bar */}
      {editingColumn && !isDone && isHost ? (
        <div className={`px-4 pt-3 pb-3 ${colors.bg}`}>
        <div className="space-y-3 rounded-xl border border-border bg-background/80 p-3">
          <div className="flex gap-2">
            {/* Emoji picker button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((v) => !v)}
                className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-xl hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                title="Choose emoji"
              >
                <FluentEmoji emoji={colEmoji} size="1.5rem" />
              </button>
              {showEmojiPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowEmojiPicker(false)}
                  />
                  <div className="absolute left-0 top-full mt-1 z-50">
                    <EmojiPicker
                      onEmojiClick={(data: EmojiClickData) => {
                        setColEmoji(data.emoji);
                        setShowEmojiPicker(false);
                      }}
                      theme={Theme.AUTO}
                      lazyLoadEmojis
                      height={380}
                      width={300}
                    />
                  </div>
                </>
              )}
            </div>
            <input
              value={colTitle}
              onChange={(e) => setColTitle(e.target.value)}
              maxLength={60}
              autoFocus
              className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Column title"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  editColumn(column.id, { title: colTitle, emoji: colEmoji, color: colColor });
                  setEditingColumn(false);
                }
                if (e.key === "Escape") setEditingColumn(false);
              }}
            />
          </div>
          <div className="flex gap-2">
            {AVAILABLE_COLORS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setColColor(c.key)}
                className={`size-5 rounded-full border-2 transition-all ${
                  colColor === c.key ? "border-foreground scale-110 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                }`}
                style={{
                  backgroundColor:
                    c.key === "green" ? "#86efac" :
                    c.key === "red" ? "#fca5a5" :
                    c.key === "blue" ? "#93c5fd" :
                    c.key === "yellow" ? "#fde68a" :
                    "#c4b5fd",
                }}
                title={c.label}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                editColumn(column.id, { title: colTitle, emoji: colEmoji, color: colColor });
                setEditingColumn(false);
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Check className="size-3" /> Save
            </button>
            <button
              onClick={() => {
                setColTitle(column.title);
                setColEmoji(column.emoji);
                setColColor(column.color);
                setShowEmojiPicker(false);
                setEditingColumn(false);
              }}
            >
              <X className="size-3" /> Cancel
            </button>
          </div>
        </div>
        </div>
      ) : (
        <div className={`group/header flex items-center justify-between px-4 py-3.5 ${colors.bg}`}>
          <h2 className={`flex items-center gap-2 text-sm font-bold ${colors.title}`}>
            <FluentEmoji emoji={column.emoji} size="1.5rem" />
            <span className="tracking-tight">{column.title}</span>
          </h2>
          <div className="flex items-center gap-1.5">
            {!isDone && isHost && (
            <div className="flex gap-0.5 opacity-0 group-hover/header:opacity-100 transition-opacity">
              {!isFirst && (
                <button
                  onClick={() => moveColumn(column.id, "left")}
                  className="flex size-6 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                  title="Move column left"
                >
                  <ChevronLeft className="size-3 text-muted-foreground" />
                </button>
              )}
              {!isLast && (
                <button
                  onClick={() => moveColumn(column.id, "right")}
                  className="flex size-6 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                  title="Move column right"
                >
                  <ChevronRight className="size-3 text-muted-foreground" />
                </button>
              )}
              <button
                onClick={() => {
                  setColTitle(column.title);
                  setColEmoji(column.emoji);
                  setColColor(column.color);
                  setEditingColumn(true);
                }}
                className="flex size-6 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                title="Edit column"
              >
                <Pencil className="size-3 text-muted-foreground" />
              </button>
              {column.cards.length > 0 ? (
                <span
                  className="flex size-6 items-center justify-center rounded-lg opacity-25 cursor-not-allowed"
                  title="Remove all cards first"
                >
                  <Trash2 className="size-3 text-muted-foreground" />
                </span>
              ) : showDeleteConfirm ? (
                <span className="flex items-center gap-1 text-xs animate-pop-in">
                  <button
                    onClick={() => {
                      deleteColumn(column.id);
                      setShowDeleteConfirm(false);
                    }}
                    className="rounded-lg bg-red-500 px-2 py-1 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex size-6 items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Delete column"
                >
                  <Trash2 className="size-3 text-muted-foreground hover:text-red-400" />
                </button>
              )}
            </div>
            )}
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums ${colors.countBg} ${colors.title}`}>
              {column.cards.length}
            </span>
          </div>
        </div>
      )}

      <div className={`flex flex-1 flex-col p-3 ${colors.bodyBg}`}>
      {/* Cards */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-visible pb-2">
        {sortedCards.length === 0 && !isWritePhase && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground/50">
            <FluentEmoji emoji={column.emoji} size="2.5rem" className="opacity-40" />
            <p className="text-xs">No cards yet</p>
          </div>
        )}
        {sortedCards.map((card, idx) => (
          <CardItem
            key={card.id}
            card={card}
            columnId={column.id}
            colors={colors}
            animDelay={idx * 50}
          />
        ))}
      </div>

      {/* Add card */}
      {isWritePhase && (
        <div className="mt-3">
          {showInput ? (
            <div className="space-y-2.5 animate-expand-down">
              <textarea
                value={newCardText}
                onChange={(e) => setNewCardText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your thought..."
                maxLength={500}
                autoFocus
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdd}
                  disabled={submitting || !newCardText.trim()}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="size-3" />
                  Add
                </button>
                <button
                  onClick={() => setPostAnonymous((v) => !v)}
                  type="button"
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    postAnonymous
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                  title={postAnonymous ? "Posting anonymously — click to show your name" : "Click to post anonymously"}
                >
                  {postAnonymous ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                  {postAnonymous ? "Anonymous" : "Visible"}
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setNewCardText("");
                  }}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border/60 bg-background/40 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <Plus className="size-4" />
              Add card
            </button>
          )}
        </div>
      )}
      </div>{/* end inner wrapper */}
    </div>
  );
}

const REACTION_EMOJIS = ["😢", "😄", "😮", "😡", "😜"];

function CardItem({
  card,
  columnId,
  colors,
  animDelay = 0,
}: {
  card: Card;
  columnId: string;
  colors: { cardBg: string; cardStripe: string };
  animDelay?: number;
}) {
  const { board, participant, vote, unvote, editCard, deleteCard, reactToCard } =
    useBoardContext();
  const [dragging, setDragging] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(card.text);
  const [voteAnim, setVoteAnim] = useState(false);
  const voteAnimTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const myVotes = card.votes.filter((v) => v === participant?.id).length;
  const reactions = card.reactions ?? {};
  const myReactions = Object.entries(reactions).filter(([, ids]) => ids.includes(participant?.id ?? "")).map(([e]) => e);
  const activeReactions = Object.entries(reactions).filter(([, ids]) => ids.length > 0);
  const isVotingPhase = board?.phase === "voting";
  const isDone = board?.phase === "done";
  const isWritePhase = board?.phase === "writing";
  const hasVoted = card.votes.includes(participant?.id ?? "");
  const canVote = isVotingPhase && participant;
  const isMyCard = card.authorId === participant?.id;
  const isHost = !!participant && participant.id === board?.hostId;
  const canManageCard = !isDone && (isHost || (isMyCard && isWritePhase));

  const handleSave = async () => {
    if (!editText.trim()) return;
    try {
      await editCard(columnId, card.id, editText.trim());
      setEditing(false);
    } catch {
      // ignore
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCard(columnId, card.id);
    } catch {
      // ignore
    }
  };

  const handleVote = async () => {
    if (!canVote || hasVoted) return;
    try {
      await vote(columnId, card.id);
      sfxPop();
      setVoteAnim(true);
      if (voteAnimTimeout.current) clearTimeout(voteAnimTimeout.current);
      voteAnimTimeout.current = setTimeout(() => setVoteAnim(false), 400);
    } catch {
      // ignore
    }
  };

  const handleUnvote = async () => {
    if (!canVote || myVotes === 0) return;
    try {
      await unvote(columnId, card.id);
      sfxClick();
    } catch {
      // ignore
    }
  };

  if (editing) {
    return (
      <div className={`rounded-xl ${colors.cardBg} p-4 shadow-sm border border-border/40`}>
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          maxLength={500}
          rows={2}
          autoFocus
          className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
            if (e.key === "Escape") setEditing(false);
          }}
        />
        <div className="mt-2.5 flex gap-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Check className="size-3" /> Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-3" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/card-id", card.id);
    e.dataTransfer.setData("text/column-id", columnId);
    e.dataTransfer.effectAllowed = "move";
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const author = board?.participants.find((p) => p.id === card.authorId);
  const showAuthor = author && !card.anonymous;

  return (
    <div
      id={`card-${card.id}`}
      className={`group relative flex rounded-xl ${colors.cardBg} shadow-sm transition-all ${canManageCard ? "cursor-grab active:cursor-grabbing" : "cursor-default"} hover:shadow-md hover:-translate-y-0.5 border border-border/40 hover:border-border/80 animate-fade-in-up overflow-visible ${
        dragging ? "opacity-40 scale-95" : ""
      }`}
      style={{ animationDelay: `${animDelay}ms` }}
      draggable={canManageCard}
      onDragStart={canManageCard ? handleDragStart : undefined}
      onDragEnd={canManageCard ? handleDragEnd : undefined}
    >

      <div className="flex-1 px-3 pt-3 pb-4 min-w-0">
      {/* Floating reaction bar — appears on card hover */}
      {participant && !isDone && (
        <div className="pointer-events-none absolute -bottom-5 inset-x-0 flex justify-center z-20 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out group-hover:pointer-events-auto">
          <div className="flex gap-0.5 rounded-full bg-white dark:bg-zinc-800 border border-border/60 shadow-2xl px-2 py-1.5">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => { e.stopPropagation(); reactToCard(columnId, card.id, emoji); }}
                className={`flex size-8 items-center justify-center rounded-full transition-all duration-150 hover:scale-125 hover:-translate-y-1 active:scale-95 ${
                  myReactions.includes(emoji) ? "scale-110 -translate-y-1 drop-shadow-sm" : ""
                }`}
                title={emoji}
              >
                <FluentEmoji emoji={emoji} size="1.25rem" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Card text */}
      <p className="text-sm leading-relaxed text-foreground font-[450]">{card.text}</p>

      {/* Reactions display */}
      {activeReactions.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {activeReactions.map(([emoji, ids]) => (
            <span
              key={emoji}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
                !isDone && myReactions.includes(emoji)
                  ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                  : "border-border/60 bg-muted/40 text-foreground"
              } ${!isDone ? "cursor-pointer transition-all hover:scale-105" : ""}`}
              onClick={!isDone && participant ? () => reactToCard(columnId, card.id, emoji) : undefined}
            >
              <FluentEmoji emoji={emoji} size="1.25rem" />
              <span>{ids.length}</span>
            </span>
          ))}
        </div>
      )}

      {/* Author + vote count row */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground/70 italic">
          {showAuthor ? author.name : "Anonymous"}
        </span>

        {/* Vote count (passive display) */}
        {!canVote && card.votes.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            <ThumbsUp className="size-2.5" />
            {card.votes.length}
          </span>
        )}
      </div>

      {/* Actions — edit/delete, shown on hover for own cards or by host */}
      {canManageCard && (
        <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setEditText(card.text); setEditing(true); }}
            className="flex items-center justify-center size-6 rounded-lg bg-background/90 border border-border/60 hover:border-primary/40 hover:text-primary transition-colors shadow-sm"
            title="Edit"
          >
            <Pencil className="size-3 text-muted-foreground" />
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center size-6 rounded-lg bg-background/90 border border-border/60 hover:border-red-400/50 hover:text-red-500 transition-colors shadow-sm"
            title="Delete"
          >
            <Trash2 className="size-3 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Vote controls — only in voting phase */}
      {canVote && (
        <div className="mt-3 flex items-center gap-2">
          {hasVoted ? (
            <button
              onClick={handleUnvote}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/50 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-all"
              title="Remove my vote"
            >
              <ThumbsUp className="size-3 fill-primary" />
              {card.votes.length}
            </button>
          ) : (
            <button
              onClick={handleVote}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                voteAnim
                  ? "animate-bounce-vote border-primary/60 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <ThumbsUp className="size-3" />
              {card.votes.length}
            </button>
          )}
        </div>
      )}
      </div>{/* end card body */}
    </div>
  );
}
