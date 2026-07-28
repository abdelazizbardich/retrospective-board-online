import { nanoid } from "nanoid";
import type { Board, BoardTemplate, Column } from "./types";

/** Apply a template to an existing board, preserving cards by column index. */
export function applyTemplateToBoard(
  board: Pick<Board, "columns">,
  template: BoardTemplate
): Pick<Board, "columns" | "templateId" | "layout"> {
  const cardsByIndex = board.columns.map((col) => col.cards);
  const overflowCards = cardsByIndex.slice(template.columns.length).flat();

  const columns: Column[] = template.columns.map((col, index) => {
    const isLast = index === template.columns.length - 1;
    const cards = [...(cardsByIndex[index] ?? []), ...(isLast ? overflowCards : [])];
    return {
      id: nanoid(8),
      title: col.title,
      color: col.color,
      emoji: col.emoji,
      cards,
    };
  });

  return {
    templateId: template.id,
    columns,
    ...(template.layout ? { layout: template.layout } : { layout: undefined }),
  };
}

/** Switch template metadata only — keep existing columns and cards. */
export function applyTemplateLayoutOnly(
  template: BoardTemplate
): Pick<Board, "templateId" | "layout"> {
  return {
    templateId: template.id,
    ...(template.layout ? { layout: template.layout } : { layout: undefined }),
  };
}

/** Infer template id from board columns for older boards. */
export function inferTemplateId(board: Pick<Board, "columns" | "templateId">): string | null {
  if (board.templateId) return board.templateId;

  const titles = board.columns.map((c) => c.title).join("|");
  const match = [
    { id: "classic", key: "What went well|What didn't go well|Action items" },
    { id: "4ls", key: "Liked|Learned|Lacked|Longed for" },
    { id: "start-stop-continue", key: "Start|Stop|Continue" },
    { id: "mad-sad-glad", key: "Mad|Sad|Glad" },
    { id: "sailboat", key: "Wind|Sun|Anchor|Reef|Sprint Goal" },
    { id: "starfish", key: "More|Less|Start|Stop|Keep" },
  ].find((t) => t.key === titles);

  return match?.id ?? null;
}
