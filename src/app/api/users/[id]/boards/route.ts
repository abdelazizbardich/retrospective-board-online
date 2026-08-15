import { NextRequest, NextResponse } from "next/server";
import { getBoardsByOwner } from "@/lib/board-store";
import { getUserIdFromRequest } from "@/lib/user-session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionUserId = getUserIdFromRequest(request);
  if (!sessionUserId || sessionUserId !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const boards = await getBoardsByOwner(id);
    const summaries = boards.map((b) => ({
      id: b.id,
      name: b.name,
      phase: b.phase,
      createdAt: b.createdAt,
      participantCount: b.participants.filter((p) => !p.left).length,
      cardCount: b.columns.reduce((s, c) => s + c.cards.length, 0),
      columnCount: b.columns.length,
    }));
    return NextResponse.json({ boards: summaries });
  } catch {
    return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 });
  }
}
