import { NextRequest, NextResponse } from "next/server";
import { getBoard, updateBoard } from "@/lib/board-store";
import { nanoid } from "nanoid";
import type { BoardPhase } from "@/lib/types";

const VALID_PHASES: BoardPhase[] = ["writing", "grouping", "voting", "discussing", "actions"];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const board = await getBoard(id);
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }
  return NextResponse.json(board);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  const board = await getBoard(id);
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  switch (action) {
    case "add-card": {
      const { columnId, text, authorId, anonymous } = body;
      if (!columnId || !text || typeof text !== "string" || text.trim().length === 0) {
        return NextResponse.json({ error: "columnId and text required" }, { status: 400 });
      }
      if (text.length > 500) {
        return NextResponse.json({ error: "Card text too long" }, { status: 400 });
      }
      const updated = await updateBoard(id, (b) => ({
        ...b,
        columns: b.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: [
                  ...col.cards,
                  {
                    id: nanoid(8),
                    text: text.trim(),
                    authorId: authorId || "anonymous",
                    anonymous: anonymous === true,
                    votes: [],
                    reactions: {},
                    createdAt: Date.now(),
                  },
                ],
              }
            : col
        ),
      }));
      return NextResponse.json(updated);
    }

    case "edit-card": {
      const { columnId, cardId, text } = body;
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return NextResponse.json({ error: "text required" }, { status: 400 });
      }
      if (text.length > 500) {
        return NextResponse.json({ error: "Card text too long" }, { status: 400 });
      }
      const updated = await updateBoard(id, (b) => ({
        ...b,
        columns: b.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: col.cards.map((card) =>
                  card.id === cardId ? { ...card, text: text.trim() } : card
                ),
              }
            : col
        ),
      }));
      return NextResponse.json(updated);
    }

    case "delete-card": {
      const { columnId, cardId } = body;
      const updated = await updateBoard(id, (b) => ({
        ...b,
        columns: b.columns.map((col) =>
          col.id === columnId
            ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
            : col
        ),
      }));
      return NextResponse.json(updated);
    }

    case "vote": {
      const { columnId, cardId, participantId } = body;
      if (!participantId) {
        return NextResponse.json({ error: "participantId required" }, { status: 400 });
      }

      // Count total votes by this participant
      const totalVotes = board.columns
        .flatMap((c) => c.cards)
        .flatMap((c) => c.votes)
        .filter((v) => v === participantId).length;

      if (totalVotes >= board.maxVotesPerUser) {
        return NextResponse.json(
          { error: `Max ${board.maxVotesPerUser} votes reached` },
          { status: 400 }
        );
      }

      const updated = await updateBoard(id, (b) => ({
        ...b,
        columns: b.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: col.cards.map((card) =>
                  card.id === cardId
                    ? { ...card, votes: [...card.votes, participantId] }
                    : card
                ),
              }
            : col
        ),
      }));
      return NextResponse.json(updated);
    }

    case "unvote": {
      const { columnId, cardId, participantId } = body;
      if (!participantId) {
        return NextResponse.json({ error: "participantId required" }, { status: 400 });
      }
      const updated = await updateBoard(id, (b) => ({
        ...b,
        columns: b.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: col.cards.map((card) => {
                  if (card.id !== cardId) return card;
                  const idx = card.votes.indexOf(participantId);
                  if (idx === -1) return card;
                  const newVotes = [...card.votes];
                  newVotes.splice(idx, 1);
                  return { ...card, votes: newVotes };
                }),
              }
            : col
        ),
      }));
      return NextResponse.json(updated);
    }

    case "set-phase": {
      const { phase } = body;
      if (!VALID_PHASES.includes(phase)) {
        return NextResponse.json({ error: "Invalid phase" }, { status: 400 });
      }
      const updated = await updateBoard(id, (b) => ({ ...b, phase }));
      return NextResponse.json(updated);
    }

    case "join": {
      const { participantName } = body;
      if (!participantName || typeof participantName !== "string" || participantName.trim().length === 0) {
        return NextResponse.json({ error: "participantName required" }, { status: 400 });
      }
      if (participantName.length > 50) {
        return NextResponse.json({ error: "Name too long" }, { status: 400 });
      }
      const participant = {
        id: nanoid(8),
        name: participantName.trim(),
        joinedAt: Date.now(),
        anonymous: false,
      };
      const updated = await updateBoard(id, (b) => ({
        ...b,
        participants: [...b.participants, participant],
        hostId: b.hostId ?? participant.id,
      }));
      return NextResponse.json({ board: updated, participant });
    }

    case "set-timer": {
      const { remaining, total, running } = body;
      const updated = await updateBoard(id, (b) => ({
        ...b,
        timer: {
          remaining: remaining ?? b.timer.remaining,
          total: total ?? b.timer.total,
          running: running ?? b.timer.running,
        },
      }));
      return NextResponse.json(updated);
    }

    case "add-column": {
      const { title, color, emoji } = body;
      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json({ error: "Column title required" }, { status: 400 });
      }
      if (title.length > 60) {
        return NextResponse.json({ error: "Column title too long" }, { status: 400 });
      }
      const VALID_COLORS = ["green", "red", "blue", "yellow", "purple"];
      const newCol = {
        id: nanoid(8),
        title: title.trim(),
        color: VALID_COLORS.includes(color) ? color : "blue",
        emoji: (emoji && typeof emoji === "string" ? emoji.slice(0, 4) : "📝"),
        cards: [],
      };
      const updated = await updateBoard(id, (b) => ({
        ...b,
        columns: [...b.columns, newCol],
      }));
      return NextResponse.json(updated);
    }

    case "edit-column": {
      const { columnId, title, color, emoji } = body;
      if (!columnId) {
        return NextResponse.json({ error: "columnId required" }, { status: 400 });
      }
      if (title !== undefined && (typeof title !== "string" || title.trim().length === 0)) {
        return NextResponse.json({ error: "Column title cannot be empty" }, { status: 400 });
      }
      if (title && title.length > 60) {
        return NextResponse.json({ error: "Column title too long" }, { status: 400 });
      }
      const VALID_EDIT_COLORS = ["green", "red", "blue", "yellow", "purple"];
      const updated = await updateBoard(id, (b) => ({
        ...b,
        columns: b.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                ...(title !== undefined && { title: title.trim() }),
                ...(color !== undefined && VALID_EDIT_COLORS.includes(color) && { color }),
                ...(emoji !== undefined && typeof emoji === "string" && { emoji: emoji.slice(0, 4) }),
              }
            : col
        ),
      }));
      return NextResponse.json(updated);
    }

    case "delete-column": {
      const { columnId } = body;
      if (!columnId) {
        return NextResponse.json({ error: "columnId required" }, { status: 400 });
      }
      if (board.columns.length <= 1) {
        return NextResponse.json({ error: "Cannot delete the last column" }, { status: 400 });
      }
      const targetCol = board.columns.find((col) => col.id === columnId);
      if (targetCol && targetCol.cards.length > 0) {
        return NextResponse.json({ error: "Cannot delete a column that has cards" }, { status: 400 });
      }
      const updated = await updateBoard(id, (b) => ({
        ...b,
        columns: b.columns.filter((col) => col.id !== columnId),
      }));
      return NextResponse.json(updated);
    }

    case "move-card": {
      const { cardId, fromColumnId, toColumnId } = body;
      if (!cardId || !fromColumnId || !toColumnId) {
        return NextResponse.json({ error: "cardId, fromColumnId and toColumnId required" }, { status: 400 });
      }
      if (fromColumnId === toColumnId) {
        return NextResponse.json(board);
      }
      const fromCol = board.columns.find((c) => c.id === fromColumnId);
      const toCol = board.columns.find((c) => c.id === toColumnId);
      if (!fromCol || !toCol) {
        return NextResponse.json({ error: "Column not found" }, { status: 404 });
      }
      const card = fromCol.cards.find((c) => c.id === cardId);
      if (!card) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
      }
      const updated = await updateBoard(id, (b) => ({
        ...b,
        columns: b.columns.map((col) => {
          if (col.id === fromColumnId) {
            return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
          }
          if (col.id === toColumnId) {
            return { ...col, cards: [...col.cards, card] };
          }
          return col;
        }),
      }));
      return NextResponse.json(updated);
    }

    case "kick-participant": {
      const { participantId, requesterId } = body;
      if (!participantId) {
        return NextResponse.json({ error: "participantId required" }, { status: 400 });
      }
      if (board.hostId !== requesterId) {
        return NextResponse.json({ error: "Only the host can kick participants" }, { status: 403 });
      }
      const target = board.participants.find((p) => p.id === participantId);
      if (!target) {
        return NextResponse.json({ error: "Participant not found" }, { status: 404 });
      }
      const updated = await updateBoard(id, (b) => ({
        ...b,
        participants: b.participants.filter((p) => p.id !== participantId),
      }));
      return NextResponse.json(updated);
    }

    case "react": {
      const { columnId, cardId, participantId, emoji } = body;
      if (!participantId || !emoji) {
        return NextResponse.json({ error: "participantId and emoji required" }, { status: 400 });
      }
      const ALLOWED_REACTIONS = ["😢", "😄", "😮", "😡", "😜"];
      if (!ALLOWED_REACTIONS.includes(emoji)) {
        return NextResponse.json({ error: "Invalid reaction" }, { status: 400 });
      }
      const updated = await updateBoard(id, (b) => ({
        ...b,
        columns: b.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: col.cards.map((card) => {
                  if (card.id !== cardId) return card;
                  const current = (card.reactions ?? {})[emoji] ?? [];
                  const alreadyReacted = current.includes(participantId);
                  return {
                    ...card,
                    reactions: {
                      ...(card.reactions ?? {}),
                      [emoji]: alreadyReacted
                        ? current.filter((p) => p !== participantId)
                        : [...current, participantId],
                    },
                  };
                }),
              }
            : col
        ),
      }));
      return NextResponse.json(updated);
    }

    case "toggle-anonymous": {
      const { participantId } = body;
      if (!participantId) {
        return NextResponse.json({ error: "participantId required" }, { status: 400 });
      }
      const target = board.participants.find((p) => p.id === participantId);
      if (!target) {
        return NextResponse.json({ error: "Participant not found" }, { status: 404 });
      }
      const updated = await updateBoard(id, (b) => ({
        ...b,
        participants: b.participants.map((p) =>
          p.id === participantId ? { ...p, anonymous: !p.anonymous } : p
        ),
      }));
      return NextResponse.json(updated);
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
