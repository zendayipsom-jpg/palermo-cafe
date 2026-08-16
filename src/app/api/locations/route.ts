import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`locations:${ip}`, { windowMs: 60000, maxRequests: 30 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes." },
        { status: 429 }
      );
    }

    const locations = await prisma.location.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener locales" },
      { status: 500 }
    );
  }
}
