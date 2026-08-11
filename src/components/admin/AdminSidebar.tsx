"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarCheck,
  FileText,
  LogOut,
} from "lucide-react";
import Logo from "@/components/shared/Logo";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/productos",
    label: "Productos",
    icon: UtensilsCrossed,
  },
  {
    href: "/admin/reservas",
    label: "Reservas",
    icon: CalendarCheck,
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: FileText,
  },
];

interface AdminSidebarProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex flex-col z-40">
      <div className="p-6 border-b border-border">
        <Logo variant="icon" size="md" />
        <p className="text-xs text-muted-foreground mt-2">Panel Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1" aria-label="Menú de administración">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-primary text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-sm mb-3">
          <p className="font-medium text-foreground truncate">{user.name || user.email}</p>
          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
