import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sanitizeHtml, sanitizeInput, checkRateLimit, getClientIp } from "@/lib/security";

// SECURITY: Whitelist of allowed fields for blog post updates (prevents mass assignment)
const ALLOWED_BLOG_FIELDS = [
  "title", "slug", "excerpt", "content", "image",
  "published", "tags", "metaTitle", "metaDesc",
] as const;

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener artículos" },
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

    // SECURITY: Rate limit admin writes — 20 per hour per user
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`admin:blog:${user.id}:${ip}`, { windowMs: 3600000, maxRequests: 20 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { title, slug, excerpt, content, image, published, tags, metaTitle, metaDesc } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Título y contenido son requeridos" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const post = await prisma.blogPost.create({
      data: {
        title: sanitizeInput(title),
        slug: finalSlug,
        excerpt: excerpt ? sanitizeInput(excerpt) : undefined,
        content: sanitizeHtml(content),
        image,
        author: user.name || user.email,
        published: published ?? false,
        tags: tags ? sanitizeInput(tags) : undefined,
        metaTitle: metaTitle ? sanitizeInput(metaTitle) : undefined,
        metaDesc: metaDesc ? sanitizeInput(metaDesc) : undefined,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear artículo" },
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

    // SECURITY: Rate limit admin writes — 20 per hour per user
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`admin:blog:${user.id}:${ip}`, { windowMs: 3600000, maxRequests: 20 }, "api");
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
        { success: false, error: "ID del artículo es requerido" },
        { status: 400 }
      );
    }

    // SECURITY: Only allow whitelisted fields (prevents mass assignment)
    const data: Record<string, unknown> = {};
    for (const field of ALLOWED_BLOG_FIELDS) {
      if (rawData[field] !== undefined) {
        data[field] = rawData[field];
      }
    }

    // SECURITY: Sanitize content and string fields
    if (data.content) data.content = sanitizeHtml(data.content as string);
    if (data.title) data.title = sanitizeInput(data.title as string);
    if (data.excerpt) data.excerpt = sanitizeInput(data.excerpt as string);
    if (data.tags) data.tags = sanitizeInput(data.tags as string);

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar artículo" },
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
    const rl = await checkRateLimit(`admin:blog:delete:${user.id}:${ip}`, { windowMs: 3600000, maxRequests: 20 }, "api");
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
        { success: false, error: "ID del artículo es requerido" },
        { status: 400 }
      );
    }

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar artículo" },
      { status: 500 }
    );
  }
}
