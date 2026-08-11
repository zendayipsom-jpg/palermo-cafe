// ============================================
// Product Types
// ============================================

export type ProductCategory = "sandwiches" | "palermitos" | "desayunos" | "bebidas" | "jugos" | "postres";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: ProductCategory;
  image: string | null;
  available: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Location Types
// ============================================

export interface Location {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  hours: string;
  mapUrl: string | null;
  lat: number | null;
  lng: number | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Reservation Types
// ============================================

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  guests: number;
  date: string;
  time: string;
  message: string | null;
  status: ReservationStatus;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Blog Types
// ============================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  author: string;
  published: boolean;
  tags: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

// ============================================
// User Types
// ============================================

export type UserRole = "admin" | "editor";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Message Types
// ============================================

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

// ============================================
// Newsletter Types
// ============================================

export interface Newsletter {
  id: string;
  email: string;
  active: boolean;
  createdAt: Date;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// Navigation Types
// ============================================

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// ============================================
// Timeline Types
// ============================================

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image?: string;
}
