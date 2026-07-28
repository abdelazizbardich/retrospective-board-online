import type { Column } from "@/lib/types";
import { getDividerAngles, getWedgeFillColor, wedgeSvgPoints } from "./starfish-geometry";

interface StarfishWedgeBackgroundsProps {
  columns: Column[];
}

/** Colored wedge fills rendered as SVG polygons. */
export function StarfishWedgeBackgrounds({ columns }: StarfishWedgeBackgroundsProps) {
  const count = columns.length;
  const dividers = getDividerAngles(count);

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {columns.map((column, idx) => (
        <polygon
          key={column.id}
          points={wedgeSvgPoints(idx, count)}
          fill={getWedgeFillColor(column.color)}
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
            strokeWidth="0.45"
            strokeLinecap="round"
            opacity="0.55"
          />
        );
      })}
    </svg>
  );
}
