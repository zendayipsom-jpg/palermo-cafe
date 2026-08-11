import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/security";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // SECURITY: Rate limit admin writes — 30 per hour per user
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`admin:reservations:${user.id}:${ip}`, { windowMs: 3600000, maxRequests: 30 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Estado inválido" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: reservation });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar reserva" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // SECURITY: Rate limit admin deletes — 20 per hour per user
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`admin:reservations:delete:${user.id}:${ip}`, { windowMs: 3600000, maxRequests: 20 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const { id } = await params;

    await prisma.reservation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar reserva" },
      { status: 500 }
    );
  }
}
