import { nanoid } from "nanoid";
import type { Board, Column } from "./types";
import { BOARD_TEMPLATES } from "./types";
import { getClient, ensureSchema } from "./db";

export async function createBoard(name: string, templateId: string): Promise<Board> {
  await ensureSchema();
  const template = BOARD_TEMPLATES.find((t) => t.id === templateId);
  if (!template) throw new Error(`Template "${templateId}" not found`);

  const boardId = nanoid(10);
  const columns: Column[] = template.columns.map((col) => ({
    id: nanoid(8),
    title: col.title,
    color: col.color,
    emoji: col.emoji,
    cards: [],
  }));

  const board: Board = {
    id: boardId,
    name,
    createdAt: Date.now(),
    columns,
    participants: [],
    pendingJoinRequests: [],
    hostId: null,
    timer: { running: false, remaining: 300, total: 300 },
    phase: "writing",
    maxVotesPerUser: 5,
    messages: [],
  };

  await getClient().execute({
    sql: "INSERT INTO boards (id, name, created_at, data) VALUES (?, ?, ?, ?)",
    args: [board.id, board.name, board.createdAt, JSON.stringify(board)],
  });

  return board;
}

export async function getBoard(id: string): Promise<Board | undefined> {
  await ensureSchema();
  const result = await getClient().execute({
    sql: "SELECT data FROM boards WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0];
  return row ? (JSON.parse(row.data as string) as Board) : undefined;
}

export async function updateBoard(
  id: string,
  updater: (board: Board) => Board
): Promise<Board | undefined> {
  const board = await getBoard(id);
  if (!board) return undefined;
  const updated = updater(board);
  await getClient().execute({
    sql: "UPDATE boards SET data = ? WHERE id = ?",
    args: [JSON.stringify(updated), id],
  });
  return updated;
}

export async function deleteBoard(id: string): Promise<boolean> {
  const result = await getClient().execute({
    sql: "DELETE FROM boards WHERE id = ?",
    args: [id],
  });
  return result.rowsAffected > 0;
}

export async function getAllBoards(): Promise<Board[]> {
  await ensureSchema();
  const result = await getClient().execute({
    sql: "SELECT data FROM boards ORDER BY created_at DESC",
    args: [],
  });
  return result.rows.map((row) => JSON.parse(row.data as string) as Board);
}

const IMPORT_COLORS = ["green", "red", "blue", "yellow", "purple", "orange"];
const IMPORT_EMOJIS = ["📝", "💬", "🎯", "💡", "⭐", "🔧", "📌", "🚀"];

export async function createBoardFromImport(
  name: string,
  importedColumns: { title: string; cards: string[] }[]
): Promise<Board> {
  await ensureSchema();
  const boardId = nanoid(10);
  const columns: Column[] = importedColumns.map((col, i) => ({
    id: nanoid(8),
    title: col.title,
    color: IMPORT_COLORS[i % IMPORT_COLORS.length],
    emoji: IMPORT_EMOJIS[i % IMPORT_EMOJIS.length],
    cards: col.cards.map((text) => ({
      id: nanoid(8),
      text,
      authorId: "import",
      anonymous: false,
      votes: [],
      reactions: {},
      createdAt: Date.now(),
    })),
  }));

  const board: Board = {
    id: boardId,
    name,
    createdAt: Date.now(),
    columns,
    participants: [],
    pendingJoinRequests: [],
    hostId: null,
    timer: { running: false, remaining: 300, total: 300 },
    phase: "writing",
    maxVotesPerUser: 5,
    messages: [],
  };

  await getClient().execute({
    sql: "INSERT INTO boards (id, name, created_at, data) VALUES (?, ?, ?, ?)",
    args: [board.id, board.name, board.createdAt, JSON.stringify(board)],
  });

  return board;
}
