"use client";

import { useState } from "react";
import type { Column } from "@/lib/types";
import { useBoardContext } from "@/lib/board-context";
import { Pencil, Trash2 } from "lucide-react";

interface SailboatSectionLabelProps {
  column: Column;
  left: string;
  top: string;
  subtitle: string;
  isWritePhase: boolean;
  onAddNote: () => void;
  onEdit: () => void;
}

export function SailboatSectionLabel({
  column,
  left,
  top,
  subtitle,
  isWritePhase,
  onAddNote,
  onEdit,
}: SailboatSectionLabelProps) {
  const { board, participant, deleteColumn } = useBoardContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isHost = !!participant && participant.id === board?.hostId;
  const isDone = board?.phase === "done";
  const canManage = isHost && !isDone;

  const columnData = board?.columns.find((c) => c.id === column.id) ?? column;
  const noteCount = columnData.cards.length;

  const handleDelete = async () => {
    try {
      await deleteColumn(column.id);
      setShowDeleteConfirm(false);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="pointer-events-auto absolute z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
    >
      <div className="group relative flex max-w-[9rem] flex-col items-center gap-0.5 sm:max-w-[11rem]">
        <button
          type="button"
          onClick={() => isWritePhase && onAddNote()}
          disabled={!isWritePhase}
          className={`flex flex-col items-center gap-0.5 rounded-lg border border-white/60 bg-white/85 px-2.5 py-1.5 shadow-md backdrop-blur-sm transition-all dark:border-white/20 dark:bg-zinc-900/85 ${
            isWritePhase ? "cursor-pointer hover:scale-105 hover:shadow-lg" : "cursor-default"
          }`}
        >
          <span className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-wide text-foreground sm:text-xs">
            {column.title}
          </span>
          <span className="text-center text-[9px] leading-tight text-muted-foreground sm:text-[10px]">
            {subtitle}
          </span>
          <span className="mt-0.5 rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold text-primary">
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </span>
        </button>

        {canManage && (
          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex size-6 items-center justify-center rounded-md bg-background/90 shadow-sm hover:bg-muted"
              title="Rename section"
            >
              <Pencil className="size-3 text-muted-foreground" />
            </button>
            {columnData.cards.length > 0 ? (
              <span
                className="flex size-6 items-center justify-center rounded-md bg-background/90 opacity-40"
                title="Remove all cards first"
              >
                <Trash2 className="size-3 text-muted-foreground" />
              </span>
            ) : showDeleteConfirm ? (
              <span className="flex items-center gap-1 rounded-md bg-background/95 px-1.5 py-0.5 text-[10px] shadow-sm animate-pop-in">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="font-semibold text-red-600 hover:underline"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-muted-foreground hover:underline"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="flex size-6 items-center justify-center rounded-md bg-background/90 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30"
                title="Remove section"
              >
                <Trash2 className="size-3 text-muted-foreground" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
