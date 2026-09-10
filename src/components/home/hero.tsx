"use client";

import Link from "next/link";
import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, RotateCcw, Truck, CreditCard, Lock, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

// Yüzen partikül konfigürasyonu
interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

// Deterministik pseudo-random — server ve client aynı değeri üretir
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    // Değerleri yuvarla — hydration mismatch'i önler
    x: Math.round(seededRandom(i + 1) * 1000) / 10, // 0-100, 1 ondalık
    size: Math.round(20 + seededRandom(i + 10) * 30), // 20-50px, tam sayı
    duration: Math.round((6 + seededRandom(i + 20) * 8) * 10) / 10, // 6-14s, 1 ondalık
    delay: Math.round(seededRandom(i + 30) * 50) / 10, // 0-5s, 1 ondalık
    drift: Math.round(-30 + seededRandom(i + 40) * 60), // -30 to 30px, tam sayı
    opacity: Math.round((0.6 + seededRandom(i + 50) * 0.3) * 100) / 100, // 0.6-0.9, 2 ondalık
  }));
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Partiküller — deterministik, server-side render edilebilir
  const particles = useMemo(() => generateParticles(18), []);

  return (
    <section ref={ref} className="relative flex min-h-[50vh] items-center justify-center overflow-clip bg-ink py-12">
      {/* Video arka plan */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          poster="/hero.webp"
        >
          <source src="/hero-video.webm" type="video/webm" />
        </video>
      </motion.div>

      {/* Katmanlı overlay — sinematik, yeni palet */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-ink/70" />
      {/* Altın vurgu katmanı */}
      <div className="absolute inset-0 bg-accent/5 mix-blend-overlay" />

      {/* Dekoratif blur katmanları — altın tonları */}
      <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-accent/15 blur-[120px]" />

      {/* Yüzen partiküller — yaprak/çiçek (yukarıdan aşağı dökülür) */}
      <div className="absolute inset-0 z-20 overflow-clip pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "-100px", opacity: 0 }}
            animate={{
              y: "100vh",
              opacity: [0, p.opacity, p.opacity, 0],
              rotate: 360,
              x: p.drift,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: 0,
              width: p.size,
              height: p.size,
            }}
          >
            {/* Yaprak şekli — altın tonunda SVG */}
            <svg viewBox="0 0 24 24" fill="none" className="h-full w-full drop-shadow-[0_0_8px_rgba(192,160,96,0.4)]">
              <path
                d="M12 2C8 6 4 10 4 14c0 4 3 8 8 8s8-4 8-8c0-4-4-8-8-12z"
                fill="#c0a060"
                opacity={p.opacity + 0.2}
              />
              <path
                d="M12 4v16M8 10c2 2 4 4 4 8M16 10c-2 2-4 4-4 8"
                stroke="#e0c896"
                strokeWidth="0.5"
                opacity={p.opacity + 0.3}
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* İçerik */}
      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* Ana başlık — çarpıcı, katmanlı */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl font-bold leading-[1.15] tracking-tight text-cream text-balance sm:text-6xl lg:text-7xl"
        >
          İstanbul
          <span className="mt-2 block bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent">
            Yapay Çiçek
          </span>
        </motion.h1>

        {/* Altın ayraç */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent"
        />

        {/* Açıklama */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-xl text-base text-cream/80 text-pretty sm:text-lg"
        >
          Bakım gerektirmeyen premium yapay çiçek, ağaç ve dikey bahçe ürünleri.
          Gerçek dokulu, UV korumalı, uzun ömürlü.
        </motion.p>

        {/* CTA butonları */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button size="lg" variant="accent" asChild className="group shadow-xl shadow-accent/20">
            <Link href="/kategori/yapay-cicek">
              Ürünleri Keşfet
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-accent/40 text-cream hover:bg-accent/10 hover:border-accent/60"
            asChild
          >
            <Link href="/projeler">Projeleri Gör</Link>
          </Button>
        </motion.div>

        {/* Güven rozetleri — hero içinde, altın ikonlar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-cream/70"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Güvenli Ödeme
          </span>
          <span className="h-3 w-px bg-accent/30" />
          <span className="flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5 text-accent" /> 14 Gün İade
          </span>
          <span className="h-3 w-px bg-accent/30" />
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-accent" /> Ücretsiz Kargo
          </span>
          <span className="h-3 w-px bg-accent/30" />
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-accent" /> 3 Taksit
          </span>
          <span className="h-3 w-px bg-accent/30" />
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-accent" /> KVKK Uyumlu
          </span>
          <span className="h-3 w-px bg-accent/30" />
          <span className="flex items-center gap-1.5">
            <Headphones className="h-3.5 w-3.5 text-accent" /> 7/24 Destek
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
