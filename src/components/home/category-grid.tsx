"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Category } from "@prisma/client";

const iconMap: Record<string, string> = {
  "yapay-cicek": "🌸",
  "yapay-agac": "🌳",
  "demet-cicek": "💐",
  "gelin-buketi": "👰",
  "kuru-cicek": "🌾",
  "sarmasik": "🌿",
  "dikey-bahce": "🧱",
  "saksi": "🪴",
  "yapay-guller": "🌹",
  "yapay-duvar-panelleri": "🟫",
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      {/* Başlık — ortalanmış, sade */}
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
          Kategoriler
        </h2>
        <p className="mt-2 text-sm text-muted text-pretty">
          Her mekana uygun yapay çiçek ve bitki çeşitleri
        </p>
      </div>

      {/* Yuvarlak ikon vitrini — wrap, ortalanmış */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0"
            >
              <Link href={`/kategori/${cat.slug}`} className="group flex flex-col items-center gap-2">
                {/* Yuvarlak ikon */}
                <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-primary/10 transition-all duration-500 group-hover:ring-accent/50 group-hover:scale-110 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-125"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl sm:text-3xl">
                      {iconMap[cat.slug] ?? "🌿"}
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                </div>

                {/* İsim */}
                <div className="text-center">
                  <h3 className="font-serif text-[11px] font-semibold transition-colors group-hover:text-primary sm:text-xs lg:text-sm">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
      </div>
    </section>
  );
}
