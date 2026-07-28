import {
  getDividerAngles,
  getWedgeCenters,
  getWedgeFillColor,
  polarToPercent,
  wedgeSvgPoints,
} from "@/app/board/[id]/starfish-geometry";
import { BOARD_TEMPLATES } from "@/lib/types";

const starfish = BOARD_TEMPLATES.find((t) => t.id === "starfish")!;
const count = starfish.columns.length;
const dividers = getDividerAngles(count);
const centers = getWedgeCenters(count);

const MINI_NOTES = [
  { angle: -126, radius: 40, rot: -4 },
  { angle: -54, radius: 42, rot: 3 },
  { angle: 18, radius: 44, rot: -2 },
  { angle: 90, radius: 43, rot: 5 },
  { angle: 162, radius: 41, rot: -3 },
];

/** Mini radial diagram shown on the template picker for starfish boards. */
export function StarfishTemplatePreview() {
  return (
    <div
      className="relative mx-auto mb-1 aspect-square w-full max-w-[9.5rem] rounded-lg border border-border bg-white dark:bg-zinc-900"
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full rounded-lg" viewBox="0 0 100 100">
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
              strokeWidth="0.55"
              strokeLinecap="round"
              opacity="0.55"
            />
          );
        })}
      </svg>

      {centers.map((angle, i) => {
        const p = polarToPercent(angle, 19);
        return (
          <span
            key={starfish.columns[i].title}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-[6px] font-extrabold uppercase leading-none text-foreground"
            style={{ left: p.left, top: p.top }}
          >
            {starfish.columns[i].title}
          </span>
        );
      })}

      {MINI_NOTES.map((note, i) => {
        const p = polarToPercent(note.angle, note.radius);
        return (
          <div
            key={i}
            className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-zinc-300/80 bg-white/95 shadow-sm dark:border-zinc-600 dark:bg-zinc-800/95"
            style={{
              left: p.left,
              top: p.top,
              transform: `translate(-50%, -50%) rotate(${note.rot}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}
