"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import { GradientDivider } from "@/components/shared/SectionDivider";

const categories = [
  { id: "all", label: "Todos", emoji: "🍽️" },
  { id: "sandwiches", label: "Sándwiches", emoji: "🥪" },
  { id: "palermitos", label: "Palermitos", emoji: "🤏" },
  { id: "desayunos", label: "Desayunos", emoji: "🍳" },
  { id: "bebidas", label: "Bebidas", emoji: "☕" },
  { id: "jugos", label: "Jugos", emoji: "🧃" },
  { id: "postres", label: "Postres", emoji: "🍰" },
];

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  featured: boolean;
}

const fallbackImages: Record<string, string> = {
  sandwiches: "/images/sandwich-chicharron-clasico.jpg",
  palermitos: "/images/sandwich-chicharron-clasico.jpg",
  desayunos: "/images/tamal-amarillo-porcion.jpg",
  bebidas: "/images/cafe-espresso-preparacion.jpg",
  jugos: "/images/ensalada-fresca.jpg",
  postres: "/images/arroz-con-pollo.jpg",
};

export default function CartaPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const menuSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: menuScrollYProgress } = useScroll({
    target: menuSectionRef,
    offset: ["start end", "end start"],
  });
  const menuBgY = useTransform(menuScrollYProgress, [0, 1], ["0%", "5%"]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero with parallax food image */}
        <section ref={heroRef} className="relative py-24 sm:py-32 overflow-hidden">
          {/* Parallax background */}
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <img
              src="/images/lomo-saltado.jpg"
              alt=""
              className="absolute inset-0 w-full h-[130%] object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/85 via-brand-dark/70 to-brand-dark/90" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-espresso/30 via-transparent to-brand-primary/20" />
          </motion.div>

          {/* Floating food elements */}
          <motion.div
            className="absolute top-20 right-10 w-40 h-40 rounded-full overflow-hidden opacity-15 hidden lg:block"
            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="/images/sandwich-chicharron-clasico.jpg"
              alt=""
              className="w-full h-full object-cover rounded-full"
              aria-hidden="true"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-10 w-32 h-32 rounded-full overflow-hidden opacity-10 hidden lg:block"
            animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <img
              src="/images/sandwich-lomo-fino.jpg"
              alt=""
              className="w-full h-full object-cover rounded-full"
              aria-hidden="true"
            />
          </motion.div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-accent font-medium tracking-wider uppercase text-xs sm:text-sm">
                Nuestra Carta
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mt-4 mb-4 sm:mb-6 px-2">
                Sabores que{" "}
                <span className="text-brand-accent italic">enamoran</span>
              </h1>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-4 sm:mb-6" />
              <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Descubre todos nuestros platos preparados con ingredientes
                frescos y recetas que han pasado de generación en generación.
              </p>
            </motion.div>
          </div>
        </section>

        <GradientDivider />

        {/* Menu with parallax background */}
        <section ref={menuSectionRef} className="relative py-12 sm:py-16 overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: menuBgY }}>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
          </motion.div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
                    activeCategory === cat.id
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border hover:border-brand-primary/30"
                  }`}
                >
                  <span className="mr-1 sm:mr-1.5">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full mx-auto" />
                <p className="text-muted-foreground mt-4">Cargando carta...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                    >
                      <Card className="overflow-hidden card-premium bg-card border-border/50 shadow-lg h-full group">
                        <div className="relative h-44 sm:h-56 overflow-hidden">
                          <img
                            src={
                              product.image ||
                              fallbackImages[product.category] ||
                              fallbackImages.sandwiches
                            }
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-brand-accent text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                            S/. {product.price.toFixed(2)}
                          </div>
                          {product.featured && (
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm text-brand-primary px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-1">
                              ⭐ Popular
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4 sm:p-6">
                          <h3 className="text-base sm:text-lg font-display font-bold text-foreground mb-1.5 sm:mb-2 group-hover:text-brand-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {product.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12 sm:py-16">
                <p className="text-muted-foreground text-base sm:text-lg">
                  No hay productos disponibles en esta categoría.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
