"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/905078846603"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl shadow-[#25D366]/40 lg:bottom-6 lg:right-6 lg:h-16 lg:w-16"
      aria-label="WhatsApp ile iletişim"
    >
      {/* Titreşim dalgaları — etrafa yayılan sinyal */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping-slow opacity-30" />
      <span className="absolute -inset-2 rounded-full bg-[#25D366] animate-ping-slower opacity-20" />
      <span className="absolute -inset-4 rounded-full bg-[#25D366] animate-ping-slowest opacity-10" />

      {/* WhatsApp ikonu — optimize PNG */}
      <Image
        src="/whatsapp-optimized.png"
        alt="WhatsApp"
        width={40}
        height={40}
        className="relative z-10 h-10 w-10 sm:h-12 sm:w-12"
        priority
      />
    </motion.a>
  );
}
