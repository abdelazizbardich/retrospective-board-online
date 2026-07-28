import { getSailboatSectionFillColor, SAILBOAT_SECTIONS } from "@/app/board/[id]/sailboat-geometry";
import { BOARD_TEMPLATES } from "@/lib/types";

const sailboat = BOARD_TEMPLATES.find((t) => t.id === "sailboat")!;

const MINI_NOTES = [
  { left: 14, top: 28, rot: -3, color: "green" },
  { left: 72, top: 22, rot: 4, color: "yellow" },
  { left: 14, top: 78, rot: -2, color: "blue" },
  { left: 46, top: 74, rot: 3, color: "gray" },
  { left: 80, top: 48, rot: -4, color: "purple" },
];

const NOTE_BG: Record<string, string> = {
  green: "bg-green-100 border-green-200",
  yellow: "bg-yellow-100 border-yellow-200",
  blue: "bg-sky-100 border-sky-200",
  gray: "bg-zinc-100 border-zinc-200",
  purple: "bg-purple-100 border-purple-200",
};

/** Mini illustrated preview for the sailboat template picker. */
export function SailboatTemplatePreview() {
  return (
    <div
      className="relative mx-auto mb-1 aspect-[1000/620] w-full max-w-[9.5rem] overflow-hidden rounded-lg border border-sky-200/80 bg-sky-100 dark:border-sky-900/50 dark:bg-sky-950"
      aria-hidden
    >
      {/* Sky */}
      <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-950" />
      {/* Ocean */}
      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-b from-sky-400 to-sky-500 dark:from-sky-800 dark:to-sky-900" />

      {/* Section tints */}
      {sailboat.columns.map((col, idx) => {
        const r = SAILBOAT_SECTIONS[idx];
        if (!r) return null;
        return (
          <div
            key={col.title}
            className="absolute rounded-sm"
            style={{
              left: `${r.left}%`,
              top: `${r.top}%`,
              width: `${r.width}%`,
              height: `${r.height}%`,
              backgroundColor: getSailboatSectionFillColor(col.color),
            }}
          />
        );
      })}

      {/* Sun */}
      <div className="absolute right-[12%] top-[8%] size-5 rounded-full bg-yellow-300 shadow-sm" />

      {/* Clouds */}
      <div className="absolute left-[8%] top-[12%] h-3 w-10 rounded-full bg-white/90" />
      <div className="absolute left-[14%] top-[10%] h-2.5 w-7 rounded-full bg-white/80" />

      {/* Island */}
      <div className="absolute right-[6%] top-[28%]">
        <div className="h-4 w-8 rounded-b-full bg-amber-600/80" />
        <div className="absolute -top-2 left-1/2 h-3 w-5 -translate-x-1/2 rounded-t-full bg-green-500/90" />
      </div>

      {/* Boat */}
      <div className="absolute left-1/2 top-[48%] -translate-x-1/2">
        <div className="h-1.5 w-5 rounded-b-full bg-amber-700" />
        <div className="absolute -top-3 left-1/2 h-3 w-0.5 -translate-x-1/2 bg-amber-900" />
        <div className="absolute -top-3 left-1/2 h-2.5 w-2 -translate-x-1/2 bg-white/90" style={{ clipPath: "polygon(0 100%, 100% 20%, 100% 100%)" }} />
      </div>

      {/* Anchor dot */}
      <div className="absolute bottom-[18%] left-[10%] text-[8px]">⚓</div>

      {/* Labels */}
      {SAILBOAT_SECTIONS.map((region, i) => (
        <span
          key={sailboat.columns[i].title}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-[5px] font-extrabold uppercase leading-none text-foreground/80"
          style={{ left: `${region.labelLeft}%`, top: `${region.labelTop}%` }}
        >
          {sailboat.columns[i].title}
        </span>
      ))}

      {/* Mini notes */}
      {MINI_NOTES.map((note, i) => (
        <div
          key={i}
          className={`absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-sm border shadow-sm ${NOTE_BG[note.color]}`}
          style={{
            left: `${note.left}%`,
            top: `${note.top}%`,
            transform: `translate(-50%, -50%) rotate(${note.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}
