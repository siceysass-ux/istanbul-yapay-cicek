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
    desc: "256-bit SSL ve iyzico",
  },
  {
    icon: RotateCcw,
    title: "14 Gün İade Hakkı",
    desc: "Orijinal ambalajda kolay iade",
  },
  {
    icon: Truck,
    title: "Hızlı Teslimat",
    desc: "1-3 iş gününde kargoda",
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
          : "border-primary/10 bg-cream-dark/60"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <BadgeCheck
          className={`h-4 w-4 ${isDark ? "text-accent" : "text-accent"}`}
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
                isDark ? "text-accent" : "text-accent"
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

      {/* Ödeme yöntemleri — Resmi iyzico kart logoları */}
      <div
        className={`mt-3 space-y-2 border-t pt-3 ${
          isDark ? "border-cream/10" : "border-primary/10"
        }`}
      >
        <div className="rounded-xl bg-white px-3 py-2 shadow-2xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/iyzico-band-colored.svg"
            alt="iyzico ile Öde — Mastercard, Visa, American Express, Troy"
            className="mx-auto h-5 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <CreditCard
            className={`h-3.5 w-3.5 ${isDark ? "text-cream/60" : "text-muted"}`}
          />
          <span
            className={`text-[10px] font-medium ${
              isDark ? "text-cream/60" : "text-muted"
            }`}
          >
            Kredi Kartı (Tek Çekim / 3 Taksit) · İstanbul İçi Kapıda Nakit Ödeme
          </span>
        </div>
      </div>

      {/* Müşteri destek saatleri — P1-14 sözleşme ve iletişimle uyumlu */}
      <div
        className={`mt-2 flex items-center gap-1.5 ${
          isDark ? "text-cream/60" : "text-muted"
        }`}
      >
        <Headphones className="h-3.5 w-3.5 text-accent" />
        <span className="text-[10px] font-medium">
          Müşteri Desteği: Pzt – Cmt 09:00 – 18:00 · 0(507) 884 66 03
        </span>
      </div>
    </div>
  );
}
