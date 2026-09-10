"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Home, Building2, Hotel, Store, Palmtree, ArrowRight, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import type { ProductWithRelations } from "@/lib/types";

interface RoomWizardProps {
  products: ProductWithRelations[];
}

const placeTypes = [
  { value: "salon", label: "Salon", icon: Home, desc: "Yaşam alanı" },
  { value: "ofis", label: "Ofis", icon: Building2, desc: "Çalışma alanı" },
  { value: "otel", label: "Otel / Lobi", icon: Hotel, desc: "Karşılama alanı" },
  { value: "kafe", label: "Kafe / Restoran", icon: Store, desc: "Mekan dekorasyonu" },
  { value: "dis-mekan", label: "Dış Mekan", icon: Palmtree, desc: "Balkon / Teras / Bahçe" },
];

const colorTones = [
  { value: "yesil", label: "Yeşil ağırlıklı", color: "#806020" },
  { value: "krem", label: "Krem & Natürel", color: "#e0c896" },
  { value: "pembe", label: "Pembe & Romantik", color: "#e8b4b8" },
  { value: "mor", label: "Mor & Zarif", color: "#9b7bb8" },
  { value: "renkli", label: "Renkli & Canlı", color: "#c9a96e" },
];

const styles = [
  { value: "modern", label: "Modern & Minimal" },
  { value: "dogal", label: "Doğal & Organik" },
  { value: "luks", label: "Lüks & Prestij" },
  { value: "bohem", label: "Bohem & Sanat" },
];

// Akıllı eşleştirme kuralları
function recommendProducts(
  products: ProductWithRelations[],
  place: string,
  color: string,
  style: string
): ProductWithRelations[] {
  let scored = products.map((p) => {
    let score = 0;
    const name = p.name.toLowerCase();
    const slug = p.slug.toLowerCase();
    const catSlug = p.category?.slug ?? "";

    // Mekan tipine göre puanlama
    if (place === "salon") {
      if (catSlug.includes("agac") || catSlug.includes("bonsai")) score += 30;
      if (catSlug.includes("demet")) score += 20;
      if (slug.includes("lilyum") || slug.includes("ortanca")) score += 15;
    } else if (place === "ofis") {
      if (catSlug.includes("agac") || catSlug.includes("bambu")) score += 30;
      if (catSlug.includes("dikey")) score += 25;
      if (slug.includes("zeytin") || slug.includes("bonsai")) score += 20;
    } else if (place === "otel") {
      if (slug.includes("bonsai") || slug.includes("luks")) score += 35;
      if (catSlug.includes("agac")) score += 25;
      if (p.basePrice > 1000) score += 15;
    } else if (place === "kafe") {
      if (catSlug.includes("kuru") || catSlug.includes("sarmasik")) score += 25;
      if (catSlug.includes("demet")) score += 20;
      if (slug.includes("papatya") || slug.includes("gelincik")) score += 15;
    } else if (place === "dis-mekan") {
      if (slug.includes("uv") || slug.includes("agac")) score += 30;
      if (catSlug.includes("dikey") || catSlug.includes("sarmasik")) score += 25;
      if (slug.includes("kaktus") || slug.includes("bambu")) score += 20;
    }

    // Renk tonuna göre
    if (color === "yesil") {
      if (slug.includes("zeytin") || slug.includes("bambu") || slug.includes("bonsai")) score += 20;
    } else if (color === "krem") {
      if (slug.includes("beyaz") || slug.includes("krem") || slug.includes("papatya") || slug.includes("nergis")) score += 25;
    } else if (color === "pembe") {
      if (slug.includes("pembe") || slug.includes("gul") || slug.includes("gelincik")) score += 25;
    } else if (color === "mor") {
      if (slug.includes("mor") || slug.includes("ortanca") || slug.includes("lilyum")) score += 25;
    } else if (color === "renkli") {
      score += 10; // tüm renkli ürünler
      if (slug.includes("kaktus") || slug.includes("gelincik")) score += 10;
    }

    // Tarza göre
    if (style === "modern") {
      if (slug.includes("bonsai") || slug.includes("kaktus") || slug.includes("zeytin")) score += 15;
    } else if (style === "dogal") {
      if (catSlug.includes("demet") || catSlug.includes("bitki")) score += 15;
    } else if (style === "luks") {
      if (slug.includes("luks") || p.basePrice > 2000) score += 20;
    } else if (style === "bohem") {
      if (catSlug.includes("kuru") || catSlug.includes("sarmasik")) score += 20;
    }

    // Öne çıkan ve yeni ürün bonus
    if (p.isFeatured) score += 5;
    if (p.isNew) score += 3;

    return { product: p, score };
  });

  // En yüksek puanlı 4 ürün
  scored = scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map((s) => s.product);
}

export function RoomWizard({ products }: RoomWizardProps) {
  const [step, setStep] = useState(0); // 0: place, 1: color, 2: style, 3: results
  const [place, setPlace] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [results, setResults] = useState<ProductWithRelations[]>([]);

  const handleRecommend = () => {
    const recommended = recommendProducts(products, place, color, style);
    setResults(recommended);
    setStep(3);
  };

  const handleReset = () => {
    setStep(0);
    setPlace("");
    setColor("");
    setStyle("");
    setResults([]);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-medium text-accent mb-3">
          <Wand2 className="h-3.5 w-3.5" /> Mekan Sihirbazı
        </div>
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
          Mekanına uygun çiçeği bul
        </h2>
      </div>

      <div className="rounded-3xl border border-primary/10 bg-white/60 p-6 sm:p-10">
        {/* Adım göstergesi */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {["Mekan", "Renk", "Tarz", "Sonuç"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                  step >= i ? "bg-primary text-cream" : "bg-primary/10 text-muted"
                )}
              >
                {step > i ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("text-sm hidden sm:block", step >= i ? "text-primary font-medium" : "text-muted")}>
                {label}
              </span>
              {i < 3 && <div className={cn("h-px w-6 sm:w-10", step > i ? "bg-primary" : "bg-primary/20")} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Adım 1: Mekan tipi */}
          {step === 0 && (
            <motion.div
              key="place"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="font-serif text-xl font-semibold text-center mb-6">Mekan tipini seç</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {placeTypes.map((pt) => (
                  <button
                    key={pt.value}
                    onClick={() => {
                      setPlace(pt.value);
                      setStep(1);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all hover:border-primary/40",
                      place === pt.value ? "border-primary bg-primary/5" : "border-primary/15"
                    )}
                  >
                    <pt.icon className="h-7 w-7 text-primary" />
                    <span className="text-sm font-medium">{pt.label}</span>
                    <span className="text-[10px] text-muted">{pt.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Adım 2: Renk tonu */}
          {step === 1 && (
            <motion.div
              key="color"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="font-serif text-xl font-semibold text-center mb-6">Hangi renk tonu tercih edersin?</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {colorTones.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => {
                      setColor(ct.value);
                      setStep(2);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all hover:border-primary/40",
                      color === ct.value ? "border-primary bg-primary/5" : "border-primary/15"
                    )}
                  >
                    <div
                      className="h-10 w-10 rounded-full shadow-sm"
                      style={{ backgroundColor: ct.color }}
                    />
                    <span className="text-xs font-medium text-center">{ct.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="ghost" onClick={() => setStep(0)}>← Geri</Button>
              </div>
            </motion.div>
          )}

          {/* Adım 3: Tarz */}
          {step === 2 && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="font-serif text-xl font-semibold text-center mb-6">Hangi tarz sana uygun?</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {styles.map((st) => (
                  <button
                    key={st.value}
                    onClick={() => {
                      setStyle(st.value);
                      handleRecommend();
                    }}
                    className={cn(
                      "rounded-2xl border-2 p-5 text-center transition-all hover:border-primary/40",
                      style === st.value ? "border-primary bg-primary/5" : "border-primary/15"
                    )}
                  >
                    <span className="text-sm font-medium">{st.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="ghost" onClick={() => setStep(1)}>← Geri</Button>
              </div>
            </motion.div>
          )}

          {/* Adım 4: Sonuçlar */}
          {step === 3 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Sparkles className="h-4 w-4" />
                  Mekanına özel {results.length} öneri hazırladık
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {results.map((product, i) => {
                  const price = product.discountPrice ?? product.basePrice;
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link href={`/urun/${product.slug}`} className="group block">
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary/5">
                          {product.isNew && (
                            <div className="absolute left-2 top-2 z-10">
                              <Badge variant="new">YENİ</Badge>
                            </div>
                          )}
                          <Image
                            src={product.images[0]?.url ?? "/placeholder.svg"}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="mt-2 space-y-1">
                          <h4 className="font-serif text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          <span className="font-semibold text-sm text-primary">{formatPrice(price)}</span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col items-center gap-3">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" /> Yeniden Dene
                </Button>
                <Link
                  href="/kategori/yapay-cicek"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Tüm ürünleri gör <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
