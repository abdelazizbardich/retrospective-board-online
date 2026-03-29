"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Board, BoardPhase, Participant } from "./types";
import { sfxJoin } from "./sounds";

interface BoardContextValue {
  board: Board | null;
  participant: Participant | null;
  loading: boolean;
  error: string | null;
  kicked: boolean;
  newJoinName: string | null;
  joinBoard: (name: string) => Promise<void>;
  addCard: (columnId: string, text: string, anonymous?: boolean) => Promise<void>;
  editCard: (columnId: string, cardId: string, text: string) => Promise<void>;
  deleteCard: (columnId: string, cardId: string) => Promise<void>;
  vote: (columnId: string, cardId: string) => Promise<void>;
  unvote: (columnId: string, cardId: string) => Promise<void>;
  setPhase: (phase: BoardPhase) => Promise<void>;
  setTimer: (opts: { remaining?: number; total?: number; running?: boolean }) => Promise<void>;
  addColumn: (title: string, color: string, emoji: string) => Promise<void>;
  editColumn: (columnId: string, opts: { title?: string; color?: string; emoji?: string }) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string) => Promise<void>;
  kickParticipant: (participantId: string) => Promise<void>;
  toggleAnonymous: () => Promise<void>;
  reactToCard: (columnId: string, cardId: string, emoji: string) => Promise<void>;
  totalVotesByMe: number;
}

const BoardContext = createContext<BoardContextValue | null>(null);

export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoardContext must be used inside BoardProvider");
  return ctx;
}

export function BoardProvider({
  boardId,
  children,
}: {
  boardId: string;
  children: React.ReactNode;
}) {
  const [board, setBoard] = useState<Board | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kicked, setKicked] = useState(false);
  const [newJoinName, setNewJoinName] = useState<string | null>(null);
  const prevParticipantIdsRef = useRef<Set<string> | null>(null);
  const newJoinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch board
  const fetchBoard = useCallback(async () => {
    try {
      const res = await fetch(`/api/boards/${boardId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Board not found");
        }
        return;
      }
      const data: Board = await res.json();

      // Detect new participants joining
      if (prevParticipantIdsRef.current) {
        const prevIds = prevParticipantIdsRef.current;
        const newPeople = data.participants.filter((p) => !prevIds.has(p.id));
        if (newPeople.length > 0) {
          const name = newPeople[newPeople.length - 1].name;
          setNewJoinName(name);
          sfxJoin();
          if (newJoinTimeoutRef.current) clearTimeout(newJoinTimeoutRef.current);
          newJoinTimeoutRef.current = setTimeout(() => setNewJoinName(null), 3000);
        }
      }
      prevParticipantIdsRef.current = new Set(data.participants.map((p) => p.id));

      setBoard(data);
      setError(null);

      // Track this board in localStorage for "recent boards" on the home page
      try {
        const key = "retro-recent-boards";
        const existing: { id: string; name: string; visitedAt: number }[] = JSON.parse(
          localStorage.getItem(key) || "[]"
        );
        const filtered = existing.filter((b) => b.id !== data.id);
        filtered.unshift({ id: data.id, name: data.name, visitedAt: Date.now() });
        localStorage.setItem(key, JSON.stringify(filtered.slice(0, 20)));
      } catch {
        // localStorage not available (SSR, private browsing)
      }

      // Detect if current participant was kicked
      const stored = sessionStorage.getItem(`retro-participant-${boardId}`);
      if (stored) {
        try {
          const p: Participant = JSON.parse(stored);
          if (!data.participants.some((pp) => pp.id === p.id)) {
            setKicked(true);
            setParticipant(null);
            sessionStorage.removeItem(`retro-participant-${boardId}`);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        } catch {
          // ignore
        }
      }
    } catch {
      setError("Failed to load board");
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  // Initial fetch + polling every 2s
  useEffect(() => {
    fetchBoard();
    intervalRef.current = setInterval(fetchBoard, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchBoard]);

  // Load participant from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem(`retro-participant-${boardId}`);
    if (stored) {
      try {
        setParticipant(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, [boardId]);

  const patchBoard = useCallback(
    async (body: Record<string, unknown>) => {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }
      const result = await res.json();
      // If join, return full result with participant
      if (body.action === "join") return result;
      // Some actions return a non-board response (e.g. { ok: true }) — don't overwrite board state
      if (result && result.id && result.columns) {
        setBoard(result);
      }
      return result;
    },
    [boardId]
  );

  const joinBoard = useCallback(
    async (name: string) => {
      const result = await patchBoard({ action: "join", participantName: name });
      const p = result.participant;
      setParticipant(p);
      setBoard(result.board);
      sessionStorage.setItem(`retro-participant-${boardId}`, JSON.stringify(p));
    },
    [patchBoard, boardId]
  );

  const addCard = useCallback(
    async (columnId: string, text: string, anonymous?: boolean) => {
      await patchBoard({
        action: "add-card",
        columnId,
        text,
        authorId: participant?.id || "anonymous",
        anonymous: anonymous ?? false,
      });
    },
    [patchBoard, participant]
  );

  const editCard = useCallback(
    async (columnId: string, cardId: string, text: string) => {
      await patchBoard({ action: "edit-card", columnId, cardId, text });
    },
    [patchBoard]
  );

  const deleteCard = useCallback(
    async (columnId: string, cardId: string) => {
      await patchBoard({ action: "delete-card", columnId, cardId });
    },
    [patchBoard]
  );

  const vote = useCallback(
    async (columnId: string, cardId: string) => {
      await patchBoard({
        action: "vote",
        columnId,
        cardId,
        participantId: participant?.id,
      });
    },
    [patchBoard, participant]
  );

  const unvote = useCallback(
    async (columnId: string, cardId: string) => {
      await patchBoard({
        action: "unvote",
        columnId,
        cardId,
        participantId: participant?.id,
      });
    },
    [patchBoard, participant]
  );

  const setPhase = useCallback(
    async (phase: BoardPhase) => {
      await patchBoard({ action: "set-phase", phase });
    },
    [patchBoard]
  );

  const setTimer = useCallback(
    async (opts: { remaining?: number; total?: number; running?: boolean }) => {
      await patchBoard({ action: "set-timer", ...opts });
    },
    [patchBoard]
  );

  const addColumn = useCallback(
    async (title: string, color: string, emoji: string) => {
      await patchBoard({ action: "add-column", title, color, emoji });
    },
    [patchBoard]
  );

  const editColumn = useCallback(
    async (columnId: string, opts: { title?: string; color?: string; emoji?: string }) => {
      await patchBoard({ action: "edit-column", columnId, ...opts });
    },
    [patchBoard]
  );

  const deleteColumn = useCallback(
    async (columnId: string) => {
      await patchBoard({ action: "delete-column", columnId });
    },
    [patchBoard]
  );

  const moveCard = useCallback(
    async (cardId: string, fromColumnId: string, toColumnId: string) => {
      if (fromColumnId === toColumnId) return;
      await patchBoard({ action: "move-card", cardId, fromColumnId, toColumnId });
    },
    [patchBoard]
  );

  const kickParticipant = useCallback(
    async (participantId: string) => {
      await patchBoard({ action: "kick-participant", participantId, requesterId: participant?.id });
    },
    [patchBoard, participant]
  );

  const toggleAnonymous = useCallback(
    async () => {
      await patchBoard({ action: "toggle-anonymous", participantId: participant?.id });
    },
    [patchBoard, participant]
  );

  const reactToCard = useCallback(
    async (columnId: string, cardId: string, emoji: string) => {
      await patchBoard({ action: "react", columnId, cardId, emoji, participantId: participant?.id });
    },
    [patchBoard, participant]
  );

  const totalVotesByMe = board
    ? board.columns
        .flatMap((c) => c.cards)
        .flatMap((c) => c.votes)
        .filter((v) => v === participant?.id).length
    : 0;

  return (
    <BoardContext.Provider
      value={{
        board,
        participant,
        loading,
        error,
        kicked,
        newJoinName,
        joinBoard,
        addCard,
        editCard,
        deleteCard,
        vote,
        unvote,
        setPhase,
        setTimer,
        addColumn,
        editColumn,
        deleteColumn,
        moveCard,
        kickParticipant,
        toggleAnonymous,
        reactToCard,
        totalVotesByMe,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}
