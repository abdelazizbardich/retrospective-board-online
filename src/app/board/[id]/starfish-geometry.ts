function polarPoint(angleDeg: number, radiusPercent: number, cx = 50, cy = 50) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radiusPercent * Math.cos(rad),
    y: cy + radiusPercent * Math.sin(rad),
  };
}

export function getWedgeAngle(count: number): number {
  return count > 0 ? 360 / count : 360;
}

/** Divider line angles for N wedges (degrees, 0 = right, clockwise positive). */
export function getDividerAngles(count: number): number[] {
  if (count <= 0) return [];
  const wedgeAngle = getWedgeAngle(count);
  return Array.from({ length: count }, (_, i) => -90 - wedgeAngle + i * wedgeAngle);
}

/** Wedge center angle per column index. */
export function getWedgeCenters(count: number): number[] {
  if (count <= 0) return [];
  const wedgeAngle = getWedgeAngle(count);
  return Array.from({ length: count }, (_, i) => -90 - wedgeAngle / 2 + i * wedgeAngle);
}

/** SVG polygon points for a wedge (viewBox 0 0 100 100). */
export function wedgeSvgPoints(index: number, count: number, radius = 48): string {
  const dividers = getDividerAngles(count);
  if (count <= 0 || !dividers[index]) return "";

  const start = dividers[index];
  const end = dividers[(index + 1) % count];
  const p1 = polarPoint(start, radius, 50, 50);
  const p2 = polarPoint(end, radius, 50, 50);
  return `50,50 ${p1.x},${p1.y} ${p2.x},${p2.y}`;
}

/** Fill color for wedge SVG (visible tint per column color key). */
export function getWedgeFillColor(color: string): string {
  const fills: Record<string, string> = {
    green: "rgba(38, 147, 83, 0.45)",
    red: "rgba(248, 113, 113, 0.5)",
    blue: "rgba(43, 72, 169, 0.4)",
    yellow: "rgba(234, 179, 8, 0.45)",
    purple: "rgba(165, 65, 178, 0.42)",
  };
  return fills[color] ?? fills.blue;
}

/** CSS clip-path polygon for a starfish wedge. */
export function wedgeClipPath(index: number, count: number): string {
  const dividers = getDividerAngles(count);
  if (count <= 0 || !dividers[index]) return "none";

  const start = dividers[index];
  const end = dividers[(index + 1) % count];
  const p1 = polarPoint(start, 80);
  const p2 = polarPoint(end, 80);
  return `polygon(50% 50%, ${p1.x}% ${p1.y}%, ${p2.x}% ${p2.y}%)`;
}

/** Position an element along a wedge arm (% from container top-left). */
export function polarToPercent(angleDeg: number, radiusPercent: number) {
  const p = polarPoint(angleDeg, radiusPercent);
  return { left: `${p.x}%`, top: `${p.y}%` };
}

/** @deprecated Use getDividerAngles(count) */
export const STARFISH_DIVIDER_ANGLES = getDividerAngles(5);

/** @deprecated Use getWedgeCenters(count) */
export const STARFISH_WEDGE_CENTERS = getWedgeCenters(5);
