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
  { label: "Dev Çiçekler", href: "/kategori/dev-cicekler" },
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
        <linearGradient id="orangeStarGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffb37a" />
          <stop offset="50%" stopColor="#f26816" />
          <stop offset="100%" stopColor="#c84c06" />
        </linearGradient>
      </defs>
      <path
        d="M12 1.8L14.85 8.65L22.2 9.3L16.6 14.15L18.3 21.4L12 17.55L5.7 21.4L7.4 14.15L1.8 9.3L9.15 8.65L12 1.8Z"
        fill="url(#orangeStarGrad)"
        stroke="#ff9d5c"
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
        fill="#f26816"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-4 border-[#f26816] bg-gradient-to-br from-[#1b2123] via-[#262e30] to-[#151a1c] py-8 sm:py-10 lg:py-12 text-white shadow-[0_14px_36px_rgba(24,30,32,0.16)]">
      {/* Arka plan turuncu ambiyans ışıkları */}
      <div className="pointer-events-none absolute -left-24 -top-16 h-80 w-80 rounded-full bg-[#f26816]/15 blur-[110px]" />
      <div className="pointer-events-none absolute right-10 bottom-0 h-80 w-80 rounded-full bg-[#f26816]/12 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Sol Sütun: Başlık, Kategori Geçişleri, Butonlar ve iyzico Bandı */}
          <div className="lg:col-span-6 space-y-5">
            <h1 className="font-serif text-3xl font-bold leading-[1.14] tracking-tight text-white sm:text-4xl lg:text-[44px] text-balance">
              Mekanınıza Doğal ve Kalıcı{" "}
              <span className="bg-gradient-to-r from-[#ff9a5a] via-[#f26816] to-[#ff7b2e] bg-clip-text text-transparent">
                Botanik Zarafet
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Bakım gerektirmeyen gerçek doğal ahşap gövdeli yapay ağaçlar, tasarım saksılı bonsai modelleri ve dev vitrin çiçekleri. Saksılı tam boy olarak kapınıza teslim.
            </p>

            {/* Hızlı Kategori Geçiş Hapları */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {quickCategories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="rounded-full border border-white/20 bg-white/8 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:border-[#f26816] hover:bg-[#f26816] hover:text-white"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Ana CTA Butonları */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                size="lg"
                className="group bg-[#f26816] text-white font-bold shadow-lg shadow-[#f26816]/30 hover:bg-[#d9560b]"
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
                className="border-white/25 bg-white/5 text-white hover:border-[#f26816] hover:bg-[#f26816]/15 hover:text-white"
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

            {/* Güvence ve Resmi iyzico Kart Logoları Bandı */}
            <div className="pt-3 space-y-3 border-t border-white/12">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-[#f26816]" /> Tüm Türkiye Ücretsiz Kargo
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5 text-[#f26816]" /> 14 Gün İade Hakkı
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#f26816]" /> iyzico 3D Secure Güvenli Ödeme
                </span>
              </div>

              <div className="inline-flex items-center rounded-xl bg-white px-3.5 py-2 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/iyzico-band-colored.svg"
                  alt="iyzico ile Öde — Mastercard, Visa, American Express, Troy"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Sağ Sütun: Vektörel Yıldızlı "Çok Satanlar" Başlığı + 3'lü Vitrin */}
          <div className="lg:col-span-6">
            {/* Şekilli, Vektör Yıldızlı "Çok Satanlar" Başlık Bandı */}
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f26816]/60 to-[#f26816]" />

              <div className="inline-flex items-center gap-2 rounded-full border border-[#f26816]/50 bg-[#161b1d] px-4 py-1.5 shadow-[0_0_24px_rgba(242,104,22,0.25)]">
                <VectorSpark className="h-3 w-3" />
                <div className="flex items-center gap-0.5">
                  <VectorStar className="h-3.5 w-3.5" />
                  <VectorStar className="h-4 w-4 -mt-0.5" />
                  <VectorStar className="h-3.5 w-3.5" />
                </div>
                <span
                  style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  className="bg-gradient-to-r from-[#ffd1b0] via-[#ff853d] to-[#f26816] bg-clip-text px-1 text-base font-bold italic tracking-wide text-transparent sm:text-lg"
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

              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#f26816]/60 to-[#f26816]" />
            </div>

            {/* 3'lü Çok Satanlar Vitrin Kartları */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {showcaseCards.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#f26816] hover:shadow-[0_14px_30px_rgba(242,104,22,0.28)] ${
                    idx === 1 ? "sm:-translate-y-1.5 ring-1 ring-[#f26816]/50" : ""
                  }`}
                >
                  {/* Sol üst vektörel yıldızlı rozet */}
                  <div className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-[#1b2123]/90 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white backdrop-blur">
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
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#151a1c]/95 via-[#151a1c]/60 to-transparent p-2.5 sm:p-3">
                      <span className="inline-block rounded-full bg-[#f26816] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        {item.badge}
                      </span>
                      <p className="mt-1 font-serif text-xs font-semibold leading-tight text-white line-clamp-2 sm:text-sm">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-price text-xs font-extrabold text-[#ff8a47]">
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
