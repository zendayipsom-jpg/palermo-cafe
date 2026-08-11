"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Calendar } from "lucide-react";

const posts = [
  {
    title: "La Historia del Sándwich Peruano",
    excerpt:
      "Descubre cómo el sándwich peruano se convirtió en un ícono gastronómico que une a familias desde hace más de 50 años.",
    date: "15 Mar 2024",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=250&fit=crop",
    slug: "historia-del-sandwich-peruano",
  },
  {
    title: "La Tradición Limeña en Cada Bocado",
    excerpt:
      "Cómo los sabores limeños han cruzado generaciones y se mantienen vivos en cada uno de nuestros locales.",
    date: "28 Feb 2024",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop",
    slug: "tradicion-limena-en-cada-bocado",
  },
  {
    title: "Cultura Gastronómica Peruana",
    excerpt:
      "El Perú es reconocido mundialmente por su gastronomía. Descubre por qué somos una potencia culinaria.",
    date: "10 Feb 2024",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
    slug: "cultura-gastronomica-peruana",
  },
];

export default function BlogPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-32 overflow-hidden"
      aria-labelledby="blog-heading"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,46,0.05),transparent_50%)]" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="section-eyebrow text-brand-accent font-medium">
            Blog
          </span>
          <h2
            id="blog-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 sm:mt-5 mb-4 sm:mb-6"
          >
            Historias de{" "}
            <span className="text-brand-primary italic">nuestra cocina</span>
          </h2>
          <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-4 sm:mb-6" />
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed px-2">
            Noticias, recetas y la historia detrás de cada plato.
          </p>
        </motion.div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <a href={`/blog/${post.slug}`} className="block group">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border/50 h-full card-lift">
                  {/* Image */}
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 sm:mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <time className="tracking-wide">{post.date}</time>
                    </div>
                    <h3 className="text-base sm:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 group-hover:text-brand-primary transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-brand-primary text-sm font-medium group-hover:gap-3 transition-all duration-300">
                      Leer más
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-14"
        >
          <a
            href="/blog"
            className="group inline-flex items-center justify-center gap-2 h-11 min-h-[44px] border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/20"
          >
            Ver Todos los Artículos
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
