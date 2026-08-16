"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, UtensilsCrossed, Calendar } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      role="banner"
      aria-label="Bienvenida a Palermo Café"
    >
      {/* Food photography background with parallax + zoom */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale }}
      >
        <img
          src="https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1920&h=1080&fit=crop&crop=center"
          alt=""
          className="absolute inset-0 w-full h-[120%] object-cover"
          aria-hidden="true"
        />
        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-espresso/40 via-transparent to-brand-primary/20" />
        {/* Subtle warm vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
      </motion.div>

      {/* Film grain texture */}
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* Floating food elements — softer, more organic */}
      <motion.div
        className="absolute top-32 left-8 w-56 h-56 rounded-full overflow-hidden opacity-[0.12] hidden lg:block"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 4, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop"
          alt=""
          className="w-full h-full object-cover rounded-full"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-12 w-44 h-44 rounded-full overflow-hidden opacity-[0.10] hidden lg:block"
        animate={{
          y: [0, 22, 0],
          rotate: [0, -6, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="https://images.unsplash.com/photo-1509722747041-616f39b57569?w=250&h=250&fit=crop"
          alt=""
          className="w-full h-full object-cover rounded-full"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        className="absolute top-48 right-1/4 w-28 h-28 rounded-full overflow-hidden opacity-[0.08] hidden xl:block"
        animate={{
          y: [0, -12, 0],
          x: [0, 6, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <img
          src="https://images.unsplash.com/photo-1553909489-cd47e0907980?w=200&h=200&fit=crop"
          alt=""
          className="w-full h-full object-cover rounded-full"
          aria-hidden="true"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-5xl mx-auto"
        style={{ y: textY, opacity }}
      >
        {/* Heritage badge — refined */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/[0.07] backdrop-blur-md rounded-full border border-white/[0.12] mb-6 sm:mb-10"
        >
          <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse" />
          <span className="text-white text-[10px] sm:text-xs font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            Desde 1974
          </span>
          <span className="w-px h-3 bg-white/40" />
          <span className="text-white text-[10px] sm:text-xs font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            Tradición y Sabor
          </span>
        </motion.div>

        {/* Main heading — Logo image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex justify-center mb-2"
        >
          <Image
            src="/logo-palermo.webp"
            alt="Palermo Café — Desde 1974"
            width={480}
            height={220}
            className="w-[220px] sm:w-[280px] md:w-[380px] lg:w-[460px] h-auto drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Decorative accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="w-16 sm:w-24 h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto my-5 sm:my-8"
        />

        {/* Tagline — elegant italic */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-3 sm:mb-4 font-display italic px-2"
        >
          Más de 50 años uniendo amigos con tradición y sabor
        </motion.p>

        {/* Sub-description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-xs sm:text-sm md:text-base text-white/60 max-w-lg mx-auto mb-8 sm:mb-14 tracking-wide px-2"
        >
          Los mejores sándwiches artesanales de Lima. Ingredientes frescos,
          recetas tradicionales y el calor de siempre.
        </motion.p>

        {/* CTA Buttons — refined */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
        >
          <a
            href="/carta"
            className="group inline-flex items-center justify-center gap-3 h-12 sm:h-14 px-8 sm:px-12 bg-brand-accent hover:bg-brand-accent/90 text-white text-sm sm:text-base btn-shine rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-brand-accent/25 hover:shadow-brand-accent/40 hover:scale-[1.02]"
          >
            <UtensilsCrossed className="w-5 h-5 transition-transform group-hover:rotate-12" />
            Ver Carta
          </a>
          <a
            href="/reservas"
            className="group inline-flex items-center justify-center gap-3 h-12 sm:h-14 px-8 sm:px-12 border border-white/20 text-white hover:bg-white/[0.08] hover:border-white/30 text-sm sm:text-base rounded-2xl font-semibold transition-all duration-300 bg-white/[0.04] backdrop-blur-sm"
          >
            <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
            Reservar Ahora
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />

      {/* Scroll indicator — minimal */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <a
          href="#historia"
          className="flex flex-col items-center text-white/30 hover:text-white/60 transition-colors duration-300 group"
          aria-label="Descubre más"
        >
          <span className="text-[10px] mb-3 tracking-[0.4em] uppercase font-medium">
            Descubre
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
