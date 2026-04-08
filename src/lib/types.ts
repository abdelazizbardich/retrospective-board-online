export interface Card {
  id: string;
  text: string;
  authorId: string;
  anonymous: boolean;
  votes: string[]; // participantIds who voted
  reactions: Record<string, string[]>; // emoji → participantIds
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
  color: string; // tailwind color key: green, red, blue, yellow, purple
  emoji: string;
  cards: Card[];
}

export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  toId?: string; // if set, it's a DM to this participant
  toName?: string;
  createdAt: number;
}

export interface Board {
  id: string;
  name: string;
  createdAt: number;
  columns: Column[];
  participants: Participant[];
  pendingJoinRequests: PendingJoinRequest[];
  hostId: string | null;
  timer: TimerState;
  phase: BoardPhase;
  maxVotesPerUser: number;
  messages: ChatMessage[];
  closed?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  joinedAt: number;
  anonymous: boolean;
  left?: boolean;
}

export interface PendingJoinRequest {
  id: string;
  name: string;
  requestedAt: number;
}

export interface TimerState {
  running: boolean;
  remaining: number; // seconds
  total: number; // seconds
}

export type BoardPhase = "writing" | "grouping" | "voting" | "discussing" | "done";

export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  columns: Pick<Column, "title" | "color" | "emoji">[];
}

export const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: "classic",
    name: "Classic Retro",
    description: "The standard format: What went well, what didn't, and action items.",
    columns: [
      { title: "What went well", color: "green", emoji: "✅" },
      { title: "What didn't go well", color: "red", emoji: "❌" },
      { title: "Action items", color: "blue", emoji: "🎯" },
    ],
  },
  {
    id: "4ls",
    name: "4Ls Retrospective",
    description: "Liked, Learned, Lacked, Longed For — a deeper reflection format.",
    columns: [
      { title: "Liked", color: "green", emoji: "💚" },
      { title: "Learned", color: "blue", emoji: "📘" },
      { title: "Lacked", color: "red", emoji: "🔴" },
      { title: "Longed for", color: "purple", emoji: "💜" },
    ],
  },
  {
    id: "start-stop-continue",
    name: "Start / Stop / Continue",
    description: "Focus on concrete changes: what to start, stop, and keep doing.",
    columns: [
      { title: "Start", color: "green", emoji: "🚀" },
      { title: "Stop", color: "red", emoji: "🛑" },
      { title: "Continue", color: "blue", emoji: "➡️" },
    ],
  },
  {
    id: "mad-sad-glad",
    name: "Mad / Sad / Glad",
    description: "An emotion-focused format to surface how the team really feels.",
    columns: [
      { title: "Mad", color: "red", emoji: "😡" },
      { title: "Sad", color: "blue", emoji: "😢" },
      { title: "Glad", color: "green", emoji: "😊" },
    ],
  },
  {
    id: "sailboat",
    name: "Sailboat",
    description: "Visualize what propels you forward and what holds you back.",
    columns: [
      { title: "Wind (helps us)", color: "green", emoji: "💨" },
      { title: "Anchor (holds us back)", color: "red", emoji: "⚓" },
      { title: "Rocks (risks)", color: "yellow", emoji: "🪨" },
      { title: "Island (goals)", color: "blue", emoji: "🏝️" },
    ],
  },
];
