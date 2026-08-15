import { NextRequest, NextResponse } from "next/server";
import { createBoard, createBoardFromImport } from "@/lib/board-store";
import { BOARD_TEMPLATES } from "@/lib/types";
import { getUserIdFromRequest } from "@/lib/user-session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, templateId, columns: importedColumns } = body;
  // Ownership only from verified session — never trust body.ownerId
  const ownerId = getUserIdFromRequest(request) ?? undefined;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Board name is required" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "Board name too long" }, { status: 400 });
  }

  // Import flow: columns provided directly
  if (Array.isArray(importedColumns) && importedColumns.length > 0) {
    const cleaned = importedColumns
      .filter((c) => typeof c.title === "string" && c.title.trim() && Array.isArray(c.cards))
      .map((c) => ({
        title: c.title.trim().slice(0, 80),
        cards: c.cards
          .filter((t: unknown) => typeof t === "string" && (t as string).trim())
          .map((t: string) => t.trim().slice(0, 1000)),
      }));
    if (cleaned.length === 0) {
      return NextResponse.json({ error: "No valid columns found in file" }, { status: 400 });
    }
    const board = await createBoardFromImport(name.trim(), cleaned, ownerId);
    return NextResponse.json(board, { status: 201 });
  }

  // Template flow
  if (!templateId || !BOARD_TEMPLATES.find((t) => t.id === templateId)) {
    return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  }

  const board = await createBoard(name.trim(), templateId, ownerId);
  return NextResponse.json(board, { status: 201 });
}
