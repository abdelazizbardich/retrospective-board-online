import { getDividerAngles, getWedgeCenters, getWedgeFillColor, polarToPercent, wedgeSvgPoints } from "@/app/board/[id]/starfish-geometry";
import { BOARD_TEMPLATES } from "@/lib/types";

const starfish = BOARD_TEMPLATES.find((t) => t.id === "starfish")!;
const count = starfish.columns.length;
const dividers = getDividerAngles(count);
const centers = getWedgeCenters(count);

const SAMPLE_NOTES = [
  { angle: -126, radius: 40, rot: -5, text: "Pair programming" },
  { angle: -54, radius: 42, rot: 4, text: "Long standups" },
  { angle: 18, radius: 44, rot: -3, text: "Weekly demos" },
  { angle: 90, radius: 43, rot: 6, text: "Scope creep" },
  { angle: 162, radius: 41, rot: -4, text: "Code reviews" },
];

/** Large starfish diagram for the landing page hero. */
export function StarfishHeroDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        {starfish.columns.map((col, idx) => (
          <polygon
            key={col.title}
            points={wedgeSvgPoints(idx, count)}
            fill={getWedgeFillColor(col.color)}
          />
        ))}
        {dividers.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 50 + Math.cos(rad) * 48;
          const y2 = 50 + Math.sin(rad) * 48;
          return (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={x2}
              y2={y2}
              stroke="#1e3a5f"
              strokeWidth="0.5"
              strokeLinecap="round"
              opacity="0.55"
            />
          );
        })}
      </svg>

      {centers.map((angle, i) => {
        const p = polarToPercent(angle, 20);
        return (
          <span
            key={starfish.columns[i].title}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-xs font-extrabold uppercase tracking-wide text-foreground sm:text-sm"
            style={{ left: p.left, top: p.top }}
          >
            {starfish.columns[i].title}
          </span>
        );
      })}

      {SAMPLE_NOTES.map((note, i) => {
        const p = polarToPercent(note.angle, note.radius);
        return (
          <div
            key={i}
            className="absolute w-20 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-zinc-300/80 bg-white/95 px-1.5 py-1 text-[8px] font-medium leading-tight text-foreground shadow-sm dark:border-zinc-600 dark:bg-zinc-900/95 sm:w-24 sm:text-[9px]"
            style={{ left: p.left, top: p.top, transform: `translate(-50%, -50%) rotate(${note.rot}deg)` }}
          >
            {note.text}
          </div>
        );
      })}
    </div>
  );
}
