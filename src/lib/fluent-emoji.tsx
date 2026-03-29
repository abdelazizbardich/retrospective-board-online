"use client";

import React from "react";
import { Flat } from "react-fluentui-emoji";

type FluentEmojiProps = {
  emoji: string;
  size?: string | number;
  className?: string;
};

// Map from unicode emoji character to FluentUI flat icon component
const EMOJI_MAP: Record<string, React.ComponentType<{ size?: string; className?: string }>> = {
  // Phase emojis
  "📝": Flat.IconFMemo,
  "🧩": Flat.IconFPuzzlePiece,
  "💯": Flat.IconFHundredPoints,
  "💬": Flat.IconFSpeechBalloon,
  "⚡": Flat.IconFHighVoltage,

  // Reaction emojis
  "😢": Flat.IconFCryingFace,
  "😄": Flat.IconFGrinningFaceWithSmilingEyes,
  "😮": Flat.IconFFaceWithOpenMouth,
  "😡": Flat.IconFPoutingFace,
  "😜": Flat.IconFWinkingFaceWithTongue,

  // Board template column emojis
  "✅": Flat.IconFCheckMarkButton,
  "❌": Flat.IconFCrossMark,
  "🎯": Flat.IconFBullseye,
  "💚": Flat.IconFGreenHeart,
  "📘": Flat.IconFBlueBook,
  "🔴": Flat.IconFRedCircle,
  "💜": Flat.IconFPurpleHeart,
  "🚀": Flat.IconFRocket,
  "🛑": Flat.IconFStopSign,
  "➡️": Flat.IconFRightArrow,
  "😊": Flat.IconFSmilingFaceWithSmilingEyes,
  "💨": Flat.IconFDashingAway,
  "⚓": Flat.IconFAnchor,
  "🪨": Flat.IconFRock,
  "🏝️": Flat.IconFDesertIsland,
};

/**
 * Renders a Fluent UI emoji image for known emojis.
 * Falls back to plain unicode text for unknown emojis.
 */
export function FluentEmoji({ emoji, size = "1.25rem", className }: FluentEmojiProps) {
  const sizeStr = typeof size === "number" ? `${size}px` : size;
  const Icon = EMOJI_MAP[emoji];
  if (Icon) {
    return <Icon size={sizeStr} className={className} />;
  }
  // Fallback: render plain emoji text
  return <span className={className}>{emoji}</span>;
}
