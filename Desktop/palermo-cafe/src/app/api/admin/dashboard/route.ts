import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/security";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // SECURITY: Rate limit dashboard — 30 per hour per user
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`admin:dashboard:${user.id}:${ip}`, { windowMs: 3600000, maxRequests: 30 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const [productCount, reservationCount, messageCount, newsletterCount] =
      await Promise.all([
        prisma.product.count(),
        prisma.reservation.count(),
        prisma.message.count({ where: { read: false } }),
        prisma.newsletter.count({ where: { active: true } }),
      ]);

    const recentReservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        productCount,
        reservationCount,
        messageCount,
        newsletterCount,
        recentReservations,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener datos del dashboard" },
      { status: 500 }
    );
  }
}
