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
import { sfxJoin, sfxLeave, sfxJoinRequest } from "./sounds";

interface BoardContextValue {
  board: Board | null;
  participant: Participant | null;
  loading: boolean;
  error: string | null;
  kicked: boolean;
  newJoinName: string | null;
  leftName: string | null;
  roomClosed: boolean;
  pendingRequestId: string | null;
  joinRejected: boolean;
  leaveBoard: () => Promise<void>;
  joinBoard: (name: string, userId?: string) => Promise<void>;
  approveJoin: (requestId: string) => Promise<void>;
  rejectJoin: (requestId: string) => Promise<void>;
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
  moveColumn: (columnId: string, direction: "left" | "right") => Promise<void>;
  reorderColumn: (columnId: string, toIndex: number) => Promise<void>;
  kickParticipant: (participantId: string) => Promise<void>;
  toggleAnonymous: () => Promise<void>;
  reactToCard: (columnId: string, cardId: string, emoji: string) => Promise<void>;
  assignHost: (newHostId: string) => Promise<void>;
  sendMessage: (text: string, toId?: string, toName?: string, replyToId?: string, replyToText?: string, replyToAuthor?: string) => Promise<void>;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  unreadCount: number;
  totalVotesByMe: number;
  reopenSession: () => Promise<void>;
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
  const [leftName, setLeftName] = useState<string | null>(null);
  const [roomClosed, setRoomClosed] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [joinRejected, setJoinRejected] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevMessageCountRef = useRef(0);
  const chatOpenRef = useRef(false);
  const prevParticipantIdsRef = useRef<Set<string> | null>(null);
  const prevParticipantsRef = useRef<Participant[]>([]);
  const prevPendingIdsRef = useRef<Set<string> | null>(null);
  const newJoinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leftNameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

      // Detect new participants joining (active only)
      if (prevParticipantIdsRef.current) {
        const prevIds = prevParticipantIdsRef.current;
        const active = data.participants.filter((p) => !p.left);
        const newPeople = active.filter((p) => !prevIds.has(p.id));
        if (newPeople.length > 0) {
          const name = newPeople[newPeople.length - 1].name;
          setNewJoinName(name);
          sfxJoin();
          if (newJoinTimeoutRef.current) clearTimeout(newJoinTimeoutRef.current);
          newJoinTimeoutRef.current = setTimeout(() => setNewJoinName(null), 3000);
        }

        // Detect participants who left (skip the current user — handled separately)
        const stored = sessionStorage.getItem(`retro-participant-${boardId}`);
        const myId = stored ? (() => { try { return JSON.parse(stored)?.id; } catch { return null; } })() : null;
        const currentActiveIds = new Set(active.map((p) => p.id));
        const leftPeople = prevParticipantsRef.current.filter(
          (p) => !currentActiveIds.has(p.id) && p.id !== myId
        );
        if (leftPeople.length > 0) {
          const name = leftPeople[leftPeople.length - 1].name;
          setLeftName(name);
          sfxLeave();
          if (leftNameTimeoutRef.current) clearTimeout(leftNameTimeoutRef.current);
          leftNameTimeoutRef.current = setTimeout(() => setLeftName(null), 4000);
        }
      }
      const activeParticipants = data.participants.filter((p) => !p.left);
      prevParticipantIdsRef.current = new Set(activeParticipants.map((p) => p.id));
      prevParticipantsRef.current = activeParticipants;

      // Detect new pending join requests (host only)
      const pending = data.pendingJoinRequests || [];
      if (prevPendingIdsRef.current) {
        const prevPending = prevPendingIdsRef.current;
        const newRequests = pending.filter((r) => !prevPending.has(r.id));
        if (newRequests.length > 0) {
          sfxJoinRequest();
        }
      }
      prevPendingIdsRef.current = new Set(pending.map((r) => r.id));

      // Track unread chat messages
      const msgCount = (data.messages || []).length;
      if (msgCount > prevMessageCountRef.current) {
        const newMsgCount = msgCount - prevMessageCountRef.current;
        if (!chatOpenRef.current) {
          setUnreadCount((prev) => prev + newMsgCount);
        }
      }
      prevMessageCountRef.current = msgCount;

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

      // Detect if board was closed by host
      if (data.closed) {
        setRoomClosed(true);
        setParticipant(null);
        sessionStorage.removeItem(`retro-participant-${boardId}`);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        // Detect if pending join request was approved or rejected
        const pendingId = sessionStorage.getItem(`retro-pending-${boardId}`);
        if (pendingId) {
          const approvedP = data.participants.find((p) => p.id === pendingId && !p.left);
          if (approvedP) {
            // Approved — set as participant
            setParticipant(approvedP);
            sessionStorage.setItem(`retro-participant-${boardId}`, JSON.stringify(approvedP));
            sessionStorage.removeItem(`retro-pending-${boardId}`);
            setPendingRequestId(null);
            setJoinRejected(false);
          } else if (!(data.pendingJoinRequests || []).some((r) => r.id === pendingId)) {
            // Not in participants and not in pending → rejected
            sessionStorage.removeItem(`retro-pending-${boardId}`);
            setPendingRequestId(null);
            setJoinRejected(true);
          }
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
    // Restore pending request ID if waiting for approval
    const pendingId = sessionStorage.getItem(`retro-pending-${boardId}`);
    if (pendingId) {
      setPendingRequestId(pendingId);
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
    async (name: string, userId?: string) => {
      const result = await patchBoard({ action: "join", participantName: name, ...(userId ? { userId } : {}) });
      if (result.pending) {
        // Pending approval — store request ID and wait for host
        setPendingRequestId(result.requestId);
        setJoinRejected(false);
        sessionStorage.setItem(`retro-pending-${boardId}`, result.requestId);
      } else {
        // Auto-joined (first user becomes host)
        const p = result.participant;
        setParticipant(p);
        setBoard(result.board);
        sessionStorage.setItem(`retro-participant-${boardId}`, JSON.stringify(p));
      }
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

  const moveColumn = useCallback(
    async (columnId: string, direction: "left" | "right") => {
      await patchBoard({ action: "move-column", columnId, direction });
    },
    [patchBoard]
  );

  const reorderColumn = useCallback(
    async (columnId: string, toIndex: number) => {
      await patchBoard({ action: "reorder-column", columnId, toIndex });
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

  const leaveBoard = useCallback(async () => {
    if (!participant) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    sessionStorage.removeItem(`retro-participant-${boardId}`);
    await fetch(`/api/boards/${boardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "leave", participantId: participant.id }),
    });
  }, [boardId, participant]);

  const approveJoin = useCallback(
    async (requestId: string) => {
      await patchBoard({ action: "approve-join", requestId, requesterId: participant?.id });
    },
    [patchBoard, participant]
  );

  const rejectJoin = useCallback(
    async (requestId: string) => {
      await patchBoard({ action: "reject-join", requestId, requesterId: participant?.id });
    },
    [patchBoard, participant]
  );

  const assignHost = useCallback(async (newHostId: string) => {
    if (!participant) return;
    await fetch(`/api/boards/${boardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "assign-host", newHostId, requesterId: participant.id }),
    });
  }, [boardId, participant]);

  const sendMessage = useCallback(
    async (text: string, toId?: string, toName?: string, replyToId?: string, replyToText?: string, replyToAuthor?: string) => {
      await patchBoard({
        action: "send-message",
        participantId: participant?.id,
        participantName: participant?.name,
        text,
        ...(toId && toName ? { toId, toName } : {}),
        ...(replyToId && replyToText && replyToAuthor ? { replyToId, replyToText, replyToAuthor } : {}),
      });
    },
    [patchBoard, participant]
  );

  const handleSetChatOpen = useCallback((open: boolean) => {
    setChatOpen(open);
    chatOpenRef.current = open;
    if (open) setUnreadCount(0);
  }, []);

  // Fire leave when user closes tab / navigates away
  useEffect(() => {
    if (!participant) return;
    const pid = participant.id;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    const handleUnload = () => {
      navigator.sendBeacon(
        `/api/boards/${boardId}`,
        new Blob(
          [JSON.stringify({ action: "leave", participantId: pid })],
          { type: "application/json" }
        )
      );
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [boardId, participant]);

  const reopenSession = useCallback(async () => {
    await patchBoard({ action: "reopen-session" });
    setRoomClosed(false);
    // Restart polling
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchBoard, 2000);
    fetchBoard();
  }, [patchBoard, fetchBoard]);

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
        roomClosed,
        newJoinName,
        leftName,
        pendingRequestId,
        joinRejected,
        joinBoard,
        approveJoin,
        rejectJoin,
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
        moveColumn,
        reorderColumn,
        kickParticipant,
        toggleAnonymous,
        reactToCard,
        leaveBoard,
        assignHost,
        sendMessage,
        chatOpen,
        setChatOpen: handleSetChatOpen,
        unreadCount,
        totalVotesByMe,
        reopenSession,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}
