"use client";

import { useState } from "react";
import type { Column } from "@/lib/types";
import { useBoardContext } from "@/lib/board-context";
import { StarfishWedge } from "./starfish-wedge";
import { StarfishWedgeBackgrounds } from "./starfish-wedge-backgrounds";
import { StarfishAddModal } from "./starfish-add-modal";
import { StarfishSectionFormModal } from "./starfish-section-form-modal";
import { StarfishSectionLabel } from "./starfish-section-label";
import { getWedgeCenters, polarToPercent } from "./starfish-geometry";
import { Plus } from "lucide-react";

interface RadialBoardLayoutProps {
  columns: Column[];
}

const MODAL_RADIUS = 40;
const LABEL_RADIUS = 22;

type ModalMode = "add-note" | "edit-section" | "add-section" | null;

export function RadialBoardLayout({ columns: columnsProp }: RadialBoardLayoutProps) {
  const { board, participant } = useBoardContext();
  const columns = board?.columns ?? columnsProp;
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const isWritePhase = board?.phase === "writing";
  const isDone = board?.phase === "done";
  const isHost = !!participant && participant.id === board?.hostId;
  const count = columns.length;

  const activeColumn = columns.find((c) => c.id === activeColumnId) ?? null;
  const activeColumnIdx = activeColumn ? columns.indexOf(activeColumn) : -1;

  const modalPos =
    activeColumnIdx >= 0
      ? polarToPercent(getWedgeCenters(count)[activeColumnIdx] ?? 0, MODAL_RADIUS)
      : modalMode === "add-section"
        ? polarToPercent(0, 12)
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

  const wedgeCenters = getWedgeCenters(count);

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <div className="relative flex flex-1 items-center justify-center overflow-auto p-4 min-h-0">
        <div className="relative aspect-square w-full max-w-5xl min-h-[32rem] rounded-2xl bg-white dark:bg-zinc-900">
          <StarfishWedgeBackgrounds columns={columns} />

          {columns.map((column, idx) => (
            <StarfishWedge
              key={column.id}
              column={column}
              index={idx}
              total={count}
              onSectionClick={
                isWritePhase && modalMode !== "add-note" ? () => handleOpenAddNote(column.id) : undefined
              }
            />
          ))}

          {/* Section labels with rename / remove controls */}
          <div className="pointer-events-none absolute inset-0">
            {columns.map((column, idx) => {
              const pos = polarToPercent(wedgeCenters[idx] ?? 0, LABEL_RADIUS);
              return (
                <StarfishSectionLabel
                  key={column.id}
                  column={column}
                  left={pos.left}
                  top={pos.top}
                  isWritePhase={isWritePhase}
                  onAddNote={() => handleOpenAddNote(column.id)}
                  onEdit={() => handleOpenEditSection(column.id)}
                />
              );
            })}
          </div>

          {/* Center: add section button (host only) */}
          {isHost && !isDone && (
            <button
              type="button"
              onClick={() => {
                setActiveColumnId(null);
                setModalMode("add-section");
              }}
              className="absolute left-1/2 top-1/2 z-20 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-primary/40 bg-background/90 text-primary shadow-sm transition-all hover:scale-105 hover:border-primary hover:bg-primary/5"
              title="Add section"
            >
              <Plus className="size-5" />
            </button>
          )}

          {/* Floating modals */}
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
