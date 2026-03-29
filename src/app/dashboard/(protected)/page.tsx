import { getAllBoards } from "@/lib/board-store";
import { getAdSettings } from "@/lib/ad-settings";
import { LayoutGrid, Users, CreditCard, Megaphone, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const boards = await getAllBoards();
  const adSettings = await getAdSettings();

  const totalParticipants = boards.reduce((s, b) => s + b.participants.length, 0);
  const totalCards = boards.reduce(
    (s, b) => s + b.columns.reduce((cs, col) => cs + col.cards.length, 0),
    0
  );
  const activeBoards = boards.filter((b) => b.phase !== "actions").length;

  const stats = [
    { label: "Total Boards", value: boards.length, icon: LayoutGrid, href: "/dashboard/boards" },
    { label: "Active Boards", value: activeBoards, icon: TrendingUp, href: "/dashboard/boards" },
    { label: "Total Participants", value: totalParticipants, icon: Users, href: "/dashboard/boards" },
    { label: "Total Cards", value: totalCards, icon: CreditCard, href: "/dashboard/boards" },
  ];

  const recentBoards = boards.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome to the SprintsPlans admin dashboard</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-border bg-background p-5 hover:shadow-md hover:border-primary/40 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="size-4 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </Link>
        ))}
      </div>

      {/* Ad status banner */}
      <div className={`flex items-center justify-between gap-4 rounded-xl border p-4 ${
        adSettings.adsEnabled
          ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
          : "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20"
      }`}>
        <div className="flex items-center gap-3">
          <Megaphone className={`size-5 ${adSettings.adsEnabled ? "text-green-600" : "text-yellow-600"}`} />
          <div>
            <p className="text-sm font-semibold">
              Advertisements are {adSettings.adsEnabled ? "enabled" : "disabled"}
            </p>
            <p className="text-xs text-muted-foreground">
              Publisher ID: <code className="font-mono">{adSettings.adClientId}</code>
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/ads"
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          Configure →
        </Link>
      </div>

      {/* Recent boards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Boards</h2>
          <Link href="/dashboard/boards" className="text-sm text-primary hover:underline">
            View all →
          </Link>
        </div>
        {recentBoards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
            No boards yet
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden bg-background">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Phase</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Participants</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Cards</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Link</th>
                </tr>
              </thead>
              <tbody>
                {recentBoards.map((b, i) => (
                  <tr key={b.id} className={`${i < recentBoards.length - 1 ? "border-b border-border/60" : ""} hover:bg-muted/30 transition-colors`}>
                    <td className="px-4 py-3 font-medium">{b.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                        {b.phase}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{b.participants.length}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {b.columns.reduce((s, col) => s + col.cards.length, 0)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/board/${b.id}`}
                        target="_blank"
                        className="text-xs text-primary hover:underline"
                      >
                        Open ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
