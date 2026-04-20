import { NextRequest, NextResponse } from "next/server";
import { getBoard, updateBoard } from "@/lib/board-store";
import { nanoid } from "nanoid";
import type { BoardPhase } from "@/lib/types";

const VALID_PHASES: BoardPhase[] = ["writing", "grouping", "voting", "discussing", "done"];

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

      // Check if this participant already voted on this card
      const targetCard = board.columns
        .find((c) => c.id === columnId)
        ?.cards.find((c) => c.id === cardId);
      if (targetCard?.votes.includes(participantId)) {
        return NextResponse.json({ error: "Already voted on this card" }, { status: 400 });
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

      const voter = board.participants.find((p) => p.id === participantId);
      const votedCard = board.columns
        .find((c) => c.id === columnId)
        ?.cards.find((c) => c.id === cardId);
      const cardPreview = votedCard ? votedCard.text.slice(0, 40) + (votedCard.text.length > 40 ? "…" : "") : "a card";

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
        messages: [...(b.messages || []), {
          id: nanoid(8),
          authorId: "system",
          authorName: "System",
          text: `🗳️ ${voter?.name || "Someone"} voted on "${cardPreview}"`,
          createdAt: Date.now(),
        }],
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

      const trimmedName = participantName.trim();

      // Check if a participant with the same name previously left — allow them to rejoin
      const returning = board.participants.find(
        (p) => p.left && p.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (returning) {
        const updated = await updateBoard(id, (b) => ({
          ...b,
          participants: b.participants.map((p) =>
            p.id === returning.id ? { ...p, left: false } : p
          ),
        }));
        const reactivated = { ...returning, left: false };
        return NextResponse.json({ board: updated, participant: reactivated });
      }

      // First user auto-joins as host
      if (!board.hostId) {
        const participant = {
          id: nanoid(8),
          name: trimmedName,
          joinedAt: Date.now(),
          anonymous: false,
        };
        const updated = await updateBoard(id, (b) => ({
          ...b,
          participants: [...b.participants, participant],
          hostId: participant.id,
        }));
        return NextResponse.json({ board: updated, participant });
      }

      // Subsequent users go into pending approval
      const requestId = nanoid(8);
      const updated = await updateBoard(id, (b) => ({
        ...b,
        pendingJoinRequests: [...(b.pendingJoinRequests || []), {
          id: requestId,
          name: trimmedName,
          requestedAt: Date.now(),
        }],
      }));
      return NextResponse.json({ board: updated, pending: true, requestId });
    }

    case "approve-join": {
      const { requestId, requesterId } = body;
      if (!requestId) {
        return NextResponse.json({ error: "requestId required" }, { status: 400 });
      }
      if (board.hostId !== requesterId) {
        return NextResponse.json({ error: "Only the host can approve join requests" }, { status: 403 });
      }
      const request = (board.pendingJoinRequests || []).find((r) => r.id === requestId);
      if (!request) {
        return NextResponse.json({ error: "Join request not found" }, { status: 404 });
      }
      const participant = {
        id: request.id,
        name: request.name,
        joinedAt: Date.now(),
        anonymous: false,
      };
      const updated = await updateBoard(id, (b) => ({
        ...b,
        participants: [...b.participants, participant],
        pendingJoinRequests: (b.pendingJoinRequests || []).filter((r) => r.id !== requestId),
      }));
      return NextResponse.json(updated);
    }

    case "reject-join": {
      const { requestId, requesterId } = body;
      if (!requestId) {
        return NextResponse.json({ error: "requestId required" }, { status: 400 });
      }
      if (board.hostId !== requesterId) {
        return NextResponse.json({ error: "Only the host can reject join requests" }, { status: 403 });
      }
      const updated = await updateBoard(id, (b) => ({
        ...b,
        pendingJoinRequests: (b.pendingJoinRequests || []).filter((r) => r.id !== requestId),
      }));
      return NextResponse.json(updated);
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

    case "assign-host": {
      const { newHostId, requesterId } = body;
      if (!newHostId || !requesterId) {
        return NextResponse.json({ error: "newHostId and requesterId required" }, { status: 400 });
      }
      if (board.hostId !== requesterId) {
        return NextResponse.json({ error: "Only the host can transfer the host role" }, { status: 403 });
      }
      if (!board.participants.some((p) => p.id === newHostId)) {
        return NextResponse.json({ error: "Target participant not found" }, { status: 404 });
      }
      const updated = await updateBoard(id, (b) => ({ ...b, hostId: newHostId }));
      return NextResponse.json(updated);
    }

    case "move-column": {
      const { columnId, direction } = body;
      if (!columnId || (direction !== "left" && direction !== "right")) {
        return NextResponse.json({ error: "columnId and direction (left|right) required" }, { status: 400 });
      }
      const colIdx = board.columns.findIndex((c) => c.id === columnId);
      if (colIdx === -1) {
        return NextResponse.json({ error: "Column not found" }, { status: 404 });
      }
      const targetIdx = direction === "left" ? colIdx - 1 : colIdx + 1;
      if (targetIdx < 0 || targetIdx >= board.columns.length) {
        return NextResponse.json(board);
      }
      const updated = await updateBoard(id, (b) => {
        const cols = [...b.columns];
        [cols[colIdx], cols[targetIdx]] = [cols[targetIdx], cols[colIdx]];
        return { ...b, columns: cols };
      });
      return NextResponse.json(updated);
    }

    case "reorder-column": {
      const { columnId, toIndex } = body;
      if (!columnId || typeof toIndex !== "number") {
        return NextResponse.json({ error: "columnId and toIndex required" }, { status: 400 });
      }
      const fromIdx = board.columns.findIndex((c) => c.id === columnId);
      if (fromIdx === -1) {
        return NextResponse.json({ error: "Column not found" }, { status: 404 });
      }
      const clampedTo = Math.max(0, Math.min(toIndex, board.columns.length - 1));
      if (fromIdx === clampedTo) {
        return NextResponse.json(board);
      }
      const updated = await updateBoard(id, (b) => {
        const cols = [...b.columns];
        const [moved] = cols.splice(fromIdx, 1);
        cols.splice(clampedTo, 0, moved);
        return { ...b, columns: cols };
      });
      return NextResponse.json(updated);
    }

    case "leave": {
      const { participantId } = body;
      if (!participantId) {
        return NextResponse.json({ error: "participantId required" }, { status: 400 });
      }
      if (!board.participants.some((p) => p.id === participantId)) {
        return NextResponse.json(board); // already gone — no-op
      }
      // Host leaving → close the room for everyone
      if (board.hostId === participantId) {
        const updated = await updateBoard(id, (b) => ({
          ...b,
          participants: [],
          closed: true,
        }));
        return NextResponse.json(updated);
      }
      // Regular participant leaving — mark as left instead of removing
      const updated = await updateBoard(id, (b) => ({
        ...b,
        participants: b.participants.map((p) =>
          p.id === participantId ? { ...p, left: true } : p
        ),
      }));
      return NextResponse.json(updated);
    }

    case "reopen-session": {
      if (!board.closed) {
        return NextResponse.json(board); // already open — no-op
      }
      const updated = await updateBoard(id, (b) => ({
        ...b,
        closed: false,
        participants: [],
        hostId: null,
      }));
      return NextResponse.json(updated);
    }

    case "send-message": {
      const { participantId, participantName, text, toId, toName, replyToId, replyToText, replyToAuthor } = body;
      if (!participantId || !participantName) {
        return NextResponse.json({ error: "participantId and participantName required" }, { status: 400 });
      }
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return NextResponse.json({ error: "Message text required" }, { status: 400 });
      }
      if (text.length > 500) {
        return NextResponse.json({ error: "Message too long" }, { status: 400 });
      }
      const message = {
        id: nanoid(8),
        authorId: participantId,
        authorName: participantName,
        text: text.trim(),
        ...(toId && toName ? { toId, toName } : {}),
        ...(replyToId && replyToText && replyToAuthor ? { replyToId, replyToText, replyToAuthor } : {}),
        createdAt: Date.now(),
      };
      const updated = await updateBoard(id, (b) => ({
        ...b,
        messages: [...(b.messages || []), message],
      }));
      return NextResponse.json(updated);
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
