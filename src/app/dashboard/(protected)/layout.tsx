import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { DashboardShell } from "@/app/dashboard/(protected)/dashboard-shell";

export const metadata = { title: "Admin Dashboard — SprintsPlans" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/dashboard/login");

  return <DashboardShell>{children}</DashboardShell>;
}
