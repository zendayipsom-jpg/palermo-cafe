"use client";

import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  CalendarCheck,
  Users,
  Mail,
  RefreshCw,
} from "lucide-react";

interface DashboardData {
  productCount: number;
  reservationCount: number;
  messageCount: number;
  newsletterCount: number;
  recentReservations: {
    id: string;
    name: string;
    phone: string;
    guests: number;
    date: string;
    time: string;
    status: string;
    location: string | null;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchDashboard, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = [
    {
      label: "Productos",
      value: data.productCount,
      icon: UtensilsCrossed,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Reservas",
      value: data.reservationCount,
      icon: CalendarCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Mensajes nuevos",
      value: data.messageCount,
      icon: Mail,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Suscriptores",
      value: data.newsletterCount,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Dashboard
        </h1>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Actualizado: {lastUpdated.toLocaleTimeString("es-PE")}
            </span>
          )}
          <button
            onClick={fetchDashboard}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Actualizar ahora"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent reservations */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display font-bold text-foreground mb-4">
          Reservas Recientes
        </h2>

        {data.recentReservations.length === 0 ? (
          <p className="text-muted-foreground">No hay reservas aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Nombre
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Teléfono
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Personas
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentReservations.map((r) => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium">{r.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {r.phone}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {r.guests}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {r.date}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          r.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : r.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.status === "confirmed"
                          ? "Confirmada"
                          : r.status === "cancelled"
                          ? "Cancelada"
                          : "Pendiente"}
                      </span>
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
