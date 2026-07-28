import { getSailboatSectionFillColor } from "./sailboat-geometry";
import { BOARD_TEMPLATES } from "@/lib/types";

const sailboat = BOARD_TEMPLATES.find((t) => t.id === "sailboat")!;

/** Hand-drawn ocean scene background for the sailboat board. */
export function SailboatScene() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 620"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="sailboat-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8e4ff" />
          <stop offset="100%" stopColor="#dff3ff" />
        </linearGradient>
        <linearGradient id="sailboat-ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ec8e8" />
          <stop offset="100%" stopColor="#2a9fd4" />
        </linearGradient>
        <linearGradient id="sailboat-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe566" />
          <stop offset="100%" stopColor="#ffb830" />
        </linearGradient>
        <filter id="sailboat-sketch">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        </filter>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="1000" height="310" fill="url(#sailboat-sky)" />

      {/* Sun rays */}
      <g opacity="0.35" stroke="#ffc94d" strokeWidth="3" strokeLinecap="round">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 820 + Math.cos(rad) * 52;
          const y1 = 72 + Math.sin(rad) * 52;
          const x2 = 820 + Math.cos(rad) * 78;
          const y2 = 72 + Math.sin(rad) * 78;
          return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* Sun */}
      <circle cx="820" cy="72" r="42" fill="url(#sailboat-sun)" stroke="#e8a020" strokeWidth="3" />
      <circle cx="808" cy="62" r="8" fill="#fff8dc" opacity="0.5" />

      {/* Wind clouds — playful puffy shapes */}
      <g fill="#fff" stroke="#94c5e8" strokeWidth="2.5" opacity="0.95">
        <ellipse cx="120" cy="95" rx="55" ry="28" />
        <ellipse cx="175" cy="88" rx="42" ry="32" />
        <ellipse cx="230" cy="98" rx="48" ry="26" />
        <ellipse cx="85" cy="108" rx="35" ry="22" />
        <ellipse cx="300" cy="120" rx="38" ry="20" />
        <ellipse cx="340" cy="112" rx="28" ry="18" />
      </g>

      {/* Wind streaks */}
      <g stroke="#7ec8e8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
        <path d="M 40 150 Q 90 145 140 152" fill="none" />
        <path d="M 60 175 Q 120 168 180 176" fill="none" />
        <path d="M 30 200 Q 100 192 170 202" fill="none" />
      </g>

      {/* Ocean */}
      <rect x="0" y="300" width="1000" height="320" fill="url(#sailboat-ocean)" />

      {/* Wave lines */}
      <g fill="none" stroke="#1a8ab5" strokeWidth="2" opacity="0.45">
        <path d="M 0 340 Q 50 330 100 340 T 200 340 T 300 340 T 400 340 T 500 340 T 600 340 T 700 340 T 800 340 T 900 340 T 1000 340" />
        <path d="M 0 380 Q 60 370 120 380 T 240 380 T 360 380 T 480 380 T 600 380 T 720 380 T 840 380 T 960 380" />
        <path d="M 0 420 Q 40 412 80 420 T 160 420 T 240 420 T 320 420 T 400 420 T 480 420 T 560 420 T 640 420 T 720 420 T 800 420 T 880 420 T 960 420" />
        <path d="M 0 470 Q 55 460 110 470 T 220 470 T 330 470 T 440 470 T 550 470 T 660 470 T 770 470 T 880 470 T 990 470" />
      </g>

      {/* Underwater tint for reef area */}
      <ellipse cx="480" cy="520" rx="200" ry="80" fill="#1a7a9e" opacity="0.25" />

      {/* Reef / coral rocks */}
      <g stroke="#0d5f7a" strokeWidth="2" strokeLinejoin="round">
        <path d="M 360 540 L 375 490 L 390 535 L 405 485 L 420 542 Z" fill="#e8a0a0" />
        <path d="M 430 555 L 445 500 L 460 548 L 475 495 L 490 558 Z" fill="#f0c090" />
        <path d="M 500 545 L 515 505 L 530 540 L 545 498 L 560 550 Z" fill="#c8e8c0" />
        <path d="M 570 538 L 585 492 L 600 535 L 615 488 L 630 542 Z" fill="#e8c8e8" />
        <ellipse cx="400" cy="565" rx="22" ry="12" fill="#8b4545" opacity="0.7" />
        <ellipse cx="520" cy="570" rx="28" ry="14" fill="#6b3535" opacity="0.6" />
      </g>

      {/* Anchor */}
      <g transform="translate(95, 430)">
        <circle cx="0" cy="0" r="14" fill="#4a5568" stroke="#2d3748" strokeWidth="2.5" />
        <rect x="-5" y="0" width="10" height="55" rx="3" fill="#4a5568" stroke="#2d3748" strokeWidth="2" />
        <path d="M -28 55 Q 0 80 28 55" fill="none" stroke="#4a5568" strokeWidth="6" strokeLinecap="round" />
        <path d="M -22 55 L -22 68 M 22 55 L 22 68" stroke="#2d3748" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Tropical island — Sprint Goal destination */}
      <g transform="translate(820, 200)">
        <ellipse cx="0" cy="95" rx="90" ry="28" fill="#c4a035" stroke="#9a7820" strokeWidth="2" />
        <path
          d="M -70 95 Q -50 40 0 20 Q 50 40 70 95 Z"
          fill="#5cb85c"
          stroke="#3d8b3d"
          strokeWidth="2.5"
        />
        <path
          d="M -30 95 Q -15 55 0 35 Q 15 55 30 95 Z"
          fill="#4cae4c"
          stroke="#3d8b3d"
          strokeWidth="2"
        />
        {/* Palm tree */}
        <rect x="-4" y="30" width="8" height="65" rx="3" fill="#8b6914" stroke="#6b5010" strokeWidth="1.5" />
        <ellipse cx="0" cy="22" rx="35" ry="18" fill="#3cb371" stroke="#2d8b57" strokeWidth="2" transform="rotate(-20)" />
        <ellipse cx="5" cy="18" rx="32" ry="16" fill="#2ecc71" stroke="#27ae60" strokeWidth="2" transform="rotate(15)" />
        <ellipse cx="-8" cy="20" rx="28" ry="14" fill="#3cb371" stroke="#2d8b57" strokeWidth="2" transform="rotate(-35)" />
        {/* SPRINT GOAL sign */}
        <rect x="-52" y="8" width="104" height="22" rx="6" fill="#fff8e7" stroke="#c4a035" strokeWidth="2" />
        <text
          x="0"
          y="23"
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill="#8b6914"
          fontFamily="Arial, sans-serif"
          letterSpacing="1"
        >
          SPRINT GOAL
        </text>
      </g>

      {/* Sailboat — center, heading right */}
      <g transform="translate(480, 310)">
        {/* Hull */}
        <path
          d="M -55 30 Q -60 55 0 60 Q 60 55 55 30 L 45 20 L -45 20 Z"
          fill="#c45c26"
          stroke="#8b3a12"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Deck line */}
        <path d="M -42 20 L 42 20" stroke="#8b3a12" strokeWidth="2" />
        {/* Mast */}
        <line x1="0" y1="20" x2="0" y2="-80" stroke="#5c3d1e" strokeWidth="4" strokeLinecap="round" />
        {/* Main sail */}
        <path
          d="M 2 -78 Q 55 -50 50 18 L 2 18 Z"
          fill="#fff8f0"
          stroke="#c4b8a8"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Jib sail */}
        <path
          d="M -2 -60 Q -45 -30 -40 18 L -2 18 Z"
          fill="#ffe8d0"
          stroke="#c4b8a8"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Flag */}
        <path d="M 0 -82 L 18 -88 L 0 -94 Z" fill="#e74c3c" stroke="#c0392b" strokeWidth="1.5" />
        {/* Wake */}
        <path
          d="M -30 62 Q -50 72 -70 68 M 30 62 Q 50 72 70 68"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      {/* Section tint overlays (subtle) */}
      {sailboat.columns.map((col, idx) => {
        const regions = [
          { x: 0, y: 0, w: 380, h: 285 },
          { x: 580, y: 0, w: 420, h: 260 },
          { x: 0, y: 322, w: 320, h: 298 },
          { x: 280, y: 384, w: 440, h: 236 },
          { x: 680, y: 112, w: 320, h: 322 },
        ];
        const r = regions[idx];
        return (
          <rect
            key={col.title}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill={getSailboatSectionFillColor(col.color)}
            opacity="0.5"
            rx="8"
          />
        );
      })}
    </svg>
  );
}
