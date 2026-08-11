import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener locales" },
      { status: 500 }
    );
  }
}
