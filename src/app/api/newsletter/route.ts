import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";
import { checkRateLimit, logSecurityEvent, getClientIp, checkHoneypot } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`newsletter:${ip}`, { windowMs: 3600000, maxRequests: 3 }, "newsletter");
    if (!rl.allowed) {
      logSecurityEvent({
        type: "rate_limit",
        ip,
        details: "Newsletter subscription rate limit exceeded",
      });
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // SECURITY: Honeypot check — silently reject bots
    if (!checkHoneypot(body)) {
      return NextResponse.json(
        { success: true, message: "¡Suscrito exitosamente!" },
        { status: 201 }
      );
    }

    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Email inválido",
          details: process.env.NODE_ENV === "development"
            ? result.error.flatten().fieldErrors
            : undefined,
        },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletter.findUnique({
      where: { email: result.data.email },
    });

    if (existing && !existing.active) {
      await prisma.newsletter.update({
        where: { id: existing.id },
        data: { active: true },
      });
    } else if (!existing) {
      await prisma.newsletter.create({ data: result.data });
    }

    return NextResponse.json(
      { success: true, message: "¡Suscrito exitosamente!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error");
    return NextResponse.json(
      { success: false, error: "Error al suscribirse" },
      { status: 500 }
    );
  }
}
