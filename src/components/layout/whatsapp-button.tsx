"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { trackWhatsAppClick } from "@/lib/analytics";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.a
      href="https://wa.me/905078846603?text=Merhaba,%20cicekyapay.com%20%C3%BCzerinden%20bilgi%20almak%20istiyorum."
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick("sabit-buton")}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-20 right-3 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/35 lg:bottom-6 lg:right-6 lg:h-14 lg:w-14"
      aria-label="WhatsApp ile iletişim"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] animate-ping-slow opacity-25" />
      <Image
        src="/whatsapp-optimized.png"
        alt="WhatsApp"
        width={36}
        height={36}
        className="relative z-10 h-7 w-7 lg:h-9 lg:w-9"
      />
    </motion.a>
  );
}
