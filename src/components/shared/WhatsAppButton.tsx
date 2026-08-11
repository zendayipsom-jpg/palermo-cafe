"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const message = encodeURIComponent(
    "Hola! Me gustaría hacer una reserva en Palermo Café 🍽️"
  );

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
      {/* Tooltip */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-xl p-4 w-64 sm:w-72 mb-2"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm font-medium text-gray-800 mb-2">
              ¡Hola! 👋
            </p>
            <p className="text-sm text-gray-600 mb-3">
              ¿Te gustaría hacer una reserva o tienes alguna consulta?
            </p>
            <a
              href={`https://wa.me/514490804?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Abrir WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        ) : (
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}
