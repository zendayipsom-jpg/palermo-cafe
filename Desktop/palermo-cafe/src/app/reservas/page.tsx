"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Clock, Users, MapPin, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GradientDivider } from "@/components/shared/SectionDivider";

const locations = [
  "Balconcillo - La Victoria",
  "Benavides - Miraflores",
  "San Borja",
  "El Polo - Santiago de Surco",
];

const timeSlots = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

export default function ReservasPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    guests: "2",
    date: "",
    time: "",
    location: "",
    message: "",
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: formScrollYProgress } = useScroll({
    target: formSectionRef,
    offset: ["start end", "end start"],
  });
  const formBgY = useTransform(formScrollYProgress, [0, 1], ["0%", "5%"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guests: parseInt(form.guests),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero with parallax restaurant ambiance */}
        <section ref={heroRef} className="relative py-24 sm:py-32 overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&h=1080&fit=crop"
              alt=""
              className="absolute inset-0 w-full h-[130%] object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/85 via-brand-dark/70 to-brand-dark/90" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-espresso/30 via-transparent to-brand-primary/20" />
          </motion.div>

          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-12 w-32 h-32 rounded-full overflow-hidden opacity-15 hidden lg:block"
            animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop"
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
                Reservas
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mt-4 mb-4 sm:mb-6 px-2">
                Reserva tu <span className="text-brand-accent italic">mesa</span>
              </h1>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-4 sm:mb-6" />
              <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Asegura tu lugar y disfruta de la mejor experiencia
                gastronómica en Palermo Café.
              </p>
            </motion.div>
          </div>
        </section>

        <GradientDivider />

        {/* Form with parallax background */}
        <section ref={formSectionRef} className="relative py-12 sm:py-16 overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: formBgY }}>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
          </motion.div>
          <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 sm:py-16"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border-2 border-green-200">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3 sm:mb-4">
                  ¡Reserva Recibida!
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-2">
                  Te contactaremos pronto para confirmar tu reserva. ¡Gracias
                  por elegir Palermo Café!
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "",
                      phone: "",
                      email: "",
                      guests: "2",
                      date: "",
                      time: "",
                      location: "",
                      message: "",
                    });
                  }}
                  variant="outline"
                  className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white min-h-[44px]"
                >
                  Hacer otra reserva
                </Button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl sm:rounded-3xl shadow-xl border border-border/50 p-5 sm:p-8 md:p-10 space-y-4 sm:space-y-6"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-1.5 sm:mb-2">
                    Datos de la Reserva
                  </h2>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Completa el formulario y te confirmaremos tu reserva
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="name" className="font-semibold text-sm">Nombre completo *</Label>
                    <Input
                      id="name"
                      required
                      placeholder="Tu nombre"
                      className="h-11 sm:h-12 rounded-xl"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="font-semibold text-sm">Teléfono *</Label>
                    <Input
                      id="phone"
                      required
                      placeholder="999 999 999"
                      className="h-11 sm:h-12 rounded-xl"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="font-semibold text-sm">Email (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="h-11 sm:h-12 rounded-xl"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="guests" className="font-semibold text-sm">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1" />
                      Personas *
                    </Label>
                    <select
                      id="guests"
                      required
                      className="w-full h-11 sm:h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      value={form.guests}
                      onChange={(e) =>
                        setForm({ ...form, guests: e.target.value })
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "persona" : "personas"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="date" className="font-semibold text-sm">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1" />
                      Fecha *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      className="h-11 sm:h-12 rounded-xl"
                      min={new Date().toISOString().split("T")[0]}
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="time" className="font-semibold text-sm">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1" />
                      Hora *
                    </Label>
                    <select
                      id="time"
                      required
                      className="w-full h-11 sm:h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      value={form.time}
                      onChange={(e) =>
                        setForm({ ...form, time: e.target.value })
                      }
                    >
                      <option value="">Seleccionar hora</option>
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="location" className="font-semibold text-sm">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1" />
                    Local preferido
                  </Label>
                  <select
                    id="location"
                    className="w-full h-11 sm:h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                  >
                    <option value="">Cualquier local</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="message" className="font-semibold text-sm">Mensaje adicional</Label>
                  <Textarea
                    id="message"
                    placeholder="Alguna solicitud especial, alergias, celebración..."
                    rows={3}
                    className="rounded-xl"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-5 sm:py-6 text-base sm:text-lg rounded-xl font-bold shadow-lg shadow-brand-primary/20 min-h-[48px]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Enviando...
                    </span>
                  ) : (
                    "Confirmar Reserva"
                  )}
                </Button>

                <p className="text-center text-xs sm:text-sm text-muted-foreground px-2">
                  Te contactaremos para confirmar tu reserva. Si necesitas
                  ayuda, llámanos al (01) 4490804.
                </p>
              </motion.form>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
