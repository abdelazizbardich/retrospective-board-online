"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useBoardContext } from "@/lib/board-context";
import { X, Send, Users, Lock, Hash, ThumbsUp } from "lucide-react";

const STRIPE_COLORS: Record<string, string> = {
  green: "bg-green-400 dark:bg-green-500",
  red: "bg-red-400 dark:bg-red-500",
  blue: "bg-blue-400 dark:bg-blue-500",
  yellow: "bg-yellow-400 dark:bg-yellow-500",
  purple: "bg-purple-400 dark:bg-purple-500",
};

/** Scroll to a card on the board and flash-highlight it */
function scrollToCard(cardId: string) {
  const el = document.getElementById(`card-${cardId}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.remove("animate-highlight-card");
  void el.offsetWidth;
  el.classList.add("animate-highlight-card");
  el.addEventListener("animationend", () => el.classList.remove("animate-highlight-card"), { once: true });
}

interface CardInfo {
  text: string;
  emoji: string;
  columnTitle: string;
  color: string;
  votes: number;
  authorName: string | null;
}

/** Render message text, replacing [card:id] tokens with card snapshots */
function ChatMessageText({ text, cards, isMe }: { text: string; cards: Map<string, CardInfo>; isMe: boolean }) {
  const parts = text.split(/(\[card:[^\]]+\])/g);
  // Check if the entire message is just a single card tag (possibly with whitespace)
  const trimmed = text.trim();
  const soloMatch = trimmed.match(/^\[card:([^\]]+)\]$/);

  if (soloMatch) {
    // Render as a standalone card snapshot block
    const card = cards.get(soloMatch[1]);
    if (card) {
      const stripe = STRIPE_COLORS[card.color] || STRIPE_COLORS.blue;
      return (
        <button
          onClick={() => scrollToCard(soloMatch[1])}
          className="w-full text-left cursor-pointer group/card"
          title="Click to find this card on the board"
        >
          <div className="flex rounded-xl bg-white dark:bg-zinc-900 border border-border/60 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`w-1 shrink-0 ${stripe}`} />
            <div className="flex-1 px-3 py-2.5 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{card.emoji}</span>
                <span className="text-[10px] font-medium text-muted-foreground truncate">{card.columnTitle}</span>
              </div>
              <p className="text-sm leading-snug line-clamp-3">{card.text}</p>
              <div className="flex items-center gap-3 mt-1.5">
                {card.votes > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <ThumbsUp className="size-2.5" />
                    {card.votes}
                  </span>
                )}
                {card.authorName && (
                  <span className="text-[10px] text-muted-foreground truncate">by {card.authorName}</span>
                )}
              </div>
            </div>
          </div>
        </button>
      );
    }
    return <span className="text-muted-foreground italic text-xs">[deleted card]</span>;
  }

  // Mixed text + card tags — render inline
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[card:([^\]]+)\]$/);
        if (match) {
          const card = cards.get(match[1]);
          if (card) {
            const stripe = STRIPE_COLORS[card.color] || STRIPE_COLORS.blue;
            return (
              <button
                key={i}
                onClick={() => scrollToCard(match[1])}
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium align-middle mx-0.5 transition-all cursor-pointer max-w-48 ${
                  isMe
                    ? "border-white/20 bg-white/15 hover:bg-white/25"
                    : "border-border/60 bg-background hover:bg-muted"
                }`}
                title={`Go to: ${card.text}`}
              >
                <span className={`w-0.5 h-3.5 rounded-full shrink-0 ${stripe}`} />
                <span className="truncate">{card.text}</span>
              </button>
            );
          }
          return <span key={i} className="text-muted-foreground italic text-xs">[deleted card]</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function ChatDrawer() {
  const { board, participant, sendMessage, chatOpen, setChatOpen } = useBoardContext();
  const [text, setText] = useState("");
  const [dmTarget, setDmTarget] = useState<{ id: string; name: string } | null>(null);
  const [showDmPicker, setShowDmPicker] = useState(false);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [cardFilter, setCardFilter] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMsgCountRef = useRef(0);

  // Build a flat card map for rendering tags
  const cardMap = useMemo(() => {
    const map = new Map<string, CardInfo>();
    if (!board) return map;
    for (const col of board.columns) {
      for (const card of col.cards) {
        const author = board.participants.find((p) => p.id === card.authorId);
        map.set(card.id, {
          text: card.text,
          emoji: col.emoji,
          columnTitle: col.title,
          color: col.color,
          votes: card.votes.length,
          authorName: author && !card.anonymous ? author.name : null,
        });
      }
    }
    return map;
  }, [board]);

  // Flat list of all cards for the picker
  const allCards = useMemo(() => {
    if (!board) return [];
    return board.columns.flatMap((col) =>
      col.cards.map((card) => ({ id: card.id, text: card.text, emoji: col.emoji, columnTitle: col.title }))
    );
  }, [board]);

  const filteredCards = useMemo(() => {
    if (!cardFilter) return allCards;
    const q = cardFilter.toLowerCase();
    return allCards.filter((c) => c.text.toLowerCase().includes(q));
  }, [allCards, cardFilter]);

  // Auto-scroll on new messages
  useEffect(() => {
    const count = (board?.messages || []).length;
    if (count > prevMsgCountRef.current && chatOpen) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMsgCountRef.current = count;
  }, [board?.messages?.length, chatOpen]);

  // Focus input when opened
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatOpen]);

  if (!board || !participant) return null;

  const messages = (board.messages || []).filter((m) => {
    // Show general messages + DMs where user is sender or receiver
    if (!m.toId) return true;
    return m.authorId === participant.id || m.toId === participant.id;
  });

  const otherParticipants = board.participants.filter((p) => p.id !== participant.id && !p.left);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    await sendMessage(trimmed, dmTarget?.id, dmTarget?.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showCardPicker) {
      if (e.key === "Escape") {
        e.preventDefault();
        setShowCardPicker(false);
        setCardFilter("");
      }
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
  };

  const insertCardTag = (cardId: string) => {
    setText((prev) => prev + `[card:${cardId}] `);
    setShowCardPicker(false);
    setCardFilter("");
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Backdrop */}
      {chatOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setChatOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          chatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold">Chat</h2>
            {dmTarget ? (
              <button
                onClick={() => setDmTarget(null)}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Lock className="size-3" />
                DM: {dmTarget.name}
                <X className="size-3" />
              </button>
            ) : (
              <p className="text-xs text-muted-foreground">General</p>
            )}
          </div>

          {/* DM picker toggle */}
          <div className="relative">
            <button
              onClick={() => setShowDmPicker((v) => !v)}
              className="rounded-lg border border-border p-1.5 hover:bg-muted transition-colors"
              title="Send a direct message"
            >
              <Users className="size-4 text-muted-foreground" />
            </button>
            {showDmPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDmPicker(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-56 rounded-xl border border-border bg-background shadow-lg animate-fade-in-scale">
                  <div className="px-3 py-2 border-b border-border">
                    <span className="text-xs font-semibold text-muted-foreground">Direct message</span>
                  </div>
                  <button
                    onClick={() => { setDmTarget(null); setShowDmPicker(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${!dmTarget ? "font-semibold text-primary" : ""}`}
                  >
                    <Users className="size-4" />
                    <span>General (everyone)</span>
                  </button>
                  {otherParticipants.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setDmTarget({ id: p.id, name: p.name }); setShowDmPicker(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${dmTarget?.id === p.id ? "font-semibold text-primary" : ""}`}
                    >
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {p.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setChatOpen(false)}
            className="rounded-lg border border-border p-1.5 hover:bg-muted transition-colors"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <span className="text-3xl mb-2">💬</span>
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.authorId === participant.id;
            const isDM = !!msg.toId;
            const isSystem = msg.authorId === "system";

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <span className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground text-center max-w-[90%]">
                    <ChatMessageText text={msg.text} cards={cardMap} isMe={false} />
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {/* Author line */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  {!isMe && (
                    <button
                      onClick={() => { setDmTarget({ id: msg.authorId, name: msg.authorName }); inputRef.current?.focus(); }}
                      className="text-xs font-semibold hover:underline cursor-pointer"
                    >
                      {msg.authorName}
                    </button>
                  )}
                  {isDM && (
                    <span className="flex items-center gap-0.5 text-[10px] text-indigo-500 font-medium">
                      <Lock className="size-2.5" />
                      {isMe ? `to ${msg.toName}` : "DM"}
                    </span>
                  )}
                </div>
                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm break-words ${
                    isMe
                      ? isDM
                        ? "bg-indigo-500 text-white rounded-br-md"
                        : "bg-primary text-primary-foreground rounded-br-md"
                      : isDM
                        ? "bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 rounded-bl-md"
                        : "bg-muted rounded-bl-md"
                  }`}
                >
                  <ChatMessageText text={msg.text} cards={cardMap} isMe={isMe} />
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border px-3 py-3 shrink-0">
          {/* Card picker dropdown */}
          {showCardPicker && (
            <div className="mb-2 rounded-xl border border-border bg-background shadow-lg max-h-48 overflow-y-auto">
              <div className="px-3 py-2 border-b border-border">
                <input
                  type="text"
                  value={cardFilter}
                  onChange={(e) => setCardFilter(e.target.value)}
                  placeholder="Search cards..."
                  autoFocus
                  className="w-full text-xs bg-transparent outline-none placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setShowCardPicker(false);
                      setCardFilter("");
                      inputRef.current?.focus();
                    }
                  }}
                />
              </div>
              {filteredCards.length === 0 ? (
                <div className="px-3 py-3 text-xs text-muted-foreground text-center">No cards found</div>
              ) : (
                filteredCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => insertCardTag(card.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted transition-colors"
                  >
                    <span className="text-sm shrink-0">{card.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{card.text}</p>
                      <p className="text-[10px] text-muted-foreground">{card.columnTitle}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowCardPicker((v) => !v); setCardFilter(""); }}
              className={`flex items-center justify-center rounded-lg border p-2 transition-colors shrink-0 ${
                showCardPicker ? "border-primary/50 bg-primary/10 text-primary" : "border-border hover:bg-muted text-muted-foreground"
              }`}
              title="Tag a card"
            >
              <Hash className="size-4" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={dmTarget ? `DM to ${dmTarget.name}...` : "Type a message..."}
              maxLength={500}
              className={`flex-1 rounded-xl border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                dmTarget
                  ? "border-indigo-300 dark:border-indigo-700 focus:ring-indigo-500/50"
                  : "border-border focus:ring-primary/50"
              }`}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="flex items-center justify-center rounded-xl bg-primary p-2 text-primary-foreground shadow hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
