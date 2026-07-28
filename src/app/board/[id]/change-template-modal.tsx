"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBoardContext } from "@/lib/board-context";
import { inferTemplateId } from "@/lib/apply-board-template";
import { BOARD_TEMPLATES } from "@/lib/types";
import { BoardTemplatePicker } from "@/components/board-template-picker";
import { LayoutTemplate, X, Columns3, LayoutGrid } from "lucide-react";

type Step = "pick" | "confirm";

export function ChangeTemplateModal() {
  const { board, participant, changeTemplate } = useBoardContext();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("pick");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!board || !participant) return null;

  const currentTemplateId = inferTemplateId(board);
  const selectedTemplate = BOARD_TEMPLATES.find((t) => t.id === selectedId);

  const resetAndClose = () => {
    setOpen(false);
    setStep("pick");
    setError(null);
  };

  const handleOpen = () => {
    setSelectedId(currentTemplateId);
    setStep("pick");
    setError(null);
    setOpen(true);
  };

  const handleContinue = () => {
    if (!selectedId || selectedId === currentTemplateId) {
      resetAndClose();
      return;
    }
    setStep("confirm");
    setError(null);
  };

  const handleApply = async (preserveSections: boolean) => {
    if (!selectedId) return;
    setSaving(true);
    setError(null);
    try {
      await changeTemplate(selectedId, preserveSections);
      resetAndClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change template");
    } finally {
      setSaving(false);
    }
  };

  const modal = open ? (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={() => !saving && resetAndClose()}
    >
      <div
        className="bg-background rounded-2xl border border-border shadow-xl w-full max-w-2xl max-h-[min(90vh,720px)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-template-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 shrink-0">
          <div>
            <h2 id="change-template-title" className="text-base font-semibold">
              {step === "pick" ? "Change template" : "Keep your sections?"}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {step === "pick"
                ? "Choose a new board template."
                : selectedTemplate
                  ? `Switching to ${selectedTemplate.name}.`
                  : "Choose what happens to your current sections."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => !saving && resetAndClose()}
            className="rounded-lg p-1.5 hover:bg-muted transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 min-h-0 flex-1">
          {step === "pick" ? (
            <BoardTemplatePicker selectedId={selectedId} onSelect={setSelectedId} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleApply(true)}
                className="rounded-xl border-2 border-border p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
              >
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Columns3 className="size-5" />
                </div>
                <h3 className="text-sm font-semibold">Keep my sections</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Keep your current section names, colors, and cards. Only the board layout changes
                  (e.g. columns vs starfish).
                </p>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleApply(false)}
                className="rounded-xl border-2 border-border p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
              >
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LayoutGrid className="size-5" />
                </div>
                <h3 className="text-sm font-semibold">Use template sections</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Replace sections with the template defaults. Cards are kept by position; extras move
                  to the last section.
                </p>
              </button>
            </div>
          )}
        </div>

        {error && <p className="px-5 pb-2 text-sm text-red-500 shrink-0">{error}</p>}

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4 shrink-0 bg-background">
          {step === "confirm" ? (
            <button
              type="button"
              onClick={() => !saving && setStep("pick")}
              disabled={saving}
              className="mr-auto rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              Back
            </button>
          ) : null}
          <button
            type="button"
            onClick={resetAndClose}
            disabled={saving}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          {step === "pick" ? (
            <button
              type="button"
              onClick={handleContinue}
              disabled={saving || !selectedId || selectedId === currentTemplateId}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Continue
            </button>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 rounded-xl border border-border bg-background/60 px-2.5 py-1.5 sm:px-3 text-sm font-medium hover:bg-muted transition-colors"
        title="Change board template"
      >
        <LayoutTemplate className="size-3.5" />
        <span className="hidden sm:inline">Template</span>
      </button>

      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
