import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import { checkRateLimit, logSecurityEvent, getClientIp } from "@/lib/security";
import { loginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`login:${ip}`, { windowMs: 900000, maxRequests: 5 }, "login");
    if (!rl.allowed) {
      logSecurityEvent({
        type: "rate_limit",
        ip,
        details: "Login rate limit exceeded",
      });
      return NextResponse.json(
        {
          success: false,
          error: "Demasiados intentos. Espera 15 minutos.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // SECURITY: Use same error message for both cases to prevent user enumeration
    const CREDENTIALS_ERROR = "Credenciales inválidas";

    const user = await prisma.user.findUnique({ where: { email } });

    // Always run password verify even if user not found (timing attack mitigation)
    const dummyHash = "$2a$12$x".padEnd(60, "0");
    const hashToCheck = user?.password || dummyHash;
    const valid = await verifyPassword(password, hashToCheck);

    if (!user || !valid) {
      logSecurityEvent({
        type: "auth_failure",
        ip,
        details: `Failed login attempt for email: ${email}`,
      });
      return NextResponse.json(
        { success: false, error: CREDENTIALS_ERROR },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setAuthCookie(token);

    // SECURITY: Don't return the user ID in response
    return NextResponse.json({
      success: true,
      data: {
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    // SECURITY: Don't expose internal error details
    console.error("Login error");
    return NextResponse.json(
      { success: false, error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
