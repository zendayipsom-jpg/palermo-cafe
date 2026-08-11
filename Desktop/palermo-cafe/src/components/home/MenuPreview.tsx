"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star } from "lucide-react";

const categories = [
  { id: "sandwiches", label: "Sándwiches", emoji: "🥪" },
  { id: "palermitos", label: "Palermitos", emoji: "🤏" },
  { id: "desayunos", label: "Desayunos", emoji: "🍳" },
  { id: "bebidas", label: "Bebidas", emoji: "☕" },
  { id: "jugos", label: "Jugos", emoji: "🧃" },
  { id: "postres", label: "Postres", emoji: "🍰" },
];

const fallbackImages: Record<string, string> = {
  sandwiches: "/images/sandwich-chicharron-clasico.jpg",
  palermitos: "/images/sandwich-chicharron-clasico.jpg",
  desayunos: "/images/tamal-amarillo-porcion.jpg",
  bebidas: "/images/cafe-espresso-preparacion.jpg",
  jugos: "/images/ensalada-fresca.jpg",
  postres: "/images/arroz-con-pollo.jpg",
};

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  featured: boolean;
}

export default function MenuPreview() {
  const [activeCategory, setActiveCategory] = useState("sandwiches");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(
    (p) => p.category === activeCategory
  );
  const featured = filteredProducts.find((i) => i.featured);
  const rest = filteredProducts.filter((i) => i !== featured);

  const getImage = (product: Product) =>
    product.image || fallbackImages[product.category] || fallbackImages.sandwiches;

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      aria-labelledby="menu-heading"
    >
      {/* Parallax background texture */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-background to-muted/40" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/[0.04] rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-primary/[0.04] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-warm/[0.06] rounded-full blur-[150px]" />
      </motion.div>

      {/* Floating food images — decorative, subtle */}
      <motion.div
        className="absolute top-24 left-8 w-24 h-24 rounded-full overflow-hidden opacity-[0.06] hidden lg:block"
        animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/images/sandwich-chicharron-clasico.jpg"
          alt=""
          className="w-full h-full object-cover rounded-full"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        className="absolute top-40 right-12 w-20 h-20 rounded-full overflow-hidden opacity-[0.05] hidden lg:block"
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <img
          src="/images/cafe-portafiltro-granos.jpg"
          alt=""
          className="w-full h-full object-cover rounded-full"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-16 w-16 h-16 rounded-full overflow-hidden opacity-[0.05] hidden lg:block"
        animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <img
          src="/images/tamal-amarillo-porcion.jpg"
          alt=""
          className="w-full h-full object-cover rounded-full"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-1/4 w-14 h-14 rounded-full overflow-hidden opacity-[0.04] hidden xl:block"
        animate={{ y: [0, 6, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <img
          src="/images/pollo-a-la-brasa.jpg"
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
          className="text-center mb-10 sm:mb-16"
        >
          <span className="section-eyebrow text-brand-accent font-medium">
            Nuestra Carta
          </span>
          <h2
            id="menu-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 sm:mt-5 mb-4 sm:mb-6"
          >
            Sabores que <span className="text-brand-primary italic">enamoran</span>
          </h2>
          <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-4 sm:mb-6" />
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed px-2">
            Descubre nuestros platos preparados con ingredientes frescos y
            recetas que han pasado de generación en generación.
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-16 px-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-card border border-border/80 hover:border-brand-primary/30 hover:shadow-md"
              }`}
              aria-pressed={activeCategory === cat.id}
            >
              <span className="mr-1 sm:mr-1.5">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu items */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground mt-4">Cargando carta...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {/* Featured item */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-card border border-border/40 shadow-xl">
                    <div className="flex flex-col md:flex-row">
                      {/* Large image */}
                      <div className="relative w-full md:w-1/2 h-56 sm:h-72 md:h-96 overflow-hidden">
                        <img
                          src={getImage(featured)}
                          alt={featured.name}
                          className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 md:bg-gradient-to-r md:from-transparent md:to-card" />
                        {/* Popular badge */}
                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-1.5 bg-brand-accent text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                          Popular
                        </div>
                      </div>

                      {/* Content */}
                      <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 flex flex-col justify-center">
                        <span className="text-brand-accent text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3">
                          Favorito de la casa
                        </span>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-3 sm:mb-4">
                          {featured.name}
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5 sm:mb-8">
                          {featured.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl sm:text-3xl font-display font-bold text-brand-primary">
                            S/. {featured.price.toFixed(2)}
                          </span>
                          <a
                            href="/carta"
                            className="inline-flex items-center gap-2 text-brand-accent font-semibold hover:gap-3 transition-all duration-300"
                          >
                            Ver carta completa
                            <ArrowRight className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Remaining items grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rest.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                    >
                      <div className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-card border border-border/40 shadow-md card-lift">
                        {/* Image */}
                        <div className="relative w-full sm:w-44 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                          <img
                            src={getImage(item)}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute top-3 right-3 bg-brand-accent text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                            S/. {item.price.toFixed(2)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col justify-center">
                          <h3 className="text-lg font-display font-bold text-foreground mb-2">
                            {item.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No hay productos en esta categoría.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* View full menu CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a
            href="/carta"
            className="group inline-flex items-center justify-center gap-2 h-12 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/20"
          >
            Ver Carta Completa
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
