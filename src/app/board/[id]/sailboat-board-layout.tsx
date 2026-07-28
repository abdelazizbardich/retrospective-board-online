"use client";

import { useState } from "react";
import type { Column } from "@/lib/types";
import { useBoardContext } from "@/lib/board-context";
import { SailboatScene } from "./sailboat-scene";
import { SailboatSection } from "./sailboat-section";
import { SailboatSectionLabel } from "./sailboat-section-label";
import { SAILBOAT_SECTIONS } from "./sailboat-geometry";
import { StarfishAddModal } from "./starfish-add-modal";
import { StarfishSectionFormModal } from "./starfish-section-form-modal";
import { Plus } from "lucide-react";

interface SailboatBoardLayoutProps {
  columns: Column[];
}

type ModalMode = "add-note" | "edit-section" | "add-section" | null;

export function SailboatBoardLayout({ columns: columnsProp }: SailboatBoardLayoutProps) {
  const { board, participant } = useBoardContext();
  const columns = board?.columns ?? columnsProp;
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const isWritePhase = board?.phase === "writing";
  const isDone = board?.phase === "done";
  const isHost = !!participant && participant.id === board?.hostId;

  const activeColumn = columns.find((c) => c.id === activeColumnId) ?? null;
  const activeRegion = activeColumn
    ? SAILBOAT_SECTIONS[columns.indexOf(activeColumn)]
    : null;

  const modalPos = activeRegion
    ? {
        left: `${activeRegion.left + (activeRegion.width * activeRegion.notesLeft) / 100}%`,
        top: `${activeRegion.top + (activeRegion.height * activeRegion.notesTop) / 100}%`,
      }
    : modalMode === "add-section"
      ? { left: "50%", top: "50%" }
      : null;

  const handleOpenAddNote = (columnId: string) => {
    if (!isWritePhase) return;
    setActiveColumnId(columnId);
    setModalMode("add-note");
  };

  const handleOpenEditSection = (columnId: string) => {
    setActiveColumnId(columnId);
    setModalMode("edit-section");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setActiveColumnId(null);
  };

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <div className="relative flex flex-1 items-center justify-center overflow-auto p-4 min-h-0">
        <div className="relative aspect-[1000/620] w-full max-w-6xl min-h-[28rem] rounded-2xl overflow-hidden shadow-lg border border-sky-200/60 dark:border-sky-900/40">
          <SailboatScene />

          {columns.map((column, idx) => {
            const region = SAILBOAT_SECTIONS[idx];
            if (!region) return null;
            return (
              <SailboatSection
                key={column.id}
                column={column}
                region={region}
                onSectionClick={
                  isWritePhase && modalMode !== "add-note"
                    ? () => handleOpenAddNote(column.id)
                    : undefined
                }
              />
            );
          })}

          <div className="pointer-events-none absolute inset-0">
            {columns.map((column, idx) => {
              const region = SAILBOAT_SECTIONS[idx];
              if (!region) return null;
              return (
                <SailboatSectionLabel
                  key={column.id}
                  column={column}
                  left={`${region.labelLeft}%`}
                  top={`${region.labelTop}%`}
                  subtitle={region.subtitle}
                  isWritePhase={isWritePhase}
                  onAddNote={() => handleOpenAddNote(column.id)}
                  onEdit={() => handleOpenEditSection(column.id)}
                />
              );
            })}
          </div>

          {isHost && !isDone && (
            <button
              type="button"
              onClick={() => {
                setActiveColumnId(null);
                setModalMode("add-section");
              }}
              className="absolute left-1/2 top-[58%] z-20 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-white/70 bg-white/80 text-primary shadow-md transition-all hover:scale-105 hover:border-primary hover:bg-white dark:border-white/30 dark:bg-zinc-900/80"
              title="Add section"
            >
              <Plus className="size-4" />
            </button>
          )}

          {modalMode === "add-note" && isWritePhase && activeColumn && modalPos && (
            <StarfishAddModal
              column={activeColumn}
              left={modalPos.left}
              top={modalPos.top}
              onClose={handleCloseModal}
            />
          )}

          {modalMode === "edit-section" && activeColumn && modalPos && (
            <StarfishSectionFormModal
              mode="edit"
              column={activeColumn}
              left={modalPos.left}
              top={modalPos.top}
              onClose={handleCloseModal}
            />
          )}

          {modalMode === "add-section" && modalPos && (
            <StarfishSectionFormModal
              mode="add"
              left={modalPos.left}
              top={modalPos.top}
              onClose={handleCloseModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}
