"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  guests: number;
  date: string;
  time: string;
  message: string | null;
  status: string;
  location: string | null;
  createdAt: string;
}

export default function AdminReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservations");
      const data = await res.json();
      if (data.success) {
        setReservations(data.data);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        fetchReservations();
      } else {
        alert(data.error || "Error al actualizar reserva");
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Error al actualizar reserva");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta reserva?")) return;

    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        fetchReservations();
      } else {
        alert(data.error || "Error al eliminar reserva");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Error al eliminar reserva");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Reservas
        </h1>
        <div className="text-sm text-muted-foreground">
          {reservations.length} reserva{reservations.length !== 1 ? "s" : ""} en
          total
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Nombre
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Teléfono
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Personas
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Fecha / Hora
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Local
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Estado
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">{r.name}</p>
                    {r.email && (
                      <p className="text-xs text-muted-foreground">{r.email}</p>
                    )}
                    {r.message && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        &quot;{r.message}&quot;
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{r.phone}</td>
                  <td className="py-3 px-4 text-muted-foreground">{r.guests}</td>
                  <td className="py-3 px-4">
                    <p className="text-foreground">{r.date}</p>
                    <p className="text-xs text-muted-foreground">{r.time}</p>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-sm">
                    {r.location || "—"}
                  </td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {r.status !== "confirmed" && (
                        <button
                          onClick={() => updateStatus(r.id, "confirmed")}
                          className="p-2 rounded-lg hover:bg-green-50 transition-colors text-muted-foreground hover:text-green-600"
                          title="Confirmar"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {r.status !== "cancelled" && (
                        <button
                          onClick={() => updateStatus(r.id, "cancelled")}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                          title="Cancelar"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      {r.status !== "pending" && (
                        <button
                          onClick={() => updateStatus(r.id, "pending")}
                          className="p-2 rounded-lg hover:bg-yellow-50 transition-colors text-muted-foreground hover:text-yellow-600"
                          title="Marcar pendiente"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reservations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay reservas aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
