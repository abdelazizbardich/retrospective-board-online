"use client";

import { useState, useEffect, FormEvent } from "react";
import { Save, ToggleLeft, ToggleRight, Info } from "lucide-react";

interface AdSettings {
  adsEnabled: boolean;
  adClientId: string;
  slotIdLeft: string;
  slotIdRight: string;
}

export default function AdsSettingsPage() {
  const [settings, setSettings] = useState<AdSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      const updated = await res.json();
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Ad Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure advertisement slots and visibility across the app
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Toggle ads */}
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Enable Advertisements</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Show ad slots to users on the board and join pages
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettings((s) => s ? { ...s, adsEnabled: !s.adsEnabled } : s)}
              className="transition-colors"
              aria-label="Toggle ads"
            >
              {settings.adsEnabled
                ? <ToggleRight className="size-9 text-primary" />
                : <ToggleLeft className="size-9 text-muted-foreground" />
              }
            </button>
          </div>
        </div>

        {/* Publisher ID */}
        <div className="rounded-xl border border-border bg-background p-5 space-y-4">
          <h2 className="font-semibold">Google AdSense Configuration</h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Publisher ID <span className="text-muted-foreground font-normal">(data-ad-client)</span>
            </label>
            <input
              type="text"
              value={settings.adClientId}
              onChange={(e) => setSettings((s) => s ? { ...s, adClientId: e.target.value } : s)}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Left Sidebar Slot ID
              </label>
              <input
                type="text"
                value={settings.slotIdLeft}
                onChange={(e) => setSettings((s) => s ? { ...s, slotIdLeft: e.target.value } : s)}
                placeholder="1234567890"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Right Sidebar Slot ID
              </label>
              <input
                type="text"
                value={settings.slotIdRight}
                onChange={(e) => setSettings((s) => s ? { ...s, slotIdRight: e.target.value } : s)}
                placeholder="0987654321"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
            <Info className="size-3.5 mt-0.5 shrink-0" />
            <span>
              Find your publisher ID and slot IDs in your{" "}
              <a
                href="https://adsense.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Google AdSense account
              </a>
              . Changes take effect immediately without redeployment.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="size-4" />
            {saving ? "Saving…" : "Save Settings"}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium animate-fade-in-scale">
              ✓ Saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
