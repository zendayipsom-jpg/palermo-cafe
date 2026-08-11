import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// CRITICAL: Never use hardcoded secrets. Require JWT_SECRET in production.
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[SECURITY] JWT_SECRET is not set. Refusing to start without it."
    );
  }
  // Development-only fallback with warning
  console.warn(
    "[SECURITY WARNING] Using development-only JWT_SECRET. Set JWT_SECRET env var for production!"
  );
}
const JWT_SECRET = new TextEncoder().encode(
  rawSecret || "dev-only-secret-DO-NOT-USE-IN-PRODUCTION"
);

const COOKIE_NAME = "palermo-auth";

export interface JWTPayload {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

// ============================================
// Password Hashing
// ============================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ============================================
// JWT Operations
// ============================================

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ============================================
// Cookie Management
// ============================================

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true, // No accesible desde JavaScript (previene XSS)
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "strict", // Previene ataques CSRF desde otros sitios
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value || null;
}

// ============================================
// Auth Helpers
// ============================================

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin(): Promise<JWTPayload> {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}
