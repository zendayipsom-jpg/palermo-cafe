"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const timeline = [
  {
    year: "1974",
    title: "El Comienzo",
    description:
      "Nace Palermo Café en Balconcillo, La Victoria. Una pequeña puesta que rápidamente se convirtió en el punto de encuentro de los vecinos.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop",
  },
  {
    year: "1985",
    title: "El Primer Local",
    description:
      "Abrimos nuestro segundo local en Benavides, Miraflores. Los limeños de la Costa ya también podían disfrutar de nuestros sándwiches.",
    image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop",
  },
  {
    year: "2000",
    title: "Expansión",
    description:
      "Llegamos a San Borja y El Polo. Cuatro locales, una misma familia, el mismo sabor de siempre.",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop",
  },
  {
    year: "Hoy",
    title: "Tradición Viva",
    description:
      "Más de 50 años después, seguimos preparando cada sándwich con el mismo cariño y la misma receta que nos hizo famosos.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
  },
];

export default function History() {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={sectionRef}
      id="historia"
      className="relative py-32 bg-background overflow-hidden"
      aria-labelledby="history-heading"
    >
      {/* Subtle parallax background image */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{ y: bgY }}
      >
        <img
          src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1920&h=1200&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-[120%] object-cover"
          aria-hidden="true"
        />
      </motion.div>

      {/* Decorative warm gradient orbs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-brand-accent/[0.04] rounded-full blur-[120px]" />
      <div className="absolute bottom-20 -right-32 w-80 h-80 bg-brand-primary/[0.04] rounded-full blur-[100px]" />

      {/* Floating decorative food elements */}
      <motion.div
        className="absolute top-40 right-16 w-20 h-20 rounded-full overflow-hidden opacity-[0.07] hidden lg:block"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop"
          alt=""
          className="w-full h-full object-cover rounded-full"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-60 left-12 w-16 h-16 rounded-full overflow-hidden opacity-[0.06] hidden lg:block"
        animate={{ y: [0, 8, 0], rotate: [0, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop"
          alt=""
          className="w-full h-full object-cover rounded-full"
          aria-hidden="true"
        />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 sm:mb-24"
        >
          <span className="section-eyebrow text-brand-accent font-medium">
            Nuestra Historia
          </span>
          <h2
            id="history-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 sm:mt-5 mb-4 sm:mb-6"
          >
            Más de 50 años de{" "}
            <span className="text-brand-primary italic">tradición</span>
          </h2>
          <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-4 sm:mb-6" />
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed px-2">
            Desde una pequeña puesta en Balconcillo hasta ser un ícono
            gastronómico limeño.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 sm:left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-accent/40 via-brand-primary/20 to-transparent md:-translate-x-px" />

          <div className="space-y-12 sm:space-y-20">
            {timeline.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className={`relative flex items-center ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content with image */}
                  <div
                    className={`ml-10 sm:ml-14 md:ml-0 md:w-1/2 ${
                      isLeft ? "md:pr-20" : "md:pl-20"
                    }`}
                  >
                    <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-border/30 card-lift">
                      {/* Image */}
                      <div className="relative h-48 sm:h-60 overflow-hidden">
                        <img
                          src={item.image}
                          alt={`${item.title} - Palermo Café ${item.year}`}
                          className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        {/* Year badge */}
                        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg">
                          <span className="text-brand-primary font-display text-sm sm:text-base font-bold tracking-wide">
                            {item.year}
                          </span>
                        </div>
                      </div>

                      {/* Text content */}
                      <div className="p-5 sm:p-7 bg-card">
                        <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2 sm:mb-3">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-5 sm:left-6 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-brand-accent rounded-full border-[2px] sm:border-[3px] border-background shadow-lg z-10 ring-3 sm:ring-4 ring-brand-accent/10" />

                  {/* Spacer */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
