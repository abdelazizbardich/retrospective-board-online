"use client";

import { useState } from "react";
import { useBoardContext } from "@/lib/board-context";
import { LayoutGrid, UserCircle2, Link2 } from "lucide-react";
import { AdSlot } from "@/app/components/ad-slot";

export function JoinForm({ boardName }: { boardName: string }) {
  const { joinBoard } = useBoardContext();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await joinBoard(name.trim());
    } catch {
      setError("Failed to join. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 overflow-hidden">
      {/* Gradient blobs matching the landing page hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-125 w-175 -translate-x-1/2 rounded-full bg-linear-to-tr from-indigo-400/25 to-purple-400/15 blur-3xl"
      />

      {/* Left sidebar ad */}
      <aside className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2">
        <AdSlot format="skyscraper" side="left" dismissible />
      </aside>

      {/* Right sidebar ad */}
      <aside className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2">
        <AdSlot format="skyscraper" side="right" dismissible />
      </aside>

      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <LayoutGrid className="size-6 text-primary" />
          <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SprintsPlans</span>
        </div>

        <div className="rounded-xl border border-border bg-background/80 backdrop-blur-sm p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
              <UserCircle2 className="size-7 text-indigo-500" />
            </div>
            <h1 className="text-xl font-bold">Join Retrospective</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;re joining <span className="font-semibold text-foreground">{boardName}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="participant-name" className="block text-sm font-medium mb-1.5">
                Your name
              </label>
              <input
                id="participant-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah"
                maxLength={50}
                autoFocus
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Board →"}
            </button>
          </form>

          <div className="mt-4 flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
            <Link2 className="size-3" />
            <span>You were invited via a private link</span>
          </div>
        </div>
      </div>
    </div>
  );
}
