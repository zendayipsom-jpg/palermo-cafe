"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Inicio", href: "/" },
  {
    label: "Nuestra Historia",
    href: "/#historia",
  },
  {
    label: "Carta",
    href: "/carta",
  },
  {
    label: "Locales",
    href: "/locales",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Contacto",
    href: "/#contacto",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;

    // Si está en la parte superior, siempre mostrar
    if (currentScrollY < 100) {
      setHidden(false);
      lastScrollY.current = currentScrollY;
      return;
    }

    // Si baja más de 80px, ocultar
    if (currentScrollY > lastScrollY.current + 80) {
      setHidden(true);
      lastScrollY.current = currentScrollY;
    }
    // Si sube más de 40px, mostrar
    else if (currentScrollY < lastScrollY.current - 40) {
      setHidden(false);
      lastScrollY.current = currentScrollY;
    }
  });

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <a href="/" className="inline-flex items-center">
            <Image
              src="/logo-header.png"
              alt="Palermo Café"
              width={160}
              height={64}
              className="object-contain"
              priority
              style={{ height: 48, width: "auto" }}
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isScrolled
                    ? "text-foreground/70 hover:text-foreground hover:bg-muted"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/reservas"
              className="inline-flex items-center justify-center h-9 gap-1.5 px-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              Reservar Mesa
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className={`w-5 h-5 ${isScrolled ? "text-foreground" : "text-white"}`} />
            ) : (
              <Menu className={`w-5 h-5 ${isScrolled ? "text-foreground" : "text-white"}`} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <div className="px-4 py-4 sm:py-6 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3.5 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors min-h-[44px] flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 sm:pt-4">
                <a
                  href="/reservas"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center w-full h-11 gap-1.5 px-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-lg text-sm font-medium transition-all"
                >
                  Reservar Mesa
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
