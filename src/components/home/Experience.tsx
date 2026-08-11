"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Heart, Leaf, ChefHat } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Tradición Familiar",
    description:
      "Cada receta ha pasado de generación en generación, manteniendo el sabor auténtico que nos define desde 1974.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
  },
  {
    icon: ChefHat,
    title: "Preparación Artesanal",
    description:
      "Nuestros sándwiches se preparan frente al cliente, con técnicas tradicionales y el cuidado que solo la experiencia puede dar.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop",
  },
  {
    icon: Leaf,
    title: "Ingredientes Seleccionados",
    description:
      "Seleccionamos cuidadosamente cada ingrediente para garantizar la frescura y calidad que nuestros clientes merecen.",
    image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=600&h=400&fit=crop",
  },
];

export default function Experience() {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-brand-dark text-white overflow-hidden relative"
      aria-labelledby="experience-heading"
    >
      {/* Parallax background image */}
      <motion.div className="absolute inset-0 opacity-[0.06]" style={{ y: bgY }}>
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=1200&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-[120%] object-cover"
          aria-hidden="true"
        />
      </motion.div>

      {/* Warm gradient orbs */}
      <div className="absolute top-0 -left-32 w-[500px] h-[500px] bg-brand-accent/[0.06] rounded-full blur-[140px]" />
      <div className="absolute bottom-0 -right-32 w-[400px] h-[400px] bg-brand-primary/[0.06] rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-warm/[0.04] rounded-full blur-[160px]" />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-32 right-16 w-20 h-20 rounded-full overflow-hidden opacity-[0.07] hidden lg:block"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=180&h=180&fit=crop"
          alt=""
          className="w-full h-full object-cover rounded-full"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-12 w-16 h-16 rounded-full overflow-hidden opacity-[0.06] hidden lg:block"
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

      {/* Grain overlay */}
      <div className="absolute inset-0 grain pointer-events-none opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <span className="section-eyebrow text-brand-accent font-medium">
            La Experiencia
          </span>
          <h2
            id="experience-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mt-4 sm:mt-5 mb-4 sm:mb-6"
          >
            ¿Por qué elegir{" "}
            <span className="text-brand-accent italic">Palermo Café</span>?
          </h2>
          <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-4 sm:mb-6" />
          <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed px-2">
            No somos solo un restaurante. Somos una tradición que se vive en
            cada bocado.
          </p>
        </motion.div>

        {/* Features grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.08] hover:border-brand-accent/30 transition-all duration-500 hover:bg-white/[0.06]">
                  {/* Image */}
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
                    {/* Icon floating on image */}
                    <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 bg-brand-accent/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-brand-accent/20">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-display font-bold mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats — more dramatic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          {[
            { number: "50+", label: "Años de tradición" },
            { number: "4", label: "Locales en Lima" },
            { number: "100K+", label: "Sándwiches vendidos" },
            { number: "4.8", label: "Rating promedio" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-brand-accent mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="text-white/40 text-xs sm:text-sm tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
