"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import { GradientDivider } from "@/components/shared/SectionDivider";

interface Location {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  hours: string;
  mapUrl: string | null;
}

const locationImages: Record<string, string> = {
  "La Victoria":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
  Miraflores:
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop",
  "San Borja":
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop",
  Surco:
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop",
};

export default function LocalesPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const locationsSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: locationsScrollYProgress } = useScroll({
    target: locationsSectionRef,
    offset: ["start end", "end start"],
  });
  const locationsBgY = useTransform(locationsScrollYProgress, [0, 1], ["0%", "5%"]);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero with parallax restaurant image */}
        <section ref={heroRef} className="relative py-24 sm:py-32 overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop"
              alt=""
              className="absolute inset-0 w-full h-[130%] object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/85 via-brand-dark/70 to-brand-dark/90" />
          </motion.div>

          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-10 w-36 h-36 rounded-full overflow-hidden opacity-15 hidden lg:block"
            animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=300&h=300&fit=crop"
              alt=""
              className="w-full h-full object-cover rounded-full"
              aria-hidden="true"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-10 right-16 w-28 h-28 rounded-full overflow-hidden opacity-10 hidden lg:block"
            animate={{ y: [0, 12, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            <img
              src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=250&h=250&fit=crop"
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
                Nuestros Locales
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mt-4 mb-4 sm:mb-6 px-2">
                Encuéntranos en{" "}
                <span className="text-brand-accent italic">Lima</span>
              </h1>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-4 sm:mb-6" />
              <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Cuatro ubicaciones estratégicas para estar siempre cerca de ti.
                Visítanos y vive la experiencia Palermo Café.
              </p>
            </motion.div>
          </div>
        </section>

        <GradientDivider />

        {/* Locations with parallax background */}
        <section ref={locationsSectionRef} className="relative py-12 sm:py-16 overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: locationsBgY }}>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
          </motion.div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {locations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden card-premium bg-card border-border/50 shadow-lg h-full group">
                      {/* Image */}
                      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                        <img
                          src={
                            locationImages[location.name] ||
                            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
                          }
                          alt={`Local Palermo Café ${location.name}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-brand-accent/90 backdrop-blur-sm text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                          {location.district}
                        </div>
                        <h3 className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 text-white font-display font-bold text-2xl sm:text-3xl drop-shadow-lg">
                          {location.name}
                        </h3>
                      </div>

                      {/* Content */}
                      <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        <div className="flex items-start gap-2.5 sm:gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm sm:text-base text-foreground">
                              {location.address}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {location.district}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent" />
                          </div>
                          <a
                            href={`tel:${location.phone.replace(/\D/g, "")}`}
                            className="font-medium text-sm sm:text-base text-foreground hover:text-brand-primary transition-colors"
                          >
                            {location.phone}
                          </a>
                        </div>

                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent" />
                          </div>
                          <span className="text-muted-foreground text-sm sm:text-base font-medium">
                            {location.hours}
                          </span>
                        </div>

                        <div className="flex gap-2.5 sm:gap-3 pt-2 sm:pt-3">
                          <a
                            href={location.mapUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 h-10 sm:h-11 px-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-sm font-semibold transition-all shadow-md min-h-[44px]"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Cómo llegar
                          </a>
                          <a
                            href={`tel:${location.phone.replace(/\D/g, "")}`}
                            className="inline-flex items-center justify-center h-10 sm:h-11 px-3 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl text-sm font-semibold transition-all bg-transparent min-w-[44px]"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
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
