"use client";

import { useState } from "react";
import type { Column } from "@/lib/types";
import { useBoardContext } from "@/lib/board-context";
import { Pencil, Trash2 } from "lucide-react";

interface StarfishSectionLabelProps {
  column: Column;
  left: string;
  top: string;
  isWritePhase: boolean;
  onAddNote: () => void;
  onEdit: () => void;
}

export function StarfishSectionLabel({
  column,
  left,
  top,
  isWritePhase,
  onAddNote,
  onEdit,
}: StarfishSectionLabelProps) {
  const { board, participant, deleteColumn } = useBoardContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isHost = !!participant && participant.id === board?.hostId;
  const isDone = board?.phase === "done";
  const canManage = isHost && !isDone;

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
      className="pointer-events-auto absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
    >
      <div className="group relative flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={() => isWritePhase && onAddNote()}
          disabled={!isWritePhase}
          className={`whitespace-nowrap text-sm font-extrabold uppercase tracking-wide text-foreground transition-opacity ${
            isWritePhase ? "cursor-pointer hover:opacity-70" : "cursor-default"
          }`}
        >
          {column.title}
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
            {column.cards.length > 0 ? (
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
