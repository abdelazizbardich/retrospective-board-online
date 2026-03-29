"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Lock } from "lucide-react";

export default function DashboardLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Invalid password");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <LayoutGrid className="size-6 text-primary" />
          <span className="text-xl font-bold">SprintsPlans Admin</span>
        </div>
        <div className="rounded-xl border border-border bg-background p-8 shadow-xl">
          <div className="flex flex-col items-center mb-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
              <Lock className="size-6 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your admin password to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Default password: <code className="font-mono">admin</code> — set <code className="font-mono">ADMIN_PASSWORD</code> env var to change
          </p>
        </div>
      </div>
    </div>
  );
}
