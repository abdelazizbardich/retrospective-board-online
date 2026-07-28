"use client";

import { useState } from "react";
import type { Column } from "@/lib/types";
import { CardItem } from "./board-column";
import { SAILBOAT_NOTE_STYLES } from "./sailboat-geometry";
import { sfxDrop } from "@/lib/sounds";
import { useBoardContext } from "@/lib/board-context";

function cardRotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return (hash % 11) - 5;
}

interface SailboatSectionProps {
  column: Column;
  region: {
    left: number;
    top: number;
    width: number;
    height: number;
    notesLeft: number;
    notesTop: number;
  };
  onSectionClick?: () => void;
}

export function SailboatSection({ column, region, onSectionClick }: SailboatSectionProps) {
  const { board, participant, moveCard } = useBoardContext();
  const [dragOver, setDragOver] = useState(false);

  const isHost = !!participant && participant.id === board?.hostId;
  const isGroupingPhase = board?.phase === "grouping";
  const isDone = board?.phase === "done";
  const canAcceptDrop = !isDone && !!participant && (isHost || isGroupingPhase);

  const columnData = board?.columns.find((c) => c.id === column.id) ?? column;
  const sortedCards =
    board?.phase === "voting" || board?.phase === "discussing" || board?.phase === "done"
      ? [...columnData.cards].sort((a, b) => b.votes.length - a.votes.length)
      : columnData.cards;

  const noteStyle = SAILBOAT_NOTE_STYLES[column.color] ?? SAILBOAT_NOTE_STYLES.blue;

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
      className={`absolute z-10 transition-colors ${dragOver ? "z-30" : ""} ${onSectionClick ? "cursor-pointer" : ""}`}
      style={{
        left: `${region.left}%`,
        top: `${region.top}%`,
        width: `${region.width}%`,
        height: `${region.height}%`,
      }}
      onClick={onSectionClick}
      onDragOver={canAcceptDrop ? handleDragOver : undefined}
      onDragLeave={canAcceptDrop ? handleDragLeave : undefined}
      onDrop={canAcceptDrop ? handleDrop : undefined}
    >
      <div
        className="pointer-events-none absolute z-20 flex max-w-[90%] -translate-x-1/2 -translate-y-1/2 flex-wrap content-start justify-center gap-2"
        style={{ left: `${region.notesLeft}%`, top: `${region.notesTop}%` }}
      >
        {sortedCards.map((card, idx) => (
          <div
            key={card.id}
            className="pointer-events-auto w-28 shrink-0 animate-fade-in-up sm:w-32"
            style={{
              transform: `rotate(${cardRotation(card.id)}deg)`,
              animationDelay: `${idx * 40}ms`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`rounded-sm border shadow-sm ${noteStyle.cardBg} ${noteStyle.border}`}
            >
              <CardItem
                card={card}
                columnId={column.id}
                colors={{
                  cardBg: "bg-transparent",
                  cardStripe: noteStyle.stripe,
                }}
                animDelay={0}
              />
            </div>
          </div>
        ))}

        {sortedCards.length === 0 && board?.phase !== "writing" && (
          <div className="flex w-28 shrink-0 items-center justify-center rounded-sm border border-dashed border-white/50 bg-white/20 py-5 text-center text-[10px] text-foreground/70 backdrop-blur-sm sm:w-32">
            No notes yet
          </div>
        )}
      </div>

      {dragOver && (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-primary/10 ring-2 ring-inset ring-primary/40" />
      )}
    </div>
  );
}
