"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBoardContext } from "@/lib/board-context";
import type { BoardPhase } from "@/lib/types";
import { sfxTick, sfxTimerDone, sfxPhaseChange } from "@/lib/sounds";
import { exportBoardToExcel } from "@/lib/export-board";
import { FluentEmoji } from "@/lib/fluent-emoji";
import {
  LayoutGrid,
  Users,
  Timer,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Copy,
  Check,
  X,
  Download,
  LogOut,
  UserPlus,
  UserX,
  MessageCircle,
} from "lucide-react";

const PHASES: { key: BoardPhase; label: string; emoji: string; description: string }[] = [
  { key: "writing", label: "Write", emoji: "📝", description: "Add your thoughts to each column" },
  { key: "grouping", label: "Organize", emoji: "🧩", description: "Drag similar cards together" },
  { key: "voting", label: "Vote", emoji: "💯", description: "Vote on the most important items" },
  { key: "discussing", label: "Discuss", emoji: "💬", description: "Talk through the top-voted items" },
  { key: "done", label: "Done", emoji: "✅", description: "Summary of the retrospective" },
];

export function BoardHeader() {
  const { board, participant, setPhase, setTimer, totalVotesByMe, kickParticipant, leaveBoard, assignHost, approveJoin, rejectJoin, chatOpen, setChatOpen, unreadCount } =
    useBoardContext();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [localRemaining, setLocalRemaining] = useState(board?.timer.remaining ?? 300);
  const [editingTimer, setEditingTimer] = useState(false);
  const [timerInputMin, setTimerInputMin] = useState("");
  const [timerInputSec, setTimerInputSec] = useState("");
  const timerInputRef = useRef<HTMLInputElement>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [assigningHost, setAssigningHost] = useState(false);

  // Sync local timer with server
  useEffect(() => {
    if (board) setLocalRemaining(board.timer.remaining);
  }, [board?.timer.remaining]);

  // Client-side countdown
  useEffect(() => {
    if (board?.timer.running) {
      timerRef.current = setInterval(() => {
        setLocalRemaining((prev) => {
          if (prev <= 1) {
            // Timer just finished — auto-advance
            sfxTimerDone();
            const idx = PHASES.findIndex((p) => p.key === board.phase);
            const next = PHASES[idx + 1];
            if (next) {
              setPhase(next.key);
              setTimer({ running: false, remaining: board.timer.total });
            } else {
              setTimer({ running: false, remaining: 0 });
            }
            return 0;
          }
          if (prev <= 6) sfxTick(); // tick for last 5 seconds
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [board?.timer.running, board?.phase, board?.timer.total, setPhase, setTimer]);

  if (!board) return null;

  const minutes = Math.floor(localRemaining / 60);
  const seconds = localRemaining % 60;

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTimer = () => {
    if (board.timer.running) {
      setTimer({ running: false, remaining: localRemaining });
    } else {
      setTimer({ running: true });
    }
  };

  const resetTimer = () => {
    setTimer({ running: false, remaining: board.timer.total });
    setLocalRemaining(board.timer.total);
  };

  const startEditingTimer = () => {
    if (board.timer.running) return;
    setTimerInputMin(String(Math.floor(localRemaining / 60)));
    setTimerInputSec(String(localRemaining % 60));
    setEditingTimer(true);
    setTimeout(() => timerInputRef.current?.select(), 0);
  };

  const commitTimerEdit = () => {
    const mins = Math.max(0, Math.min(99, parseInt(timerInputMin, 10) || 0));
    const secs = Math.max(0, Math.min(59, parseInt(timerInputSec, 10) || 0));
    const total = Math.max(5, mins * 60 + secs);
    setTimer({ running: false, remaining: total, total } as any);
    setLocalRemaining(total);
    setEditingTimer(false);
  };

  const currentPhaseIdx = PHASES.findIndex((p) => p.key === board.phase);
  const currentPhase = PHASES[currentPhaseIdx];
  const nextPhase = PHASES[currentPhaseIdx + 1];
  const prevPhase = PHASES[currentPhaseIdx - 1];
  const isHost = participant?.id === board.hostId;

  const otherParticipants = board?.participants.filter((p) => p.id !== participant?.id && !p.left) ?? [];

  const handleLeave = () => {
    if (isHost) {
      setAssigningHost(false);
      setShowLeaveModal(true);
    } else {
      leaveBoard().then(() => router.push("/"));
    }
  };

  const handleEndSession = async () => {
    setShowLeaveModal(false);
    await leaveBoard();
    router.push("/");
  };

  const handleTransferHost = async (newHostId: string) => {
    setShowLeaveModal(false);
    setAssigningHost(false);
    await assignHost(newHostId);
    await leaveBoard();
    router.push("/");
  };

  const isRunning = board.timer.running;
  const pct = board.timer.total > 0 ? (localRemaining / board.timer.total) * 100 : 100;
  const isUrgent = isRunning && localRemaining <= 30 && localRemaining > 10;
  const isCritical = isRunning && localRemaining <= 10 && localRemaining > 0;
  const isExpired = isRunning && localRemaining <= 0;

  return (
    <>
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      {/* Countdown progress bar at the very top */}
      {isRunning && (
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
          <div
            className={`timer-progress-bar h-full rounded-r-full ${
              isCritical ? "bg-red-500" : isUrgent ? "bg-orange-400" : "bg-linear-to-r from-indigo-500 to-purple-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      {/* Top bar — board name, timer, participants, share */}
      <div className={`flex flex-wrap items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border-b border-border/50 ${isRunning ? "pt-3" : ""}`}>
        {/* Logo + board name */}
        <div className="flex items-center gap-2 mr-auto min-w-0">
          <LayoutGrid className="size-4 sm:size-5 text-primary shrink-0" />
          <h1 className="font-bold text-sm sm:text-base truncate max-w-32 sm:max-w-55 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {board.name}
          </h1>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all bg-background/60 ${
          isCritical ? "animate-timer-critical border-red-500 shadow-lg shadow-red-500/20"
            : isUrgent ? "animate-timer-urgent border-orange-400 shadow-md shadow-orange-400/10"
            : "border-border"
        }`}>
          <Timer className={`size-4 ${isUrgent || isCritical ? "text-red-500" : "text-muted-foreground"}`} />
          {editingTimer ? (
            <form
              onSubmit={(e) => { e.preventDefault(); commitTimerEdit(); }}
              className="flex items-center gap-1 animate-pop-in"
            >
              <input
                ref={timerInputRef}
                type="number"
                min={0}
                max={99}
                value={timerInputMin}
                onChange={(e) => setTimerInputMin(e.target.value)}
                className="w-9 rounded border border-border bg-background px-1 py-0.5 text-center font-mono text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="font-mono text-sm font-semibold">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={timerInputSec}
                onChange={(e) => setTimerInputSec(e.target.value)}
                onBlur={commitTimerEdit}
                className="w-9 rounded border border-border bg-background px-1 py-0.5 text-center font-mono text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </form>
          ) : (
            <button
              onClick={isHost ? startEditingTimer : undefined}
              disabled={board.timer.running || !isHost}
              title={!isHost ? "Only the host can edit the timer" : board.timer.running ? "Pause to edit" : "Click to change duration"}
              className={`font-mono text-sm font-semibold tabular-nums transition-colors ${
                isCritical
                  ? "text-red-600 animate-timer-pulse text-base"
                  : isUrgent
                  ? "text-red-500"
                  : ""
              } ${!isRunning && isHost ? "hover:text-primary cursor-pointer" : ""}`}
            >
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </button>
          )}
          <button
            onClick={isHost ? toggleTimer : undefined}
            className={`rounded-md p-1 transition-colors ${isHost ? 'hover:bg-muted' : 'opacity-50 cursor-default'}`}
            title={isHost ? (board.timer.running ? "Pause" : "Start") : "Only the host can control the timer"}
          >
            {board.timer.running ? (
              <Pause className="size-3.5" />
            ) : (
              <Play className="size-3.5" />
            )}
          </button>
          <button
            onClick={isHost ? resetTimer : undefined}
            className={`rounded-md p-1 transition-colors ${isHost ? 'hover:bg-muted' : 'opacity-50 cursor-default'}`}
            title={isHost ? "Reset timer" : "Only the host can control the timer"}
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>

        {/* Vote count */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background/60 px-3 py-1.5 text-sm text-muted-foreground">
          <span>🗳️</span>
          <span className="font-semibold tabular-nums">
            {totalVotesByMe}/{board.maxVotesPerUser}
          </span>
        </div>

        {/* Participants */}
        <div className="relative">
          <button
            onClick={() => setShowParticipants((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-xl border border-border bg-background/60 px-3 py-1.5"
          >
            <Users className="size-4" />
            <span className="font-medium">{board.participants.filter((p) => !p.left).length}</span>
            {isHost && (board.pendingJoinRequests || []).length > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white animate-pulse">
                {board.pendingJoinRequests.length}
              </span>
            )}
          </button>
          {showParticipants && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowParticipants(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-border bg-background shadow-lg animate-fade-in-scale">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <span className="text-xs font-semibold text-muted-foreground">Participants ({board.participants.filter((p) => !p.left).length})</span>
                  <button onClick={() => setShowParticipants(false)} className="rounded p-0.5 hover:bg-muted">
                    <X className="size-3.5 text-muted-foreground" />
                  </button>
                </div>
                <ul className="max-h-60 overflow-y-auto py-1">
                  {board.participants.filter((p) => !p.left).map((p) => {
                    const isMe = p.id === participant?.id;
                    return (
                      <li key={p.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/50 transition-colors">
                        <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="flex-1 truncate text-sm">
                          {p.name}
                          {p.id === board.hostId && (
                            <span className="ml-1 rounded bg-primary/10 px-1 py-0.5 text-[10px] font-semibold text-primary">Host</span>
                          )}
                          {isMe && (
                            <span className="ml-1 text-xs text-muted-foreground">(you)</span>
                          )}
                        </span>
                        {isHost && !isMe && (
                          <button
                            onClick={() => kickParticipant(p.id)}
                            className="rounded p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title={`Remove ${p.name}`}
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {/* Pending join requests — visible to host only */}
                {isHost && (board.pendingJoinRequests || []).length > 0 && (
                  <>
                    <div className="flex items-center justify-between px-3 py-2 border-t border-border">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        Pending requests ({board.pendingJoinRequests.length})
                      </span>
                    </div>
                    <ul className="max-h-40 overflow-y-auto py-1">
                      {board.pendingJoinRequests.map((req) => (
                        <li key={req.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/50 transition-colors">
                          <span className="flex size-6 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-600 dark:text-amber-400">
                            {req.name.charAt(0).toUpperCase()}
                          </span>
                          <span className="flex-1 truncate text-sm text-muted-foreground">
                            {req.name}
                          </span>
                          <button
                            onClick={() => approveJoin(req.id)}
                            className="rounded p-1 text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
                            title={`Approve ${req.name}`}
                          >
                            <UserPlus className="size-3.5" />
                          </button>
                          <button
                            onClick={() => rejectJoin(req.id)}
                            className="rounded p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title={`Reject ${req.name}`}
                          >
                            <UserX className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Chat */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 sm:px-3 text-sm font-medium transition-all relative ${
            chatOpen
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border bg-background/60 hover:bg-muted"
          }`}
          title="Chat"
        >
          <MessageCircle className="size-3.5" />
          <span className="hidden sm:inline">Chat</span>
          {unreadCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Share link */}
        <button
          onClick={copyLink}
          className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 sm:px-3 text-sm font-medium transition-all ${
            copied
              ? "border-green-500/50 bg-green-50 text-green-600 dark:bg-green-950/30"
              : "border-border bg-background/60 hover:bg-muted"
          }`}
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>

        {/* Export (host only) */}
        {isHost && (
          <button
            onClick={() => exportBoardToExcel(board)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background/60 px-2.5 py-1.5 sm:px-3 text-sm font-medium hover:bg-muted transition-colors"
            title="Export board to Excel"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        )}

        {/* Leave session */}
        {participant && (
          <button
            onClick={handleLeave}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background/60 px-2.5 py-1.5 sm:px-3 text-sm font-medium text-muted-foreground hover:border-red-400/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title={isHost ? "Close session (you are the host)" : "Leave session"}
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        )}
      </div>
      <div className="px-3 py-3 sm:px-6 sm:py-4">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {PHASES.map((phase, idx) => {
            const isActive = idx === currentPhaseIdx;
            const isDone = idx < currentPhaseIdx;
            return (
              <div key={phase.key} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={isHost ? () => { sfxPhaseChange(); setPhase(phase.key); } : undefined}
                  className={`flex items-center gap-1.5 sm:gap-2.5 rounded-xl px-1.5 sm:px-3 py-1.5 transition-all ${
                    isActive ? "" : isHost ? "hover:bg-muted cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className={`flex size-7 sm:size-10 items-center justify-center rounded-full text-xs sm:text-base font-bold transition-all ${
                      isActive
                        ? "bg-linear-to-br from-indigo-500 to-purple-500 text-white shadow-md ring-2 ring-indigo-500/30"
                        : isDone
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? "✓" : isActive ? <FluentEmoji emoji={phase.emoji} size="1.5rem" /> : idx + 1}
                  </span>
                  <div className="hidden sm:block text-left">
                    <div
                      className={`text-sm font-semibold leading-tight ${
                        isActive ? "bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" : isDone ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      {phase.label}
                    </div>
                  </div>
                </button>
                {/* Connector line */}
                {idx < PHASES.length - 1 && (
                  <div className="mx-0.5 sm:mx-2 h-0.5 sm:h-1 flex-1 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-green-500 to-green-400 transition-all duration-300"
                      style={{ width: idx < currentPhaseIdx ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current phase banner */}
        <div key={board.phase} className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-xl bg-linear-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 px-3 sm:px-4 py-2.5 animate-fade-in-scale">
          <FluentEmoji emoji={currentPhase.emoji} size="3.5rem" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Step {currentPhaseIdx + 1} of {PHASES.length}: {currentPhase.label}
            </p>
            <p className="hidden sm:block text-xs text-muted-foreground">{currentPhase.description}</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            {prevPhase && isHost && (
              <button
                onClick={() => { sfxPhaseChange(); setPhase(prevPhase.key); }}
                className="rounded-xl border border-border px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                ← Back
              </button>
            )}
            {nextPhase && isHost && (
              <button
                onClick={() => { sfxPhaseChange(); setPhase(nextPhase.key); }}
                className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl bg-primary px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
              >
                <span className="hidden sm:inline">Next: </span>{nextPhase.label}
                <ChevronRight className="size-3.5" />
              </button>
            )}
            {!nextPhase && (
              <span className="rounded-xl bg-green-500/10 border border-green-500/30 px-2.5 py-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                ✅ Complete!
              </span>
            )}
          </div>
        </div>
      </div>
    </header>

      {/* Host-leave modal */}
      {showLeaveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLeaveModal(false)}
        >
          <div
            className="bg-background rounded-2xl border border-border shadow-xl w-full max-w-sm mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {!assigningHost ? (
              <>
                <div className="mb-4">
                  <h2 className="text-base font-semibold">You&apos;re the host</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    What would you like to do before leaving?
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {otherParticipants.length > 0 && (
                    <button
                      onClick={() => setAssigningHost(true)}
                      className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors text-left"
                    >
                      <Users className="size-4 text-primary shrink-0" />
                      <span>Assign a new host and leave</span>
                    </button>
                  )}
                  <button
                    onClick={handleEndSession}
                    className="flex items-center gap-2 rounded-xl border border-red-300 bg-background px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                  >
                    <LogOut className="size-4 shrink-0" />
                    <span>End session for everyone</span>
                  </button>
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-base font-semibold">Choose a new host</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a participant to take over as host:
                  </p>
                </div>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mb-4">
                  {otherParticipants.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleTransferHost(p.id)}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted hover:border-primary/40 transition-colors text-left"
                    >
                      <span className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {p.name.charAt(0).toUpperCase()}
                      </span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setAssigningHost(false)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
