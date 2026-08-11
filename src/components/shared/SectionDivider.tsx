"use client";

import { motion } from "framer-motion";

/* ============================================
   Marquee Banner — Infinite scrolling text bar
   ============================================ */
export function MarqueeDivider({ reverse = false }: { reverse?: boolean }) {
  const text = "SANDWICHES • CAFE • TRADICION • SABOR • ARTE CULINARIO • DESDE 1974 • PALERMO CAFE • ";
  const repeated = text.repeat(4);

  return (
    <div className="relative py-5 bg-brand-dark overflow-hidden">
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />

      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex shrink-0"
          animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
          transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-brand-accent/70 text-sm font-semibold tracking-[0.3em] uppercase px-4">
            {repeated}
          </span>
          <span className="text-brand-accent/70 text-sm font-semibold tracking-[0.3em] uppercase px-4">
            {repeated}
          </span>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />
    </div>
  );
}

/* ============================================
   Marquee Banner with icons between words
   ============================================ */
export function MarqueeWithIcons() {
  const items = [
    "SANDWICHES", "TRADICION", "CAFE", "SABOR", "ARTE CULINARIO",
    "DESDE 1974", "PALERMO CAFE", "LIMA", "GASTRONOMIA", "FRESCO",
  ];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="relative py-4 bg-brand-primary overflow-hidden">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex shrink-0 items-center gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        >
          {repeated.map((word, i) => (
            <span key={i} className="flex items-center gap-6">
              <span className="text-white/80 text-sm font-bold tracking-[0.25em] uppercase">
                {word}
              </span>
              <span className="text-brand-accent text-xs">◆</span>
            </span>
          ))}
        </motion.div>
        <motion.div
          className="flex shrink-0 items-center gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          {repeated.map((word, i) => (
            <span key={i} className="flex items-center gap-6">
              <span className="text-white/80 text-sm font-bold tracking-[0.25em] uppercase">
                {word}
              </span>
              <span className="text-brand-accent text-xs">◆</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================
   Marquee Banner — Reversed direction
   ============================================ */
export function MarqueeReversed() {
  const text = "INGREDIENTES FRESCOS • RECETAS DE ABUELA • AMOR EN CADA BOCADO • CALOR DE SIEMPRE • PALERMO CAFE • ";
  const repeated = text.repeat(4);

  return (
    <div className="relative py-4 bg-brand-accent overflow-hidden">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex shrink-0"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-brand-dark text-sm font-bold tracking-[0.25em] uppercase px-4">
            {repeated}
          </span>
          <span className="text-brand-dark text-sm font-bold tracking-[0.25em] uppercase px-4">
            {repeated}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================
   Gradient Divider — Shimmering line
   ============================================ */
export function GradientDivider() {
  return (
    <div className="relative py-6 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative h-px w-full overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-secondary/30 to-transparent" />
          <motion.div
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-brand-accent to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
