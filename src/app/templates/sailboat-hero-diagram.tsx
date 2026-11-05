import { getSailboatSectionFillColor, SAILBOAT_SECTIONS } from "@/app/board/[id]/sailboat-geometry";
import { BOARD_TEMPLATES } from "@/lib/types";

const sailboat = BOARD_TEMPLATES.find((t) => t.id === "sailboat")!;

const SAMPLE_NOTES = [
  { left: 16, top: 28, rot: -3, color: "green", text: "Clear owners" },
  { left: 74, top: 20, rot: 4, color: "yellow", text: "Calm demo" },
  { left: 16, top: 76, rot: -2, color: "blue", text: "Review lag" },
  { left: 48, top: 78, rot: 3, color: "gray", text: "Vendor risk" },
  { left: 82, top: 52, rot: -4, color: "purple", text: "Checkout live" },
];

const NOTE_BG: Record<string, string> = {
  green: "bg-green-100 border-green-200 dark:bg-green-900/70 dark:border-green-800",
  yellow: "bg-yellow-100 border-yellow-200 dark:bg-yellow-900/70 dark:border-yellow-800",
  blue: "bg-sky-100 border-sky-200 dark:bg-sky-900/70 dark:border-sky-800",
  gray: "bg-zinc-100 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-600",
  purple: "bg-purple-100 border-purple-200 dark:bg-purple-900/70 dark:border-purple-800",
};

/** Large sailboat diagram for the landing page hero. */
export function SailboatHeroDiagram() {
  return (
    <div
      className="relative mx-auto aspect-[1000/620] w-full overflow-hidden rounded-2xl border border-sky-200/80 bg-sky-100 shadow-xl dark:border-sky-900/50 dark:bg-sky-950"
      aria-hidden
    >
      <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-950" />
      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-b from-sky-400 to-sky-500 dark:from-sky-800 dark:to-sky-900" />

      {sailboat.columns.map((col, idx) => {
        const region = SAILBOAT_SECTIONS[idx];
        if (!region) return null;
        return (
          <div
            key={col.title}
            className="absolute rounded-md"
            style={{
              left: `${region.left}%`,
              top: `${region.top}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
              backgroundColor: getSailboatSectionFillColor(col.color),
            }}
          />
        );
      })}

      <div className="absolute right-[12%] top-[8%] size-10 rounded-full bg-yellow-300 shadow-sm sm:size-12" />
      <div className="absolute left-[8%] top-[12%] h-5 w-16 rounded-full bg-white/90" />
      <div className="absolute left-[14%] top-[10%] h-4 w-11 rounded-full bg-white/80" />

      <div className="absolute right-[6%] top-[28%]">
        <div className="h-8 w-14 rounded-b-full bg-amber-600/80" />
        <div className="absolute -top-4 left-1/2 h-6 w-9 -translate-x-1/2 rounded-t-full bg-green-500/90" />
      </div>

      <div className="absolute left-1/2 top-[48%] -translate-x-1/2">
        <div className="h-3 w-10 rounded-b-full bg-amber-700" />
        <div className="absolute -top-6 left-1/2 h-6 w-1 -translate-x-1/2 bg-amber-900" />
        <div
          className="absolute -top-6 left-1/2 h-5 w-4 -translate-x-1/2 bg-white/90"
          style={{ clipPath: "polygon(0 100%, 100% 20%, 100% 100%)" }}
        />
      </div>

      {SAILBOAT_SECTIONS.map((region, i) => (
        <span
          key={sailboat.columns[i].title}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase tracking-wide text-foreground/90 sm:text-xs"
          style={{ left: `${region.labelLeft}%`, top: `${region.labelTop}%` }}
        >
          {sailboat.columns[i].title}
        </span>
      ))}

      {SAMPLE_NOTES.map((note) => (
        <div
          key={note.text}
          className={`absolute w-[4.5rem] -translate-x-1/2 -translate-y-1/2 rounded-sm border px-1.5 py-1 text-[8px] font-medium leading-tight text-foreground shadow-sm sm:w-24 sm:text-[10px] ${NOTE_BG[note.color]}`}
          style={{
            left: `${note.left}%`,
            top: `${note.top}%`,
            transform: `translate(-50%, -50%) rotate(${note.rot}deg)`,
          }}
        >
          {note.text}
        </div>
      ))}
    </div>
  );
}
