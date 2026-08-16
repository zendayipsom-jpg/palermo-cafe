import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`products:${ip}`, { windowMs: 60000, maxRequests: 30 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes." },
        { status: 429 }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
