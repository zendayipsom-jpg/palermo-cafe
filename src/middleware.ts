import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Cookie name must match auth.ts COOKIE_NAME
const AUTH_COOKIE_NAME = "palermo-auth";

// JWT secret for middleware verification
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-only-secret-DO-NOT-USE-IN-PRODUCTION"
);

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // ============================================
  // Security Headers (consistent with next.config.ts)
  // ============================================
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  // Additional security headers
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // ============================================
  // Content Security Policy
  // ============================================
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // Development: Relaxed CSP for Next.js HMR and React hydration
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // Required for Next.js dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://maps.googleapis.com",
      "connect-src 'self' http://localhost:* ws://localhost:*",  // HMR websocket
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");
    response.headers.set("Content-Security-Policy", csp);
  } else {
    // Production: Strict CSP (with allowances for Framer Motion)
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",  // 'unsafe-eval' needed for Framer Motion animations
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",  // 'unsafe-inline' for Framer Motion styles
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://maps.googleapis.com",
      "connect-src 'self' https://maps.googleapis.com",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");
    response.headers.set("Content-Security-Policy", csp);
  }

  // ============================================
  // CSRF Protection — Validar Origin en APIs admin
  // ============================================
  if (pathname.startsWith("/api/admin")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    // En producción, validar que el Origin coincida con el host
    if (!isDev && origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json(
            { success: false, error: "CSRF: Origin no válido" },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, error: "CSRF: Origin inválido" },
          { status: 403 }
        );
      }
    }

    // También validar Referer como capa adicional
    const referer = request.headers.get("referer");
    if (!isDev && referer) {
      try {
        const refererUrl = new URL(referer);
        if (refererUrl.host !== host) {
          return NextResponse.json(
            { success: false, error: "CSRF: Referer no válido" },
            { status: 403 }
          );
        }
      } catch {
        // Referer malformado — permitir porque algunos browsers no lo envían
      }
    }
  }

  // ============================================
  // Protect admin routes - verify JWT signature
  // ============================================
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // SECURITY: Verify JWT signature in middleware (not just cookie existence)
    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      // Invalid or expired JWT — clear cookie and redirect to login
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.set(AUTH_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
