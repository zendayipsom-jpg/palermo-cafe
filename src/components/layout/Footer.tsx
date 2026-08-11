"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

// Custom social icons (lucide-react doesn't export brand icons)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const locations = [
  {
    name: "La Victoria",
    address: "Av. Palermo 270, La Victoria",
    phone: "(01) 123-4567",
  },
  {
    name: "Miraflores",
    address: "Av. Alfredo Benavides 2518, Miraflores",
    phone: "(01) 234-5678",
  },
  {
    name: "San Borja",
    address: "Av. San Borja Norte 417, San Borja",
    phone: "(01) 345-6789",
  },
  {
    name: "Surco",
    address: "Jr. El Polo 255, Santiago de Surco",
    phone: "(01) 456-7890",
  },
];

const footerLinks = [
  {
    title: "Nosotros",
    links: [
      { label: "Nuestra Historia", href: "/#historia" },
      { label: "Carta", href: "/carta" },
      { label: "Locales", href: "/locales" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos y Condiciones", href: "/terminos" },
      { label: "Política de Privacidad", href: "/privacidad" },
      { label: "Libro de Reclamaciones", href: "/reclamaciones" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  return (
    <footer className="bg-brand-dark text-white" role="contentinfo" suppressHydrationWarning>
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-display font-bold">
                Suscríbete a nuestro newsletter
              </h3>
              <p className="text-white/60 mt-1 text-sm sm:text-base">
                Recibe ofertas exclusivas y novedades directamente en tu correo.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full md:w-auto gap-2"
            >
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 w-full md:w-80 h-11"
                required
                aria-label="Correo electrónico para newsletter"
              />
              <Button
                type="submit"
                className="bg-brand-accent hover:bg-brand-accent/90 text-white whitespace-nowrap h-11"
              >
                {subscribed ? "¡Gracias!" : "Suscribirse"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo variant="full" size="md" className="text-white" />
            <p className="text-white/60 text-sm leading-relaxed">
              Más de 50 años uniendo amigos con tradición y sabor. Desde 1974
              en el corazón de Lima.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://www.facebook.com/sandwichpalermo#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Síguenos en Facebook"
                suppressHydrationWarning
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com/sandwichpalermocafe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Síguenos en Instagram"
                suppressHydrationWarning
              >
                <InstagramIcon />
              </a>
              <a
                href="https://twitter.com/palermocafe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Síguenos en Twitter"
                suppressHydrationWarning
              >
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-bold text-base sm:text-lg mb-3 sm:mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4 className="font-display font-bold text-base sm:text-lg mb-3 sm:mb-4">Contacto</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm">
              <li className="flex items-start gap-2.5 sm:gap-3 text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-accent flex-shrink-0" />
                <span>Av. Palermo 270, La Victoria, Lima</span>
              </li>
              <li className="flex items-center gap-2.5 sm:gap-3 text-white/60">
                <Phone className="w-4 h-4 text-brand-accent flex-shrink-0" />
                <span>(01) 4490804</span>
              </li>
              <li className="flex items-center gap-2.5 sm:gap-3 text-white/60">
                <Mail className="w-4 h-4 text-brand-accent flex-shrink-0" />
                <span className="break-all sm:break-normal">contacto@palermo.com.pe</span>
              </li>
              <li className="flex items-center gap-2.5 sm:gap-3 text-white/60">
                <Clock className="w-4 h-4 text-brand-accent flex-shrink-0" />
                <span>Lun-Sáb: 7:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-white/40 text-center">
            <p suppressHydrationWarning>
              © 2026 Palermo Café. Todos los derechos
              reservados.
            </p>
            <a
              href="/auth/login"
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
