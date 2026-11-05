import type { TemplateColumnCopy } from "@/lib/template-pages/types";

const COLUMN_SURFACE: Record<string, { panel: string; heading: string; card: string }> = {
  green: {
    panel: "border-green-200 bg-green-50/70 dark:border-green-900 dark:bg-green-950/30",
    heading: "text-green-700 dark:text-green-400",
    card: "border-green-100 dark:border-green-900/40 dark:bg-green-900/20",
  },
  red: {
    panel: "border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/30",
    heading: "text-red-700 dark:text-red-400",
    card: "border-red-100 dark:border-red-900/40 dark:bg-red-900/20",
  },
  blue: {
    panel: "border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/30",
    heading: "text-blue-700 dark:text-blue-400",
    card: "border-blue-100 dark:border-blue-900/40 dark:bg-blue-900/20",
  },
  yellow: {
    panel: "border-yellow-200 bg-yellow-50/70 dark:border-yellow-900 dark:bg-yellow-950/30",
    heading: "text-yellow-800 dark:text-yellow-300",
    card: "border-yellow-100 dark:border-yellow-900/40 dark:bg-yellow-900/20",
  },
  purple: {
    panel: "border-purple-200 bg-purple-50/70 dark:border-purple-900 dark:bg-purple-950/30",
    heading: "text-purple-700 dark:text-purple-300",
    card: "border-purple-100 dark:border-purple-900/40 dark:bg-purple-900/20",
  },
  gray: {
    panel: "border-zinc-200 bg-zinc-50/80 dark:border-zinc-700 dark:bg-zinc-900/40",
    heading: "text-zinc-700 dark:text-zinc-300",
    card: "border-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/40",
  },
};

type ColumnHeroProps = {
  name: string;
  columns: TemplateColumnCopy[];
};

export function ColumnHero({ name, columns }: ColumnHeroProps) {
  const count = columns.length;
  const grid =
    count >= 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-3";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl" aria-hidden>
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
        <span className="size-3 rounded-full bg-red-400" />
        <span className="size-3 rounded-full bg-yellow-400" />
        <span className="size-3 rounded-full bg-green-400" />
        <div className="ml-3 min-w-0 flex-1 rounded-md border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground truncate">
          sprintsplans.com/board
        </div>
      </div>
      <div className="border-b border-border px-6 py-3">
        <p className="text-sm font-semibold">{name}</p>
      </div>
      <div className={`grid grid-cols-1 gap-4 p-5 ${grid}`}>
        {columns.map((column) => {
          const surface = COLUMN_SURFACE[column.color] ?? COLUMN_SURFACE.blue;
          return (
            <div
              key={column.title}
              className={`rounded-xl border p-3.5 ${surface.panel}`}
            >
              <p
                className={`mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${surface.heading}`}
              >
                <span>{column.emoji}</span>
                {column.title}
              </p>
              <div className="space-y-2">
                {column.sampleNotes.map((note) => (
                  <div
                    key={note}
                    className={`rounded-lg border bg-white p-3 text-sm shadow-sm ${surface.card}`}
                  >
                    <p className="font-medium leading-snug text-foreground">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
