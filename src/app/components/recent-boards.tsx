"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ExternalLink } from "lucide-react";

interface RecentEntry {
  id: string;
  name: string;
  visitedAt: number;
}

export function RecentBoards() {
  const [recent] = useState<RecentEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("retro-recent-boards");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  if (recent.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <h2 className="text-2xl font-bold text-center mb-2">Recently Visited</h2>
      <p className="text-center text-muted-foreground text-sm mb-8">
        Pick up where you left off
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recent.slice(0, 9).map((b) => (
          <Link
            key={b.id}
            href={`/board/${b.id}`}
            className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{b.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Clock className="size-3" />
                {new Date(b.visitedAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
              </p>
            </div>
            <ExternalLink className="size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </section>
  );
}
