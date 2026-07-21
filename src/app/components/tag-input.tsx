"use client";

import { useState, KeyboardEvent, ClipboardEvent } from "react";
import { X } from "lucide-react";

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function serializeTags(tags: string[]): string {
  return tags.join(", ");
}

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder = "Type a tag and press comma…" }: TagInputProps) {
  const tags = parseTags(value);
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const next = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (next.length === 0) return;

    const merged = [...tags];
    for (const tag of next) {
      if (!merged.some((t) => t.toLowerCase() === tag.toLowerCase())) {
        merged.push(tag);
      }
    }
    onChange(serializeTags(merged));
    setDraft("");
  };

  const remove = (index: number) => {
    onChange(serializeTags(tags.filter((_, i) => i !== index)));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      commit(draft);
      return;
    }
    if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      e.preventDefault();
      remove(tags.length - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (text.includes(",")) {
      e.preventDefault();
      commit(`${draft}${text}`);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 py-2 focus-within:ring-2 focus-within:ring-primary/40 min-h-[42px]">
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(i)}
            className="rounded-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Remove ${tag}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => {
          const next = e.target.value;
          if (next.includes(",")) {
            commit(next);
            return;
          }
          setDraft(next);
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={() => {
          if (draft.trim()) commit(draft);
        }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="min-w-[8rem] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
