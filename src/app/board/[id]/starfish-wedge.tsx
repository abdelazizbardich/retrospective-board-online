"use client";

import type { Column } from "@/lib/types";
import { CardItem, getColumnColors } from "./board-column";
import { polarToPercent, getWedgeCenters, wedgeClipPath } from "./starfish-geometry";
import { sfxDrop } from "@/lib/sounds";
import { useBoardContext } from "@/lib/board-context";
import { useState } from "react";

function cardRotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return (hash % 13) - 6;
}

interface StarfishWedgeProps {
  column: Column;
  index: number;
  total: number;
  onSectionClick?: () => void;
}

export function StarfishWedge({ column, index, total, onSectionClick }: StarfishWedgeProps) {
  const { board, participant, moveCard } = useBoardContext();
  const [dragOver, setDragOver] = useState(false);

  const isHost = !!participant && participant.id === board?.hostId;
  const isGroupingPhase = board?.phase === "grouping";
  const isDone = board?.phase === "done";
  const canAcceptDrop = !isDone && !!participant && (isHost || isGroupingPhase);
  const colors = getColumnColors(column.color);

  const columnData = board?.columns.find((c) => c.id === column.id) ?? column;
  const sortedCards =
    board?.phase === "voting" || board?.phase === "discussing" || board?.phase === "done"
      ? [...columnData.cards].sort((a, b) => b.votes.length - a.votes.length)
      : columnData.cards;

  const armPos = polarToPercent(getWedgeCenters(total)[index] ?? 0, 42);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
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
      className={`absolute inset-0 transition-colors ${dragOver ? "z-30" : "z-10"} ${onSectionClick ? "cursor-pointer" : ""}`}
      style={{ clipPath: wedgeClipPath(index, total) }}
      onClick={onSectionClick}
      onDragOver={canAcceptDrop ? handleDragOver : undefined}
      onDragLeave={canAcceptDrop ? handleDragLeave : undefined}
      onDrop={canAcceptDrop ? handleDrop : undefined}
    >
      <div
        className="pointer-events-none absolute z-20 flex max-w-[38%] -translate-x-1/2 -translate-y-1/2 flex-wrap content-start justify-center gap-2"
        style={{ left: armPos.left, top: armPos.top }}
      >
        {sortedCards.map((card, idx) => (
          <div
            key={card.id}
            className="pointer-events-auto w-32 shrink-0 animate-fade-in-up sm:w-36"
            style={{
              transform: `rotate(${cardRotation(card.id)}deg)`,
              animationDelay: `${idx * 40}ms`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-sm border border-zinc-300/80 bg-zinc-100 shadow-sm dark:border-zinc-600 dark:bg-zinc-800/90">
              <CardItem
                card={card}
                columnId={column.id}
                colors={{
                  cardBg: "bg-transparent",
                  cardStripe: colors.cardStripe,
                }}
                animDelay={0}
              />
            </div>
          </div>
        ))}

        {sortedCards.length === 0 && board?.phase !== "writing" && (
          <div className="flex w-32 shrink-0 items-center justify-center rounded-sm border border-dashed border-zinc-300/60 bg-zinc-50/50 py-6 text-center text-[10px] text-muted-foreground dark:border-zinc-600 dark:bg-zinc-800/30 sm:w-36">
            No notes yet
          </div>
        )}
      </div>

      {dragOver && (
        <div className="pointer-events-none absolute inset-0 bg-primary/5 ring-2 ring-inset ring-primary/30" />
      )}
    </div>
  );
}
