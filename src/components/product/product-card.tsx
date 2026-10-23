"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Check, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { flyToCart } from "@/components/shared/flying-cart";
import { useCart } from "@/stores/cart";
import { trackAddToCart } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import type { ProductListItem } from "@/lib/types";

interface ProductCardProps {
  product: ProductListItem;
  index?: number;
  imagePriority?: boolean;
}

export function ProductCard({ product, index = 0, imagePriority = false }: ProductCardProps) {
  const [favorite, setFavorite] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const price = product.discountPrice ?? product.basePrice;
  const image = product.images[0]?.url ?? "/placeholder.svg";
  const inStock = product.stock > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    flyToCart(image, e.clientX, e.clientY);
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price,
      basePrice: product.basePrice,
      image,
      maxStock: product.stock,
    });
    trackAddToCart({
      id: product.id,
      name: product.name,
      price,
      quantity: 1,
    });
    toast.success("Sepete eklendi", { description: product.name });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
    toast.info(favorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.24), ease: [0.22, 1, 0.36, 1] }}
      className="h-full min-w-0"
    >
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white p-2 sm:p-2.5 shadow-2xs transition-all duration-300 hover:border-accent/50 hover:shadow-lg">
        {/* Görsel Alanı — Saksı altını kapatmayan tam görünüm */}
        <Link
          href={`/urun/${product.slug}`}
          className="relative block aspect-[3/4] sm:aspect-[3/5] w-full overflow-hidden rounded-xl bg-[#f7f8f9]"
        >
          {/* Rozetler */}
          <div className="absolute left-2 top-2 sm:left-2.5 sm:top-2.5 z-10 flex flex-col gap-1">
            {product.isFeatured ? (
              <Badge variant="new">ÖNE ÇIKAN</Badge>
            ) : product.isNew ? (
              <Badge variant="featured">YENİ</Badge>
            ) : null}
            {!inStock && (
              <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cream backdrop-blur">
                Tükendi
              </span>
            )}
          </div>

          {/* Favori */}
          <button
            type="button"
            onClick={handleFavorite}
            className={`absolute right-2 top-2 sm:right-2.5 sm:top-2.5 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full backdrop-blur transition-all duration-200 ${
              favorite
                ? "bg-accent text-white opacity-100"
                : "bg-white/85 text-ink/70 hover:bg-white hover:text-accent sm:opacity-0 sm:group-hover:opacity-100"
            }`}
            aria-label="Favorilere ekle"
          >
            <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
          </button>

          <Image
            src={image}
            alt={product.name}
            fill
            priority={imagePriority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
              !inStock ? "grayscale opacity-70" : ""
            }`}
          />
        </Link>

        {/* Ürün Bilgisi + Her Cihazda Görünür Sepete Ekle Butonu */}
        <div className="mt-2.5 flex flex-1 flex-col px-1 pb-0.5">
          <Link href={`/urun/${product.slug}`} className="block">
            <h3 className="font-serif text-xs sm:text-sm font-medium leading-snug text-ink line-clamp-2 min-h-[2.1rem] sm:min-h-[2.45rem] transition-colors group-hover:text-accent">
              {product.name}
            </h3>
          </Link>

          {/* Puan / Kargo + Stok satırı */}
          <div className="mt-1.5 flex items-center justify-between text-[10px] sm:text-[11px]">
            {product.rating > 0 && product.reviewCount > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="text-muted">
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              </div>
            ) : (
              <span className="text-muted">Ücretsiz Kargo</span>
            )}
            {inStock ? (
              <span className="flex items-center gap-0.5 font-medium text-primary/80">
                <Check className="h-3 w-3 text-accent" /> Stokta
              </span>
            ) : (
              <span className="font-medium text-red-500">Tükendi</span>
            )}
          </div>

          {/* Fiyat + Her Zaman Görünür Sepete Ekle Butonu */}
          <div className="mt-auto pt-2.5 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-base sm:text-lg font-bold text-ink">
                {formatPrice(price)}
              </span>
              <span className="text-[10px] text-muted">KDV Dahil</span>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!inStock}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#d9560b] active:scale-98 disabled:opacity-50"
            >
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span>{inStock ? "Sepete Ekle" : "Tükendi"}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
