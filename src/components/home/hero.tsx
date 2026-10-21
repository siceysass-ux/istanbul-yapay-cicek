"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Truck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const showcaseCards = [
  {
    title: "Meyveli Yapay Zeytin Ağacı",
    badge: "185 cm · Doğal Gövde",
    price: "4.490 ₺",
    image: "/products/dogal-ahsap-govdeli-meyveli-yapay-zeytin-agaci-185-cm/1.jpg",
    href: "/urun/dogal-ahsap-govdeli-meyveli-yapay-zeytin-agaci-185-cm",
  },
  {
    title: "Kıvrımlı Çam Bonsai Ağacı",
    badge: "155 cm · Taş Saksılı",
    price: "5.690 ₺",
    image: "/products/gri-tas-saksida-kivrimli-govdeli-yapay-cam-bonsai-agaci-155-cm/1.jpg",
    href: "/urun/gri-tas-saksida-kivrimli-govdeli-yapay-cam-bonsai-agaci-155-cm",
  },
  {
    title: "Pudra Pembe Sarkık Sakura",
    badge: "180 cm · Doğal Gövde",
    price: "4.790 ₺",
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

function VectorStar({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goldStarGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff1b8" />
          <stop offset="45%" stopColor="#f0c44d" />
          <stop offset="100%" stopColor="#b8861b" />
        </linearGradient>
      </defs>
      <path
        d="M12 1.8L14.85 8.65L22.2 9.3L16.6 14.15L18.3 21.4L12 17.55L5.7 21.4L7.4 14.15L1.8 9.3L9.15 8.65L12 1.8Z"
        fill="url(#goldStarGrad)"
        stroke="#ffe58f"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VectorSpark({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z"
        fill="#f2c94c"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-[#c8a662]/35 bg-gradient-to-br from-[#1b1713] via-[#241f19] to-[#15120e] py-8 sm:py-10 lg:py-12 text-cream shadow-[0_16px_40px_rgba(20,16,12,0.18)]">
      {/* Arka plan sıcak altın ambiyans ışıkları */}
      <div className="pointer-events-none absolute -left-24 -top-16 h-80 w-80 rounded-full bg-[#c8a662]/12 blur-[110px]" />
      <div className="pointer-events-none absolute right-10 bottom-0 h-80 w-80 rounded-full bg-[#e6be5a]/10 blur-[120px]" />

      {/* Alt altın ayırıcı ince şerit */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e5c158]/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Sol Sütun: Başlık, Kategori Geçişleri, Butonlar ve iyzico Bandı */}
          <div className="lg:col-span-6 space-y-5">
            <h1 className="font-serif text-3xl font-bold leading-[1.14] tracking-tight text-cream sm:text-4xl lg:text-[44px] text-balance">
              Mekanınıza Doğal ve Kalıcı{" "}
              <span className="bg-gradient-to-r from-[#fae29c] via-[#e5bd52] to-[#c89b32] bg-clip-text text-transparent">
                Botanik Zarafet
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-cream/75 sm:text-base">
              Bakım gerektirmeyen gerçek doğal ahşap gövdeli yapay ağaçlar, tasarım saksılı bonsai modelleri ve dev vitrin çiçekleri. Saksılı tam boy olarak kapınıza teslim.
            </p>

            {/* Hızlı Kategori Geçiş Hapları */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {quickCategories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="rounded-full border border-cream/20 bg-cream/8 px-3.5 py-1.5 text-xs font-semibold text-cream transition-all hover:border-[#e5bd52] hover:bg-[#e5bd52] hover:text-[#181410]"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Ana CTA Butonları */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                size="lg"
                variant="accent"
                className="group bg-gradient-to-r from-[#e5bd52] to-[#cfa338] text-[#181410] font-bold shadow-lg shadow-[#e5bd52]/20 hover:brightness-105"
                asChild
              >
                <a href="#urunler">
                  Tüm Ürünleri İncele
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cream/25 bg-cream/5 text-cream hover:border-[#e5bd52]/60 hover:bg-cream/10"
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
            <div className="pt-3 space-y-3 border-t border-cream/12">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-cream/75">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-[#e5bd52]" /> 2000₺ Üzeri Ücretsiz Kargo
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5 text-[#e5bd52]" /> 14 Gün Koşulsuz İade
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#e5bd52]" /> İstanbul İçi Kapıda Ödeme
                </span>
              </div>

              <div className="inline-flex items-center rounded-xl bg-white/95 px-3.5 py-2 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/iyzico-band-colored.svg"
                  alt="iyzico ile Öde — Mastercard, Visa, American Express, Troy"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Sağ Sütun: Vektörel Altın Yıldızlı "Çok Satanlar" Başlığı + 3'lü Vitrin */}
          <div className="lg:col-span-6">
            {/* Şekilli, Altın Sarısı Vektör Yıldızlı "Çok Satanlar" Başlık Bandı */}
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e5bd52]/60 to-[#e5bd52]" />

              <div className="inline-flex items-center gap-2 rounded-full border border-[#f0c44d]/45 bg-gradient-to-r from-[#2e2618] via-[#3a2f1d] to-[#2e2618] px-4 py-1.5 shadow-[0_0_24px_rgba(240,196,77,0.22)]">
                <VectorSpark className="h-3 w-3" />
                <div className="flex items-center gap-0.5">
                  <VectorStar className="h-3.5 w-3.5" />
                  <VectorStar className="h-4 w-4 -mt-0.5" />
                  <VectorStar className="h-3.5 w-3.5" />
                </div>
                <span
                  style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  className="bg-gradient-to-r from-[#fff3c4] via-[#f4c95d] to-[#e0a82e] bg-clip-text px-1 text-base font-bold italic tracking-wide text-transparent sm:text-lg"
                >
                  Çok Satanlar
                </span>
                <div className="flex items-center gap-0.5">
                  <VectorStar className="h-3.5 w-3.5" />
                  <VectorStar className="h-4 w-4 -mt-0.5" />
                  <VectorStar className="h-3.5 w-3.5" />
                </div>
                <VectorSpark className="h-3 w-3" />
              </div>

              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#e5bd52]/60 to-[#e5bd52]" />
            </div>

            {/* 3'lü Çok Satanlar Vitrin Kartları */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {showcaseCards.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative overflow-hidden rounded-2xl border border-[#e5bd52]/30 bg-[#f4f1ea] shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#f0c44d] hover:shadow-[0_14px_30px_rgba(240,196,77,0.22)] ${
                    idx === 1 ? "sm:-translate-y-1.5 ring-1 ring-[#f0c44d]/40" : ""
                  }`}
                >
                  {/* Sol üst vektörel yıldızlı rozet */}
                  <div className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-[#1b1713]/85 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#f4c95d] backdrop-blur">
                    <VectorStar className="h-2.5 w-2.5" />
                    <span>FAVORİ</span>
                  </div>

                  <div className="relative aspect-[3/5] w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 33vw, 220px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#14110e]/95 via-[#14110e]/55 to-transparent p-2.5 sm:p-3">
                      <span className="inline-block rounded-full bg-[#e5bd52] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#181410]">
                        {item.badge}
                      </span>
                      <p className="mt-1 font-serif text-xs font-semibold leading-tight text-cream line-clamp-2 sm:text-sm">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-[#f4c95d]">
                        {item.price}
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
