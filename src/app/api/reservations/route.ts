import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validations";
import { checkRateLimit, logSecurityEvent, getClientIp, detectInjectionAttempts, sanitizeInput, checkHoneypot } from "@/lib/security";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Require admin authentication to view reservations (PII data)
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      logSecurityEvent({
        type: "auth_failure",
        ip: getClientIp(request),
        details: "Unauthenticated access attempt to GET /api/reservations",
      });
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      // SECURITY: Limit fields returned - don't expose internal IDs unnecessarily
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        guests: true,
        date: true,
        time: true,
        message: true,
        status: true,
        location: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: reservations });
  } catch (error) {
    // SECURITY: Don't expose internal error details
    console.error("Error fetching reservations");
    return NextResponse.json(
      { success: false, error: "Error al obtener reservas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`reservation:${ip}`, { windowMs: 3600000, maxRequests: 5 }, "api");
    if (!rl.allowed) {
      logSecurityEvent({
        type: "rate_limit",
        ip,
        details: "Reservation creation rate limit exceeded",
      });
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // SECURITY: Honeypot check — silently reject bots
    if (!checkHoneypot(body)) {
      return NextResponse.json(
        { success: true, data: { id: "honeypot" } },
        { status: 201 }
      );
    }

    // SECURITY: Check for injection attempts
    const bodyString = JSON.stringify(body);
    if (detectInjectionAttempts(bodyString)) {
      logSecurityEvent({
        type: "injection_attempt",
        ip,
        details: `Injection attempt detected in reservation form`,
      });
      return NextResponse.json(
        { success: false, error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const result = reservationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: process.env.NODE_ENV === "development"
            ? result.error.flatten().fieldErrors
            : undefined,
        },
        { status: 400 }
      );
    }

    // SECURITY: Sanitize user input before storing
    const sanitizedData = {
      ...result.data,
      name: sanitizeInput(result.data.name),
      message: result.data.message ? sanitizeInput(result.data.message) : undefined,
    };

    const reservation = await prisma.reservation.create({
      data: sanitizedData,
    });

    return NextResponse.json(
      { success: true, data: reservation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating reservation");
    return NextResponse.json(
      { success: false, error: "Error al crear reserva" },
      { status: 500 }
    );
  }
}
