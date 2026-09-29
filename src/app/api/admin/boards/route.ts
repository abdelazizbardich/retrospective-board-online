import { NextRequest, NextResponse } from "next/server";
import { getAllBoards } from "@/lib/board-store";
import { getUsersByIds } from "@/lib/user-store";
import { requireAdmin } from "../auth/route";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const allBoards = await getAllBoards();
  const ownerIds = [...new Set(allBoards.map((b) => b.ownerId).filter((id): id is string => !!id))];
  const owners = await getUsersByIds(ownerIds);
  const ownerEmails = new Map(owners.map((u) => [u.id, u.email]));

  const boards = allBoards.map((b) => ({
    id: b.id,
    name: b.name,
    phase: b.phase,
    createdAt: b.createdAt,
    participantCount: b.participants.length,
    cardCount: b.columns.reduce((sum, col) => sum + col.cards.length, 0),
    columnCount: b.columns.length,
    hostId: b.hostId,
    ownerEmail: b.ownerId ? ownerEmails.get(b.ownerId) ?? null : null,
    hostName: b.participants.find((p) => p.id === b.hostId)?.name ?? null,
  }));

  return NextResponse.json({ boards, total: boards.length });
}
