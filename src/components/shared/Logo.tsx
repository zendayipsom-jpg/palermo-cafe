"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "text";
  size?: "sm" | "md" | "lg";
}

export default function Logo({
  className = "",
  variant = "full",
  size = "md",
}: LogoProps) {
  const heights = {
    sm: 36,
    md: 48,
    lg: 64,
  };

  const iconHeights = {
    sm: 32,
    md: 40,
    lg: 56,
  };

  const h = variant === "icon" ? iconHeights[size] : heights[size];

  return (
    <motion.a
      href="/"
      className={`inline-flex items-center ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-label="Palermo Café - Ir al inicio"
    >
      {variant === "text" ? (
        <span className="font-display font-bold text-2xl tracking-tight text-brand-primary">
          PALERMO
          <span className="text-brand-accent block text-sm font-medium tracking-[0.3em] uppercase">
            Café
          </span>
        </span>
      ) : (
        <Image
          src="/logo-palermo.webp"
          alt="Palermo Café — Desde 1974"
          width={h * 2.2}
          height={h}
          className="object-contain"
          priority
          style={{ height: h, width: "auto" }}
        />
      )}
    </motion.a>
  );
}
