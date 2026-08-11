import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/security";

// Magic bytes para validar que el archivo es realmente una imagen
const IMAGE_MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [
    [0xff, 0xd8, 0xff], // JPEG
  ],
  "image/png": [
    [0x89, 0x50, 0x4e, 0x47], // PNG
  ],
  "image/gif": [
    [0x47, 0x49, 0x46, 0x38], // GIF87a o GIF89a
  ],
  "image/webp": [
    [0x52, 0x49, 0x46, 0x46], // RIFF (WebP empieza con RIFF)
  ],
};

function validateMagicBytes(buffer: ArrayBuffer, declaredType: string): boolean {
  const bytes = new Uint8Array(buffer);
  const expectedSignatures = IMAGE_MAGIC_BYTES[declaredType];

  if (!expectedSignatures) return false;

  return expectedSignatures.some((signature) =>
    signature.every((byte, index) => bytes[index] === byte)
  );
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

    // SECURITY: Rate limit uploads — 10 per hour per user
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`upload:${user.id}:${ip}`, { windowMs: 3600000, maxRequests: 10 }, "api");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas subidas. Intenta más tarde." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó archivo" },
        { status: 400 }
      );
    }

    // Validate file type (MIME type)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Tipo de archivo no permitido. Usa JPG, PNG, WebP o GIF" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "El archivo excede 5MB" },
        { status: 400 }
      );
    }

    // ⚠️ SECURITY: Validate magic bytes — confirma que el archivo es realmente una imagen
    const bytes = await file.arrayBuffer();
    if (!validateMagicBytes(bytes, file.type)) {
      return NextResponse.json(
        { success: false, error: "El archivo no es una imagen válida (magic bytes inválidos)" },
        { status: 400 }
      );
    }

    // Generate unique filename (siempre usar extensión basada en MIME type real)
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };
    const ext = mimeToExt[file.type] || "jpg";
    const filename = `${randomUUID()}.${ext}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, Buffer.from(bytes));

    // Return public URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, error: "Error al subir archivo" },
      { status: 500 }
    );
  }
}
