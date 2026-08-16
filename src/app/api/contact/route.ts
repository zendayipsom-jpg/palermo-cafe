import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { checkRateLimit, logSecurityEvent, getClientIp, detectInjectionAttempts, sanitizeInput, checkHoneypot } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`contact:${ip}`, { windowMs: 3600000, maxRequests: 5 }, "contact");
    if (!rl.allowed) {
      logSecurityEvent({
        type: "rate_limit",
        ip,
        details: "Contact form rate limit exceeded",
      });
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // SECURITY: Honeypot check — silently reject bots
    if (!checkHoneypot(body)) {
      // Return fake success to not tip off bots
      return NextResponse.json(
        { success: true, message: "¡Mensaje enviado! Te contactaremos pronto." },
        { status: 201 }
      );
    }

    // SECURITY: Check for injection attempts in all string fields
    const bodyString = JSON.stringify(body);
    if (detectInjectionAttempts(bodyString)) {
      logSecurityEvent({
        type: "injection_attempt",
        ip,
        details: `Injection attempt detected in contact form: ${bodyString.substring(0, 200)}`,
      });
      return NextResponse.json(
        { success: false, error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          // SECURITY: Don't expose detailed validation errors in production
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
      message: sanitizeInput(result.data.message),
      subject: result.data.subject ? sanitizeInput(result.data.subject) : undefined,
    };

    await prisma.message.create({ data: sanitizedData });

    return NextResponse.json(
      { success: true, message: "¡Mensaje enviado! Te contactaremos pronto." },
      { status: 201 }
    );
  } catch (error) {
    // SECURITY: Don't expose internal error details
    console.error("Contact form error");
    return NextResponse.json(
      { success: false, error: "Error al enviar mensaje" },
      { status: 500 }
    );
  }
}
