"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const galleryImages = [
  {
    src: "/images/sandwich-lomo-fino.jpg",
    alt: "Sándwich de Lomo Fino",
    span: "col-span-1 row-span-2",
  },
  {
    src: "/images/cafe-espresso-preparacion.jpg",
    alt: "Café espresso artesanal",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/pollo-a-la-brasa.jpg",
    alt: "Pollo a la brasa",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/sandwich-chicharron-clasico.jpg",
    alt: "Sándwich de Chicharrón",
    span: "col-span-1 row-span-2",
  },
  {
    src: "/images/lomo-saltado.jpg",
    alt: "Lomo saltado",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/tamal-amarillo-porcion.jpg",
    alt: "Tamal de chancho",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/cafe-portafiltro-granos.jpg",
    alt: "Café en portafiltro",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/arroz-con-mariscos.jpg",
    alt: "Arroz con mariscos",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/papa-a-la-huancaina.jpg",
    alt: "Papa a la huancaína",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/sandwich-jamon-pais.jpg",
    alt: "Sándwich de Jamón del País",
    span: "col-span-1 row-span-1",
  },
];

export default function FoodGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section ref={ref} className="relative py-16 sm:py-24 overflow-hidden" aria-label="Galería de imágenes">
      {/* Full-width parallax background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=800&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-[120%] object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-brand-dark/88" />
      </motion.div>

      {/* Grain overlay */}
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Quote / tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="w-8 sm:w-10 h-px bg-brand-accent/60" />
            <span className="section-eyebrow text-brand-accent font-medium">
              Nuestros Sabores
            </span>
            <div className="w-8 sm:w-10 h-px bg-brand-accent/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white max-w-4xl mx-auto leading-tight px-2">
            Cada imagen cuenta una{" "}
            <span className="text-brand-accent italic">historia</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base mt-4 sm:mt-6 max-w-xl mx-auto leading-relaxed px-2">
            Detrás de cada plato hay décadas de tradición, pasión y los mejores ingredientes del Perú.
          </p>
        </motion.div>

        {/* Masonry-style gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[220px]">
          {galleryImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.23, 1, 0.32, 1],
              }}
              className={`relative overflow-hidden rounded-lg sm:rounded-xl group cursor-pointer ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                loading="lazy"
              />
              {/* Hover overlay — elegant reveal */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-white text-xs sm:text-sm font-medium tracking-wide">
                  {img.alt}
                </span>
              </div>
              {/* Subtle border on hover */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-lg sm:rounded-xl transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
