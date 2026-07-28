"use client";

import { useState } from "react";
import type { Column } from "@/lib/types";
import { useBoardContext } from "@/lib/board-context";
import { Check, X } from "lucide-react";

const AVAILABLE_COLORS = [
  { key: "green", label: "Green", hex: "#269353" },
  { key: "red", label: "Red", hex: "#fca5a5" },
  { key: "blue", label: "Blue", hex: "#2b48a9" },
  { key: "yellow", label: "Yellow", hex: "#d5a615" },
  { key: "purple", label: "Purple", hex: "#a541b2" },
];

interface StarfishSectionFormModalProps {
  mode: "add" | "edit";
  column?: Column;
  left: string;
  top: string;
  onClose: () => void;
}

export function StarfishSectionFormModal({
  mode,
  column,
  left,
  top,
  onClose,
}: StarfishSectionFormModalProps) {
  const { addColumn, editColumn } = useBoardContext();
  const [title, setTitle] = useState(column?.title ?? "");
  const [emoji, setEmoji] = useState(column?.emoji ?? "📝");
  const [color, setColor] = useState(column?.color ?? "blue");
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      if (mode === "add") {
        await addColumn(title.trim(), color, emoji);
      } else if (column) {
        await editColumn(column.id, { title: title.trim(), color, emoji });
      }
      onClose();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") onClose();
  };

  return (
    <>
      <button type="button" className="absolute inset-0 z-40" onClick={onClose} aria-label="Close" />
      <div
        className="pointer-events-auto absolute z-50 w-56 -translate-x-1/2 -translate-y-1/2 sm:w-64"
        style={{ left, top }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-lg border-2 border-[#1e3a5f]/40 bg-background p-3 shadow-xl">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-extrabold uppercase tracking-wide text-foreground">
              {mode === "add" ? "New section" : "Rename section"}
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
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={4}
                className="w-12 rounded-lg border border-border bg-background px-2 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="📝"
              />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
                autoFocus
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Section name"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex gap-1.5">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColor(c.key)}
                  className={`size-6 rounded-full border-2 transition-all ${
                    color === c.key ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting || !title.trim()}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              <Check className="size-3.5" />
              {mode === "add" ? "Add section" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
