"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type AdFormat = "leaderboard" | "rectangle" | "banner" | "skyscraper";

const AD_SIZES: Record<AdFormat, { width: number; height: number; label: string }> = {
  leaderboard: { width: 728, height: 90,  label: "728 × 90" },
  rectangle:   { width: 300, height: 250, label: "300 × 250" },
  banner:      { width: 468, height: 60,  label: "468 × 60" },
  skyscraper:  { width: 160, height: 600, label: "160 × 600" },
};

interface AdSettings {
  adsEnabled: boolean;
  adClientId: string;
  slotIdLeft: string;
  slotIdRight: string;
}

interface AdSlotProps {
  format: AdFormat;
  /** "left" | "right" — selects the matching slot ID from settings */
  side?: "left" | "right";
  /** Center the unit horizontally */
  centered?: boolean;
  /** Allow the user to dismiss (collapse) the ad */
  dismissible?: boolean;
  className?: string;
}

/**
 * Ad unit driven by live settings from /api/admin/settings.
 * Replace the inner placeholder div with your real AdSense <ins> tag when ready.
 */
export function AdSlot({
  format,
  side,
  centered = false,
  dismissible = false,
  className = "",
}: AdSlotProps) {
  const [dismissed, setDismissed] = useState(false);
  const [settings, setSettings] = useState<AdSettings | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.ok ? r.json() : null)
      .then(setSettings)
      .catch(() => null);
  }, []);

  if (dismissed) return null;
  if (!settings || !settings.adsEnabled) return null;

  const { width, height, label } = AD_SIZES[format];
  const slotId =
    side === "left"  ? settings.slotIdLeft  :
    side === "right" ? settings.slotIdRight :
    "PLACEHOLDER";

  return (
    <div
      className={`relative ${centered ? "flex justify-center" : ""} ${className}`}
      aria-label="Advertisement"
    >
      {/* ── Replace this placeholder div with your real ad embed ── */}
      <div
        style={{ width, height, maxWidth: "100%" }}
        className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border/60 bg-muted/30 text-muted-foreground"
        data-ad-client={settings.adClientId}
        data-ad-slot={slotId}
        data-ad-format={format}
      >
        <span className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Advertisement</span>
        <span className="text-xs opacity-40">{label}</span>
      </div>
      {/* ─────────────────────────────────────────────────────────── */}

      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          aria-label="Close advertisement"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}
