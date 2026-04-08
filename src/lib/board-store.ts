import { nanoid } from "nanoid";
import type { Board, Column } from "./types";
import { BOARD_TEMPLATES } from "./types";
import { db } from "./db";

export async function createBoard(name: string, templateId: string): Promise<Board> {
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

  db.prepare(
    "INSERT INTO boards (id, name, created_at, data) VALUES (?, ?, ?, ?)"
  ).run(board.id, board.name, board.createdAt, JSON.stringify(board));

  return board;
}

export async function getBoard(id: string): Promise<Board | undefined> {
  const row = db.prepare("SELECT data FROM boards WHERE id = ?").get(id) as
    | { data: string }
    | undefined;
  return row ? (JSON.parse(row.data) as Board) : undefined;
}

export async function updateBoard(
  id: string,
  updater: (board: Board) => Board
): Promise<Board | undefined> {
  const board = await getBoard(id);
  if (!board) return undefined;
  const updated = updater(board);
  db.prepare("UPDATE boards SET data = ? WHERE id = ?").run(
    JSON.stringify(updated),
    id
  );
  return updated;
}

export async function deleteBoard(id: string): Promise<boolean> {
  const result = db.prepare("DELETE FROM boards WHERE id = ?").run(id);
  return result.changes > 0;
}

export async function getAllBoards(): Promise<Board[]> {
  const rows = db
    .prepare("SELECT data FROM boards ORDER BY created_at DESC")
    .all() as { data: string }[];
  return rows.map((row) => JSON.parse(row.data) as Board);
}

const IMPORT_COLORS = ["green", "red", "blue", "yellow", "purple", "orange"];
const IMPORT_EMOJIS = ["📝", "💬", "🎯", "💡", "⭐", "🔧", "📌", "🚀"];

export async function createBoardFromImport(
  name: string,
  importedColumns: { title: string; cards: string[] }[]
): Promise<Board> {
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

  db.prepare(
    "INSERT INTO boards (id, name, created_at, data) VALUES (?, ?, ?, ?)"
  ).run(board.id, board.name, board.createdAt, JSON.stringify(board));

  return board;
}
