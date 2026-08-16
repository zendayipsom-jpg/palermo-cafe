import { z } from "zod";

// ============================================
// Product Validation
// ============================================

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z.string().max(500, "La descripción no puede exceder 500 caracteres").optional(),
  price: z.number().positive("El precio debe ser mayor a 0").max(9999.99, "Precio inválido"),
  category: z.enum(["sandwiches", "desayunos", "bebidas", "postres"], {
    error: "Categoría inválida",
  }),
  image: z.string().url("URL de imagen inválida").optional().or(z.literal("")),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export type ProductInput = z.infer<typeof productSchema>;

// ============================================
// Reservation Validation
// ============================================

export const reservationSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  phone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(20, "Teléfono inválido")
    .regex(/^[\d\s+\-().]+$/, "Formato de teléfono inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  guests: z
    .number()
    .int("El número de personas debe ser un entero")
    .min(1, "Mínimo 1 persona")
    .max(50, "Máximo 50 personas"),
  date: z.string().min(1, "La fecha es requerida"),
  time: z.string().min(1, "La hora es requerida"),
  message: z.string().max(500, "El mensaje no puede exceder 500 caracteres").optional(),
  location: z.string().optional(),
  // Honeypot field — must be empty string for humans
  website_url: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

// ============================================
// Contact Message Validation
// ============================================

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  subject: z.string().max(200, "El asunto no puede exceder 200 caracteres").optional(),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(2000, "El mensaje no puede exceder 2000 caracteres"),
  // Honeypot field — must be empty string for humans
  website_url: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ============================================
// Newsletter Validation
// ============================================

export const newsletterSchema = z.object({
  email: z.string().email("Email inválido"),
  // Honeypot field — must be empty string for humans
  website_url: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

// ============================================
// Blog Post Validation
// ============================================

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(200, "El título no puede exceder 200 caracteres"),
  slug: z
    .string()
    .min(5, "El slug debe tener al menos 5 caracteres")
    .max(200, "El slug no puede exceder 200 caracteres")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  excerpt: z.string().max(500, "El extracto no puede exceder 500 caracteres").optional(),
  content: z.string().min(50, "El contenido debe tener al menos 50 caracteres"),
  image: z.string().url("URL de imagen inválida").optional().or(z.literal("")),
  published: z.boolean().default(false),
  tags: z.string().optional(),
  metaTitle: z.string().max(200).optional(),
  metaDesc: z.string().max(300).optional(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// ============================================
// Auth Validation
// ============================================

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// Location Validation
// ============================================

export const locationSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(5).max(200),
  district: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  hours: z.string().min(5).max(100),
  mapUrl: z.string().url().optional().or(z.literal("")),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  order: z.number().int().min(0).default(0),
});

export type LocationInput = z.infer<typeof locationSchema>;
