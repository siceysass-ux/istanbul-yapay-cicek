"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Truck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const showcaseCards = [
  {
    title: "Meyveli Yapay Zeytin Ağacı",
    category: "Yapay Ağaçlar",
    badge: "Doğal Gövde · 185 cm",
    image: "/products/dogal-ahsap-govdeli-meyveli-yapay-zeytin-agaci-185-cm/1.jpg",
    href: "/urun/dogal-ahsap-govdeli-meyveli-yapay-zeytin-agaci-185-cm",
  },
  {
    title: "Kıvrımlı Çam Bonsai Ağacı",
    category: "Saksılı Bitkiler",
    badge: "Taş Saksılı · 155 cm",
    image: "/products/gri-tas-saksida-kivrimli-govdeli-yapay-cam-bonsai-agaci-155-cm/1.jpg",
    href: "/urun/gri-tas-saksida-kivrimli-govdeli-yapay-cam-bonsai-agaci-155-cm",
  },
  {
    title: "Pudra Pembe Sarkık Sakura",
    category: "Yapay Çiçekler",
    badge: "İpek Doku · 180 cm",
    image: "/products/dogal-govdeli-pudra-pembe-sarkik-sakura-yapay-agac-180-cm/1.jpg",
    href: "/urun/dogal-govdeli-pudra-pembe-sarkik-sakura-yapay-agac-180-cm",
  },
];

const quickCategories = [
  { label: "Yapay Ağaçlar", href: "/kategori/yapay-agac" },
  { label: "Yapay Çiçekler", href: "/kategori/yapay-cicek" },
  { label: "Saksılı Bitkiler", href: "/kategori/saksi" },
  { label: "Dev Çiçekler", href: "/kategori/yapay-guller" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-b from-[#faf6ee] via-cream to-[#efe5d4]/60 py-6 sm:py-8 lg:py-10">
      {/* İnce arka plan ambiyans ışığı */}
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Sol Sütun: Başlık, Hızlı Kategori Erişimi, Aksiyonlar ve iyzico Bandı */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-white/80 px-3.5 py-1 text-xs font-semibold text-primary shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Kendi Atölyemizden Gerçek Stüdyo Çekimi Koleksiyon</span>
            </div>

            <h1 className="font-serif text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[42px] text-balance">
              Mekanınıza Doğal ve Kalıcı{" "}
              <span className="bg-gradient-to-r from-[#8f6d28] via-[#b89244] to-[#7d5d1e] bg-clip-text text-transparent">
                Botanik Zarafet
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-ink/75 sm:text-base">
              Bakım gerektirmeyen gerçek doğal ahşap gövdeli yapay ağaçlar, tasarım saksılı bonsai modelleri ve dev vitrin çiçekleri. Saksılı tam boy olarak kapınıza teslim.
            </p>

            {/* Hızlı Kategori Geçiş Hapları — Müşteriyi Tek Tıkla Ürüne Ulaştırır */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {quickCategories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="rounded-full border border-primary/15 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-ink transition-all hover:border-primary hover:bg-primary hover:text-cream shadow-2xs"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Ana CTA Butonları */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button size="lg" className="group shadow-md" asChild>
                <a href="#urunler">
                  Tüm Ürünleri İncele
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/25 bg-white/70 text-ink hover:bg-primary hover:text-cream"
                asChild
              >
                <a
                  href="https://dikeyyapaybahce.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dikey Bahçe Projeleri
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Güvence & Resmi iyzico Kart Logoları Bandı */}
            <div className="pt-2 space-y-2.5 border-t border-primary/10">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-ink/75">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-primary" /> 2000₺ Üzeri Ücretsiz Kargo
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5 text-primary" /> 14 Gün Koşulsuz İade
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> İstanbul İçi Kapıda Ödeme
                </span>
              </div>

              <div className="inline-flex items-center gap-3 rounded-xl border border-primary/10 bg-white/90 px-3.5 py-2 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/iyzico-band-colored.svg"
                  alt="iyzico ile Öde — Mastercard, Visa, American Express, Troy"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Sağ Sütun: 3'lü Gerçek Ürün Vitrin Kartları (Tıklanabilir, Hızlı Erişim) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {showcaseCards.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative overflow-hidden rounded-2xl border border-primary/12 bg-[#f4f1ea] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent ${
                    idx === 1 ? "sm:-translate-y-2" : ""
                  }`}
                >
                  <div className="relative aspect-[3/5] w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 33vw, 220px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-2.5 sm:p-3">
                      <span className="inline-block rounded-full bg-accent/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink">
                        {item.badge}
                      </span>
                      <p className="mt-1 font-serif text-xs font-semibold leading-tight text-cream line-clamp-2 sm:text-sm">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
