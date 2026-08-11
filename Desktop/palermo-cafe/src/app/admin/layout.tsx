import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — Palermo Café",
  description: "Panel de administración de Palermo Café",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // SECURITY: Verify user has admin or editor role
  if (user.role !== "admin" && user.role !== "editor") {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={user} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
