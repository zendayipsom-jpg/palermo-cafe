"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Calendar, Phone, Clock } from "lucide-react";

export default function ReservationCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section
      ref={ref}
      className="relative py-32 overflow-hidden"
      aria-labelledby="reservation-heading"
    >
      {/* Background food image with parallax */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=1080&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-[130%] object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-brand-espresso/80 to-brand-primary/70" />
      </motion.div>

      {/* Grain */}
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* Decorative pattern */}
      <div className="absolute inset-0 pattern-dots opacity-[0.06]" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative element */}
          <div className="inline-flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
            <div className="w-8 sm:w-10 h-px bg-brand-accent/60" />
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent" />
            <div className="w-8 sm:w-10 h-px bg-brand-accent/60" />
          </div>

          <h2
            id="reservation-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 sm:mb-6 leading-tight"
          >
            ¿Listo para vivir la{" "}
            <span className="text-brand-accent italic">experiencia</span>?
          </h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg mb-8 sm:mb-14 max-w-xl mx-auto leading-relaxed px-2">
            Reserva tu mesa y disfruta de los mejores sándwiches artesanales
            de Lima. Te esperamos con los brazos abiertos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16 px-4 sm:px-0">
            <a
              href="/reservas"
              className="group inline-flex items-center justify-center gap-3 h-12 sm:h-14 bg-white text-brand-primary hover:bg-white/95 px-8 sm:px-10 text-sm sm:text-base rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-black/30 hover:scale-[1.02]"
            >
              <Calendar className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Reservar Mesa
            </a>
            <a
              href="tel:+51014490804"
              className="group inline-flex items-center justify-center gap-3 h-12 sm:h-14 border border-white/20 text-white hover:bg-white/[0.08] hover:border-white/30 px-8 sm:px-10 text-sm sm:text-base rounded-2xl font-bold transition-all duration-300 bg-white/[0.04] backdrop-blur-sm"
            >
              <Phone className="w-5 h-5 transition-transform group-hover:scale-110" />
              Llamar Ahora
            </a>
          </div>

          {/* Info cards — refined */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                icon: Clock,
                title: "Horario",
                text: "Lun-Sáb: 7am - 6pm",
              },
              {
                icon: Phone,
                title: "Teléfono",
                text: "(01) 4490804",
              },
              {
                icon: Calendar,
                title: "Reservas",
                text: "Aceptamos reservas para grupos",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 sm:gap-4 bg-white/[0.06] backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 text-left border border-white/[0.08] hover:bg-white/[0.10] hover:border-white/[0.15] transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-brand-accent/15 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent" />
                  </div>
                  <div>
                    <div className="text-white/40 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5">{item.title}</div>
                    <div className="text-white font-semibold text-xs sm:text-sm">{item.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
