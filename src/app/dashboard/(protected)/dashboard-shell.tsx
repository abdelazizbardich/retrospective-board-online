"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, BarChart3, Megaphone, LogOut, LayoutDashboard, BookOpen, FileText } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/boards", label: "Boards", icon: BarChart3, exact: false },
  { href: "/dashboard/blog", label: "Blog", icon: BookOpen, exact: false },
  { href: "/dashboard/pages", label: "Pages", icon: FileText, exact: false },
  { href: "/dashboard/ads", label: "Ads", icon: Megaphone, exact: false },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/dashboard/login");
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-background">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
          <LayoutGrid className="size-5 text-primary" />
          <span className="font-bold text-sm">SprintsPlans Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <LayoutGrid className="size-4 text-primary" />
            SprintsPlans Admin
          </div>
          <div className="flex gap-1">
            {NAV.map(({ href, label, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
