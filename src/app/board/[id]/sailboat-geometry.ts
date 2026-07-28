/** Region geometry for the illustrated sailboat retrospective canvas. */

export interface SailboatSectionRegion {
  columnIndex: number;
  /** Drop zone as percentage of the canvas */
  left: number;
  top: number;
  width: number;
  height: number;
  /** Label badge position (percent) */
  labelLeft: number;
  labelTop: number;
  /** Where notes cluster within the section (percent) */
  notesLeft: number;
  notesTop: number;
  subtitle: string;
}

export const SAILBOAT_SECTIONS: SailboatSectionRegion[] = [
  {
    columnIndex: 0,
    left: 0,
    top: 0,
    width: 38,
    height: 46,
    labelLeft: 14,
    labelTop: 10,
    notesLeft: 50,
    notesTop: 55,
    subtitle: "What helped us move forward?",
  },
  {
    columnIndex: 1,
    left: 58,
    top: 0,
    width: 42,
    height: 42,
    labelLeft: 78,
    labelTop: 8,
    notesLeft: 35,
    notesTop: 50,
    subtitle: "What made us feel good?",
  },
  {
    columnIndex: 2,
    left: 0,
    top: 52,
    width: 32,
    height: 48,
    labelLeft: 12,
    labelTop: 72,
    notesLeft: 50,
    notesTop: 62,
    subtitle: "What held us back?",
  },
  {
    columnIndex: 3,
    left: 28,
    top: 62,
    width: 44,
    height: 38,
    labelLeft: 50,
    labelTop: 88,
    notesLeft: 45,
    notesTop: 42,
    subtitle: "What future risks are ahead?",
  },
  {
    columnIndex: 4,
    left: 68,
    top: 18,
    width: 32,
    height: 52,
    labelLeft: 84,
    labelTop: 38,
    notesLeft: 38,
    notesTop: 65,
    subtitle: "Where are we headed?",
  },
];

export function getSailboatSectionFillColor(color: string): string {
  const fills: Record<string, string> = {
    green: "rgba(134, 239, 172, 0.35)",
    yellow: "rgba(253, 224, 71, 0.4)",
    blue: "rgba(125, 211, 252, 0.4)",
    gray: "rgba(228, 228, 231, 0.55)",
    purple: "rgba(192, 132, 252, 0.35)",
  };
  return fills[color] ?? fills.blue;
}

export const SAILBOAT_NOTE_STYLES: Record<
  string,
  { cardBg: string; border: string; stripe: string }
> = {
  green: {
    cardBg: "bg-green-50 dark:bg-green-950/50",
    border: "border-green-200/90 dark:border-green-800/60",
    stripe: "brand-green-stripe",
  },
  yellow: {
    cardBg: "bg-yellow-50 dark:bg-yellow-950/50",
    border: "border-yellow-200/90 dark:border-yellow-800/60",
    stripe: "brand-yellow-stripe",
  },
  blue: {
    cardBg: "bg-sky-50 dark:bg-sky-950/50",
    border: "border-sky-200/90 dark:border-sky-800/60",
    stripe: "brand-blue-stripe",
  },
  gray: {
    cardBg: "bg-zinc-50 dark:bg-zinc-800/70",
    border: "border-zinc-200/90 dark:border-zinc-600/60",
    stripe: "bg-zinc-300 dark:bg-zinc-500",
  },
  purple: {
    cardBg: "bg-purple-50 dark:bg-purple-950/50",
    border: "border-purple-200/90 dark:border-purple-800/60",
    stripe: "brand-purple-stripe",
  },
};
