import { nanoid } from "nanoid";
import type { Board, Column } from "./types";
import { BOARD_TEMPLATES, DEFAULT_TIMER_SECONDS } from "./types";
import { getSupabase } from "./db";

export async function createBoard(name: string, templateId: string, ownerId?: string): Promise<Board> {
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
    templateId: template.id,
    ...(template.layout ? { layout: template.layout } : {}),
    columns,
    participants: [],
    pendingJoinRequests: [],
    hostId: null,
    timer: { running: false, remaining: DEFAULT_TIMER_SECONDS, total: DEFAULT_TIMER_SECONDS },
    phase: "writing",
    maxVotesPerUser: 5,
    messages: [],
  };

  const { error } = await getSupabase()
    .from("boards")
    .insert({ id: board.id, name: board.name, created_at: board.createdAt, data: board, ...(ownerId ? { owner_id: ownerId } : {}) });

  if (error) throw new Error(error.message);
  return board;
}

export async function getBoard(id: string): Promise<Board | undefined> {
  const { data, error } = await getSupabase()
    .from("boards")
    .select("data, owner_id")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return undefined; // row not found
    throw new Error(error.message);
  }
  const board = data.data as Board;
  return data.owner_id ? { ...board, ownerId: data.owner_id as string } : board;
}

export async function updateBoard(
  id: string,
  updater: (board: Board) => Board
): Promise<Board | undefined> {
  const board = await getBoard(id);
  if (!board) return undefined;
  const updated = updater(board);

  const { error } = await getSupabase()
    .from("boards")
    .update({ data: updated })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return updated;
}

export async function deleteBoard(id: string): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("boards")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function getAllBoards(): Promise<Board[]> {
  const { data, error } = await getSupabase()
    .from("boards")
    .select("data")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.data as Board);
}

export async function getBoardsByOwner(ownerId: string): Promise<Board[]> {
  const { data, error } = await getSupabase()
    .from("boards")
    .select("data")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.data as Board);
}

const IMPORT_COLORS = ["green", "red", "blue", "yellow", "purple", "orange"];
const IMPORT_EMOJIS = ["📝", "💬", "🎯", "💡", "⭐", "🔧", "📌", "🚀"];

export async function createBoardFromImport(
  name: string,
  importedColumns: { title: string; cards: string[] }[],
  ownerId?: string
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
    timer: { running: false, remaining: DEFAULT_TIMER_SECONDS, total: DEFAULT_TIMER_SECONDS },
    phase: "writing",
    maxVotesPerUser: 5,
    messages: [],
  };

  const { error } = await getSupabase()
    .from("boards")
    .insert({ id: board.id, name: board.name, created_at: board.createdAt, data: board, ...(ownerId ? { owner_id: ownerId } : {}) });

  if (error) throw new Error(error.message);
  return board;
}

