import { NextRequest, NextResponse } from "next/server";
import { deleteBoard, getBoard } from "@/lib/board-store";
import { requireAdmin } from "../../auth/route";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const board = await getBoard(id);
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }
  await deleteBoard(id);
  return NextResponse.json({ ok: true });
}
