"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BOARD_TEMPLATES, hasIllustratedLayout } from "@/lib/types";
import { FluentEmoji } from "@/lib/fluent-emoji";
import { StarfishTemplatePreview } from "./starfish-template-preview";
import { SailboatTemplatePreview } from "./sailboat-template-preview";
import { useUser } from "@/lib/user-context";
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  X,
  Lock,
  UserCircle2,
  Table2,
} from "lucide-react";

interface ImportedColumn {
  title: string;
  cards: string[];
}

async function parseExcelFile(file: File): Promise<ImportedColumn[]> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(new Uint8Array(buffer), { type: "array" });

  // Strategy 1: use the "Cards" sheet if present (exported from this app)
  if (wb.SheetNames.includes("Cards")) {
    const ws = wb.Sheets["Cards"];
    const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][];
    const header = (rows[0] ?? []).map((h) => String(h ?? "").toLowerCase());
    const colIdx = header.findIndex((h) => h === "column");
    const cardIdx = header.findIndex((h) => h === "card");
    if (colIdx >= 0 && cardIdx >= 0) {
      const map = new Map<string, string[]>();
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i] ?? [];
        const colName = String(row[colIdx] ?? "").trim();
        const cardText = String(row[cardIdx] ?? "").trim();
        if (!colName || !cardText) continue;
        if (!map.has(colName)) map.set(colName, []);
        map.get(colName)!.push(cardText);
      }
      if (map.size > 0) {
        return Array.from(map.entries()).map(([title, cards]) => ({ title, cards }));
      }
    }
  }

  // Strategy 2: each sheet (except "Summary") = one column, each row = a card
  const columnSheets = wb.SheetNames.filter((n) => n !== "Summary");
  const result: ImportedColumn[] = [];
  for (const sheetName of columnSheets) {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][];
    let startRow = 0;
    if (rows.length > 0) {
      const firstCell = String(rows[0][0] ?? "").toLowerCase();
      if (["card", "text", "content", "note"].includes(firstCell)) startRow = 1;
    }
    const cards = rows
      .slice(startRow)
      .map((row) => String(row[0] ?? "").trim())
      .filter((t) => t.length > 0);
    if (cards.length > 0) result.push({ title: sheetName, cards });
  }
  return result;
}

function TemplateFromUrl({ onSelect }: { onSelect: (id: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const templateId = searchParams.get("template");
    if (templateId && BOARD_TEMPLATES.some((t) => t.id === templateId)) {
      onSelect(templateId);
    }
  }, [searchParams, onSelect]);

  return null;
}

export default function CreateBoardPage() {
  const router = useRouter();
  const { user, login, register } = useUser();
  const [mode, setMode] = useState<"template" | "import">("template");

  // Identity state (if user not logged in)
  const [identityUsername, setIdentityUsername] = useState("");
  const [identityPassword, setIdentityPassword] = useState("");
  const [identityUsePassword, setIdentityUsePassword] = useState(false);
  const [identityMode, setIdentityMode] = useState<"login" | "register">("login");
  const [identityLoading, setIdentityLoading] = useState(false);
  const [identityError, setIdentityError] = useState("");
  const [identityDone, setIdentityDone] = useState(false);

  // Template mode state
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Import mode state
  const [importName, setImportName] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importColumns, setImportColumns] = useState<ImportedColumn[] | null>(null);
  const [importError, setImportError] = useState("");
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a board name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), templateId: selectedTemplate, ...(user ? { ownerId: user.id } : {}) }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create board");
        return;
      }
      const board = await res.json();
      router.push(`/board/${board.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processFile = useCallback(async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setImportError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }
    setImportError("");
    setImportColumns(null);
    setImportFile(file);
    // pre-fill board name from filename
    const baseName = file.name.replace(/\.(xlsx|xls|csv)$/i, "").replace(/[-_]/g, " ");
    if (!importName) setImportName(baseName);
    try {
      const columns = await parseExcelFile(file);
      if (columns.length === 0) {
        setImportError("No columns/cards found. Check the file format.");
        return;
      }
      setImportColumns(columns);
    } catch {
      setImportError("Failed to parse file. Make sure it's a valid Excel file.");
    }
  }, [importName]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const clearImport = () => {
    setImportFile(null);
    setImportColumns(null);
    setImportError("");
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importName.trim()) {
      setImportError("Please enter a board name");
      return;
    }
    if (!importColumns || importColumns.length === 0) {
      setImportError("Please upload an Excel file first");
      return;
    }
    setImporting(true);
    setImportError("");
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: importName.trim(), columns: importColumns, ...(user ? { ownerId: user.id } : {}) }),
      });
      if (!res.ok) {
        const data = await res.json();
        setImportError(data.error || "Failed to create board");
        return;
      }
      const board = await res.json();
      router.push(`/board/${board.id}`);
    } catch {
      setImportError("Something went wrong. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const handleIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityUsername.trim()) { setIdentityError("Username is required"); return; }
    setIdentityLoading(true);
    setIdentityError("");
    const fn = identityMode === "login" ? login : register;
    const result = await fn(identityUsername.trim(), identityUsePassword ? identityPassword : undefined);
    if (!result.success) { setIdentityError(result.error ?? "Something went wrong"); }
    else { setIdentityDone(true); }
    setIdentityLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <TemplateFromUrl onSelect={setSelectedTemplate} />
      </Suspense>
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 font-bold text-lg">
            <LayoutGrid className="size-5 text-primary" />
            SprintsPlans
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Create a new board</h1>
        <p className="mt-2 text-muted-foreground">
          Start from a template or import an existing board from Excel.
        </p>

        {/* ── Identity banner ── */}
        {user ? (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
            <UserCircle2 className="size-5 text-primary shrink-0" />
            <span className="flex-1">
              Creating as <span className="font-semibold">{user.username}</span>
              {user.hasPassword && <Lock className="inline ml-1 size-3 text-muted-foreground" />}
              {" — "}
              <Link href="/my-boards" className="text-primary hover:underline">My Boards</Link>
            </span>
          </div>
        ) : !identityDone ? (
          <div className="mt-6 rounded-xl border border-border bg-muted/20 p-5">
            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
              <UserCircle2 className="size-4 text-primary" />
              Save this board to your account (optional)
            </p>
            <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-0.5 mb-4 w-fit">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setIdentityMode(m); setIdentityError(""); }}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    identityMode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
            <form onSubmit={handleIdentity} className="flex flex-wrap gap-2 items-start">
              <input
                type="text"
                value={identityUsername}
                onChange={(e) => setIdentityUsername(e.target.value)}
                placeholder="Username"
                maxLength={50}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-44"
              />
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none self-center">
                <input
                  type="checkbox"
                  checked={identityUsePassword}
                  onChange={(e) => setIdentityUsePassword(e.target.checked)}
                  className="rounded"
                />
                <Lock className="size-3" />
                Password
              </label>
              {identityUsePassword && (
                <input
                  type="password"
                  value={identityPassword}
                  onChange={(e) => setIdentityPassword(e.target.value)}
                  placeholder="Password"
                  maxLength={200}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-44"
                />
              )}
              <button
                type="submit"
                disabled={identityLoading}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {identityLoading ? "…" : identityMode === "login" ? "Sign In" : "Create Account"}
              </button>
              <button
                type="button"
                onClick={() => setIdentityDone(true)}
                className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:bg-muted transition-colors"
              >
                Skip
              </button>
            </form>
            {identityError && <p className="mt-2 text-xs text-red-500">{identityError}</p>}
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <span>Creating as guest — board won&apos;t be saved to any account.</span>
          </div>
        )}

        {/* Mode tabs */}
        <div className="mt-8 flex gap-1 rounded-xl border border-border bg-muted/40 p-1 w-fit">
          <button
            type="button"
            onClick={() => setMode("template")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === "template"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-4" />
            Use a template
          </button>
          <button
            type="button"
            onClick={() => setMode("import")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === "import"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileSpreadsheet className="size-4" />
            Import from Excel
          </button>
        </div>

        {/* ── Template mode ── */}
        {mode === "template" && (
          <form onSubmit={handleCreate} className="mt-10 space-y-10">
            <div>
              <label htmlFor="board-name" className="block text-sm font-semibold mb-2">
                Board name
              </label>
              <input
                id="board-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sprint 25 Retrospective"
                maxLength={100}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <p className="text-sm font-semibold mb-4">Choose a template</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {BOARD_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative rounded-xl border-2 p-5 text-left transition-all ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    {selectedTemplate === template.id && (
                      <CheckCircle2 className="absolute right-3 top-3 size-5 text-primary" />
                    )}
                    <div className={`mb-3 ${hasIllustratedLayout(template.layout) ? "flex justify-center px-2" : "flex gap-1.5 items-center"}`}>
                      {template.layout === "radial" ? (
                        <StarfishTemplatePreview />
                      ) : template.layout === "sailboat" ? (
                        <SailboatTemplatePreview />
                      ) : (
                        template.columns.map((col) => (
                          <FluentEmoji key={col.title} emoji={col.emoji} size="1.5rem" />
                        ))
                      )}
                    </div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {template.columns.map((col) => (
                        <span
                          key={col.title}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {col.title}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Board"}
              {!loading && <ArrowRight className="size-4" />}
            </button>
          </form>
        )}

        {/* ── Import mode ── */}
        {mode === "import" && (
          <form onSubmit={handleImport} className="mt-10 space-y-8">
            {/* Drop zone */}
            {!importFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-16 px-6 text-center transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
                  <Upload className="size-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-base">Drop your Excel file here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    .xlsx or .xls — supports boards exported from SprintsPlans or any spreadsheet
                  </p>
                </div>
                <label className="cursor-pointer rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                  Browse file
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="sr-only"
                    onChange={handleFileInput}
                  />
                </label>
                <div className="mt-2 rounded-xl bg-muted/60 px-4 py-3 text-left text-xs text-muted-foreground max-w-md">
                  <p className="font-semibold mb-1 flex items-center gap-1.5"><Table2 className="size-3.5" />Expected format</p>
                  <p>• <strong>App export</strong>: use the Excel file exported from a SprintsPlans board — columns and cards are detected automatically.</p>
                  <p className="mt-1">• <strong>Custom file</strong>: each sheet tab = one column; each row in the sheet = one card.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-background p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileSpreadsheet className="size-8 shrink-0 text-green-600" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{importFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {importColumns
                          ? `${importColumns.length} column${importColumns.length !== 1 ? "s" : ""}, ${importColumns.reduce((s, c) => s + c.cards.length, 0)} cards detected`
                          : "Parsing…"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearImport}
                    className="shrink-0 rounded-lg p-1.5 hover:bg-muted transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="size-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Preview */}
                {importColumns && importColumns.length > 0 && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {importColumns.map((col, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border bg-muted/30 px-3 py-2.5"
                      >
                        <p className="font-medium text-sm truncate">{col.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {col.cards.length} card{col.cards.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Board name */}
            <div>
              <label htmlFor="import-board-name" className="block text-sm font-semibold mb-2">
                Board name
              </label>
              <input
                id="import-board-name"
                type="text"
                value={importName}
                onChange={(e) => setImportName(e.target.value)}
                placeholder="e.g. Sprint 25 Retrospective"
                maxLength={100}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {importError && (
              <p className="text-sm text-red-500 font-medium">{importError}</p>
            )}

            <button
              type="submit"
              disabled={importing || !importColumns || importColumns.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {importing ? "Importing..." : "Import Board"}
              {!importing && <ArrowRight className="size-4" />}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
