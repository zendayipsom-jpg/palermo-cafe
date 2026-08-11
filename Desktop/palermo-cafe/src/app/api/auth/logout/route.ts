import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  // Verify user is logged in before clearing session
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: true }); // Already logged out
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("palermo-auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // SECURITY: Match login cookie setting
    maxAge: 0,
    path: "/",
  });

  return response;
}
