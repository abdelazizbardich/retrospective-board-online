"use client";

import { useState } from "react";
import { useBoardContext } from "@/lib/board-context";
import { Plus, X, Check } from "lucide-react";

const AVAILABLE_COLORS = [
  { key: "green", label: "Green", hex: "#86efac" },
  { key: "red", label: "Red", hex: "#fca5a5" },
  { key: "blue", label: "Blue", hex: "#93c5fd" },
  { key: "yellow", label: "Yellow", hex: "#fde68a" },
  { key: "purple", label: "Purple", hex: "#c4b5fd" },
];

export function AddColumnButton() {
  const { addColumn } = useBoardContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("📝");
  const [color, setColor] = useState("blue");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await addColumn(title.trim(), color, emoji);
      setTitle("");
      setEmoji("📝");
      setColor("blue");
      setOpen(false);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex min-w-64 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 p-6 text-muted-foreground/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group"
      >
        <span className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-current transition-all group-hover:scale-110">
          <Plus className="size-5" />
        </span>
        <span className="text-sm font-medium">Add column</span>
      </button>
    );
  }

  return (
    <div className="flex min-w-[300px] flex-col rounded-xl border-2 border-primary/30 bg-muted/30 p-4 animate-pop-in">
      <h3 className="mb-3 text-sm font-semibold">New column</h3>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={4}
            className="w-12 rounded-lg border border-border bg-background px-2 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="📝"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            autoFocus
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Column title"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
              if (e.key === "Escape") setOpen(false);
            }}
          />
        </div>
        <div className="flex gap-1.5">
          {AVAILABLE_COLORS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setColor(c.key)}
              className={`size-7 rounded-full border-2 transition-all ${
                color === c.key ? "border-foreground scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={submitting || !title.trim()}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Check className="size-3" /> Add
          </button>
          <button
            onClick={() => {
              setOpen(false);
              setTitle("");
              setEmoji("📝");
              setColor("blue");
            }}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-3" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
