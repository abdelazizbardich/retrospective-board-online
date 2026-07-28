"use client";

import { useState } from "react";
import type { Column } from "@/lib/types";
import { useBoardContext } from "@/lib/board-context";
import { Eye, EyeOff, Send, X } from "lucide-react";
import { sfxPop } from "@/lib/sounds";

interface StarfishAddModalProps {
  column: Column;
  left: string;
  top: string;
  onClose: () => void;
}

export function StarfishAddModal({ column, left, top, onClose }: StarfishAddModalProps) {
  const { board, participant, addCard } = useBoardContext();
  const [newCardText, setNewCardText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [postAnonymous, setPostAnonymous] = useState(
    () => board?.participants.find((p) => p.id === participant?.id)?.anonymous ?? false
  );

  const handleAdd = async () => {
    if (!newCardText.trim()) return;
    setSubmitting(true);
    try {
      await addCard(column.id, newCardText.trim(), postAnonymous);
      sfxPop();
      onClose();
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
      onClose();
    }
  };

  return (
    <>
      <button
        type="button"
        className="absolute inset-0 z-40"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="pointer-events-auto absolute z-50 w-56 -translate-x-1/2 -translate-y-1/2 sm:w-64"
        style={{ left, top }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-lg border-2 border-[#1e3a5f]/40 bg-background p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-extrabold uppercase tracking-wide text-foreground">
              {column.title}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-0.5 text-muted-foreground hover:bg-muted"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <textarea
            value={newCardText}
            onChange={(e) => setNewCardText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your thought..."
            maxLength={500}
            autoFocus
            rows={4}
            className="w-full resize-none rounded-md border border-primary/30 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={submitting || !newCardText.trim()}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              <Send className="size-3.5" />
              Add note
            </button>
            <button
              type="button"
              onClick={() => setPostAnonymous((v) => !v)}
              className={`inline-flex size-9 shrink-0 items-center justify-center rounded-md border ${
                postAnonymous
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              }`}
              title={postAnonymous ? "Posting anonymously" : "Post with your name"}
            >
              {postAnonymous ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
