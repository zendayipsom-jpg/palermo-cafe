"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

const locations = [
  {
    name: "La Victoria",
    address: "Av. Palermo 270, La Victoria",
    phone: "(01) 123-4567",
    hours: "Lun-Sáb: 8:00 AM - 8:45 PM",
    mapUrl: "https://maps.google.com/?q=Av+Palermo+270+La+Victoria+Lima",
    embedUrl: "https://maps.google.com/maps?q=Av+Palermo+270+La+Victoria+Lima&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
  {
    name: "Miraflores",
    address: "Av. Alfredo Benavides 2518, Miraflores",
    phone: "(01) 234-5678",
    hours: "Lun-Sáb: 7:30 AM - 9:30 PM | Dom: 7:30 AM - 1:00 PM",
    mapUrl: "https://maps.google.com/?q=Av+Benavides+2518+Miraflores+Lima",
    embedUrl: "https://maps.google.com/maps?q=Av+Benavides+2518+Miraflores+Lima&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
  {
    name: "San Borja",
    address: "Av. San Borja Norte 417, San Borja",
    phone: "(01) 345-6789",
    hours: "Lun-Sáb: 7:30 AM - 7:30 PM | Dom: 7:30 AM - 1:00 PM",
    mapUrl: "https://maps.google.com/?q=Av+San+Borja+Norte+417+San+Borja+Lima",
    embedUrl: "https://maps.google.com/maps?q=Av+San+Borja+Norte+417+San+Borja+Lima&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
  {
    name: "Surco",
    address: "Jr. El Polo 255, Santiago de Surco",
    phone: "(01) 456-7890",
    hours: "Lun-Sáb: 7:00 AM - 9:00 PM | Dom: 7:30 AM - 1:00 PM",
    mapUrl: "https://maps.google.com/?q=Jr+El+Polo+255+Santiago+de+Surco+Lima",
    embedUrl: "https://maps.google.com/maps?q=Jr+El+Polo+255+Santiago+de+Surco+Lima&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
];

export default function Locations() {
  return (
    <section
      className="py-20 sm:py-32 bg-background"
      aria-labelledby="locations-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="section-eyebrow text-brand-accent font-medium">
            Nuestros Locales
          </span>
          <h2
            id="locations-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 sm:mt-5 mb-4 sm:mb-6"
          >
            Encuéntranos en{" "}
            <span className="text-brand-primary italic">Lima</span>
          </h2>
          <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-4 sm:mb-6" />
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed px-2">
            Cuatro ubicaciones estratégicas para estar siempre cerca de ti.
          </p>
        </motion.div>

        {/* Locations grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {locations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border/50 h-full card-lift group">
                {/* Map */}
                <div className="relative h-36 sm:h-44 overflow-hidden">
                  <iframe
                    src={location.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="transition-transform duration-[600ms] group-hover:scale-110"
                    title={`Mapa de Palermo Café en ${location.name}`}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <h3 className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5 text-white font-display font-bold text-lg sm:text-xl drop-shadow-lg z-10">
                    {location.name}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                  <div className="flex items-start gap-2.5 sm:gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <span>{location.hours}</span>
                  </div>

                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full mt-3 sm:mt-4 h-10 sm:h-9 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-3 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-md hover:shadow-brand-primary/15 min-h-[44px]"
                  >
                    Cómo llegar
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
