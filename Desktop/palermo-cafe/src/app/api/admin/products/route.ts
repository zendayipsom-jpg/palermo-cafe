import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sanitizeInput, checkRateLimit, getClientIp } from "@/lib/security";

// SECURITY: Whitelist of allowed fields for product updates (prevents mass assignment)
const ALLOWED_PRODUCT_FIELDS = [
  "name", "description", "price", "category", "image",
  "available", "featured", "order",
] as const;

export async function GET() {
  try {
    // SECURITY: Require authentication to access admin product list
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // SECURITY: Rate limit admin writes — 30 per hour per user
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`admin:products:${user.id}:${ip}`, { windowMs: 3600000, maxRequests: 30 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, description, price, category, image, available, featured, order } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json(
        { success: false, error: "Nombre, precio y categoría son requeridos" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: sanitizeInput(name),
        description: description ? sanitizeInput(description) : undefined,
        price: parseFloat(price),
        category,
        image,
        available: available ?? true,
        featured: featured ?? false,
        order: order ? parseInt(order, 10) : 0,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear producto" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // SECURITY: Rate limit admin writes — 30 per hour per user
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`admin:products:${user.id}:${ip}`, { windowMs: 3600000, maxRequests: 30 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { id, ...rawData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID del producto es requerido" },
        { status: 400 }
      );
    }

    // SECURITY: Only allow whitelisted fields (prevents mass assignment)
    const data: Record<string, unknown> = {};
    for (const field of ALLOWED_PRODUCT_FIELDS) {
      if (rawData[field] !== undefined) {
        data[field] = rawData[field];
      }
    }

    // SECURITY: Sanitize string fields
    if (data.name) data.name = sanitizeInput(data.name as string);
    if (data.description) data.description = sanitizeInput(data.description as string);

    if (data.price !== undefined) {
      data.price = parseFloat(data.price as string);
    }
    if (data.order !== undefined) {
      data.order = parseInt(data.order as string, 10);
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // SECURITY: Rate limit admin deletes — 20 per hour per user
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`admin:products:delete:${user.id}:${ip}`, { windowMs: 3600000, maxRequests: 20 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID del producto es requerido" },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
