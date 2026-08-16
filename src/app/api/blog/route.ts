import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`blog:${ip}`, { windowMs: 60000, maxRequests: 30 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes." },
        { status: 429 }
      );
    }

    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener artículos" },
      { status: 500 }
    );
  }
}
