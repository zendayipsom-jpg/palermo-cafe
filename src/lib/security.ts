// ============================================
// Security Utilities
// OWASP Top 10 Protection
// ============================================

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ============================================
// Rate Limiting — Upstash Redis (persistente) o in-memory (fallback)
// ============================================

// Determinar si Upstash está configurado
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const USE_UPSTASH = UPSTASH_URL && UPSTASH_TOKEN;

// Upstash Redis client (solo si está configurado)
const redis = USE_UPSTASH
  ? new Redis({ url: UPSTASH_URL!, token: UPSTASH_TOKEN! })
  : null;

// Rate limiters para diferentes endpoints (Upstash)
const upstashLimiters = USE_UPSTASH
  ? {
      login: new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 intentos / 15 minutos
        analytics: true,
      }),
      api: new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests / minuto
        analytics: true,
      }),
      contact: new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 / hora
        analytics: true,
      }),
      newsletter: new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 / hora
        analytics: true,
      }),
    }
  : null;

// In-memory fallback para desarrollo
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

// ============================================
// Rate Limiting — Check
// ============================================

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 },
  limiterType: "login" | "api" | "contact" | "newsletter" = "api"
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  // Usar Upstash si está disponible (persistente en producción)
  if (USE_UPSTASH && upstashLimiters) {
    const limiter = upstashLimiters[limiterType];
    const result = await limiter.limit(identifier);
    return {
      allowed: result.success,
      remaining: result.remaining,
      resetTime: Date.now() + (result.reset - Date.now()),
    };
  }

  // Fallback: in-memory (desarrollo)
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// ============================================
// Input Sanitization
// ============================================

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

// SECURITY: Sanitize HTML content — allow safe tags only, strip scripts/event handlers
export function sanitizeHtml(html: string): string {
  return html
    // Strip script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Strip event handlers (onclick, onerror, onload, etc.)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    // Strip javascript: protocol
    .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, "")
    // Strip data: protocol from img src (except safe image types)
    .replace(/src\s*=\s*"data:(?!image\/(?:jpeg|png|gif|webp))[^"]*"/gi, "")
    // Strip vbscript: protocol
    .replace(/vbscript:/gi, "");
}

// SECURITY: Validate URL to prevent SSRF
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http/https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }
    // Block internal/private IPs
    const hostname = parsed.hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.") ||
      hostname.endsWith(".local")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ============================================
// CSRF Protection — Double-Submit Cookie Pattern
// ============================================
// Primary protection: SameSite=Strict cookies (set in auth.ts)
// Secondary: Origin/Referer validation in middleware.ts
// Tertiary: This token for double-submit pattern (optional, for extra defense)

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

// Set CSRF token cookie (call from middleware or layout)
export async function setCsrfCookie(token: string): Promise<void> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set("palermo-csrf", token, {
    httpOnly: false, // Must be readable by JavaScript for double-submit
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

// Validate CSRF token from header matches cookie
export function validateCsrfToken(
  headerToken: string | null,
  cookieToken: string | null
): boolean {
  if (!headerToken || !cookieToken) return false;
  // Constant-time comparison to prevent timing attacks
  if (headerToken.length !== cookieToken.length) return false;
  let result = 0;
  for (let i = 0; i < headerToken.length; i++) {
    result |= headerToken.charCodeAt(i) ^ cookieToken.charCodeAt(i);
  }
  return result === 0;
}

// ============================================
// Security Headers (consistent with middleware.ts and next.config.ts)
// ============================================

export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-DNS-Prefetch-Control": "off",
    "X-Download-Options": "noopen",
    "X-Permitted-Cross-Domain-Policies": "none",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",  // unsafe-inline for Framer Motion
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://maps.googleapis.com",
      "connect-src 'self' https://maps.googleapis.com",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  };
}

// ============================================
// IP Detection
// ============================================

export function getClientIp(request: Request): string {
  // SECURITY: Validate forwarded headers to prevent IP spoofing
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Only take the first IP (client IP)
    const ip = forwarded.split(",")[0].trim();
    // Basic IP format validation
    if (/^[\d.:a-fA-F]+$/.test(ip)) {
      return ip;
    }
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp && /^[\d.:a-fA-F]+$/.test(realIp)) {
    return realIp;
  }
  return "unknown";
}

// ============================================
// Security Logger
// ============================================

export interface SecurityEvent {
  type:
    | "auth_failure"
    | "rate_limit"
    | "invalid_input"
    | "csrf_attempt"
    | "injection_attempt"
    | "unauthorized_access";
  ip: string;
  details: string;
  timestamp: Date;
}

// SECURITY: Don't keep security log in memory (potential DoS via memory exhaustion)
// In production, send to external logging service
export function logSecurityEvent(
  event: Omit<SecurityEvent, "timestamp">
): void {
  const logEntry = {
    ...event,
    timestamp: new Date(),
  };

  // In production: send to SIEM/logging service (e.g., Datadog, ELK, CloudWatch)
  console.warn(
    `[SECURITY] ${logEntry.type} from ${logEntry.ip}: ${logEntry.details}`
  );
}

// ============================================
// Honeypot Protection (anti-bot)
// ============================================

// Honeypot field name that bots automatically fill but humans leave empty
export const HONEYPOT_FIELD = "website_url";

export function checkHoneypot(body: Record<string, unknown>): boolean {
  // If the honeypot field has any value, it's likely a bot
  const honeypotValue = body[HONEYPOT_FIELD];
  if (honeypotValue && typeof honeypotValue === "string" && honeypotValue.trim() !== "") {
    return false; // Bot detected
  }
  return true; // Human or empty — allow
}

// ============================================
// Content Validation (detect injection attempts)
// ============================================

export function detectInjectionAttempts(input: string): boolean {
  const patterns = [
    /(\b(union|select|insert|update|delete|drop|truncate|exec|execute)\b)/i,
    /(<script[\s>])/i,
    /(javascript:)/i,
    /(on\w+\s*=)/i,
    /(\/etc\/passwd)/i,
    /(\/etc\/shadow)/i,
    /(\.\.\/)/,
    /(\;\s*rm\s+-rf)/i,
    /(cmd\s*\/c)/i,
    /(\bexec\b.*\bexec\b)/i,
  ];
  return patterns.some((pattern) => pattern.test(input));
}
