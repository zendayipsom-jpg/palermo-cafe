"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Clock, Zap } from "lucide-react";

export default function PromoBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgX = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} className="relative py-6 overflow-hidden" aria-label="Promociones">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Background gradient with parallax */}
          <motion.div className="absolute inset-0" style={{ x: bgX }}>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
          </motion.div>

          {/* Content */}
          <div className="relative px-6 py-5 sm:px-10 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left — promo text */}
            <div className="flex items-center gap-4 text-white">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight">
                  Almuerzos Palermo
                </h3>
                <p className="text-white/80 text-sm sm:text-base mt-0.5">
                  Sándwich + jugo clásico
                </p>
              </div>
            </div>

            {/* Center — price */}
            <div className="flex items-baseline gap-2 text-white">
              <span className="text-3xl sm:text-4xl font-display font-black">
                S/. 19.90
              </span>
              <span className="text-white/70 text-xs sm:text-sm font-medium uppercase tracking-wider">
                el combo
              </span>
            </div>

            {/* Right — schedule */}
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-white">
              <Clock className="w-4 h-4 text-white/80" />
              <div className="text-sm">
                <span className="font-semibold">Lun - Vie</span>
                <span className="text-white/70 ml-1.5">1:00 - 4:00 PM</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
