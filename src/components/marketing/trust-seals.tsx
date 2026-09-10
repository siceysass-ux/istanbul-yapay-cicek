"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  RotateCcw,
  Truck,
  BadgeCheck,
  CreditCard,
  Headphones,
} from "lucide-react";

const seals = [
  {
    icon: ShieldCheck,
    title: "Güvenli Ödeme",
    desc: "256-bit SSL ile şifreli",
  },
  {
    icon: RotateCcw,
    title: "14 Gün İade",
    desc: "Koşulsuz para iadesi",
  },
  {
    icon: Truck,
    title: "Hızlı Teslimat",
    desc: "1-3 iş gününde kargo",
  },
  {
    icon: Lock,
    title: "KVKK Uyumlu",
    desc: "Verileriniz korunur",
  },
];

export function TrustSeals({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isDark
          ? "border-cream/10 bg-cream/5"
          : "border-primary/10 bg-primary/5"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <BadgeCheck
          className={`h-4 w-4 ${isDark ? "text-accent" : "text-primary"}`}
        />
        <span
          className={`text-xs font-semibold ${
            isDark ? "text-cream" : "text-ink"
          }`}
        >
          Güvenli Alışveriş Garantisi
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {seals.map((seal, i) => (
          <motion.div
            key={seal.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-start gap-2"
          >
            <seal.icon
              className={`h-4 w-4 shrink-0 mt-0.5 ${
                isDark ? "text-accent" : "text-primary"
              }`}
            />
            <div className="min-w-0">
              <div
                className={`text-xs font-medium ${
                  isDark ? "text-cream" : "text-ink"
                }`}
              >
                {seal.title}
              </div>
              <div
                className={`text-[10px] ${
                  isDark ? "text-cream/50" : "text-muted"
                }`}
              >
                {seal.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ödeme yöntemleri */}
      <div
        className={`mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3 ${
          isDark ? "border-cream/10" : "border-primary/10"
        }`}
      >
        <CreditCard
          className={`h-3.5 w-3.5 ${isDark ? "text-cream/60" : "text-muted"}`}
        />
        <span
          className={`text-[10px] font-medium ${
            isDark ? "text-cream/60" : "text-muted"
          }`}
        >
          Kredi Kartı · Taksit · Kapıda Ödeme
        </span>
      </div>

      {/* Canlı destek */}
      <div
        className={`mt-2 flex items-center gap-1.5 ${
          isDark ? "text-cream/60" : "text-muted"
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <span className="text-[10px] font-medium">
          Canlı destek aktif · 7/24 ulaşılabilir
        </span>
        <Headphones className="h-3 w-3" />
      </div>
    </div>
  );
}
