import { NextRequest, NextResponse } from "next/server";
import { getAllBoards } from "@/lib/board-store";
import { requireAdmin } from "../auth/route";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const allBoards = await getAllBoards();
  const boards = allBoards.map((b) => ({
    id: b.id,
    name: b.name,
    phase: b.phase,
    createdAt: b.createdAt,
    participantCount: b.participants.length,
    cardCount: b.columns.reduce((sum, col) => sum + col.cards.length, 0),
    columnCount: b.columns.length,
    hostId: b.hostId,
  }));

  return NextResponse.json({ boards, total: boards.length });
}
