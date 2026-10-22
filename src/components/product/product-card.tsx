"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingBag, Eye, Heart, Sparkles, Box, Check, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickViewModal } from "@/components/product/quick-view-modal";
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
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const price = product.discountPrice ?? product.basePrice;
  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.basePrice) * 100)
    : 0;
  const image = product.images[0]?.url ?? "/placeholder.svg";
  const inStock = product.stock > 0;

  // 3D Tilt efekt
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    // Sepete uçan animasyon
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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
    toast.info(favorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="transform-gpu will-change-transform"
      >
        <Link href={`/urun/${product.slug}`} className="group block min-w-0">
          <div className="relative aspect-[3/4] sm:aspect-[3/5] overflow-hidden rounded-2xl bg-[#f7f8f9] ring-1 ring-primary/10 transition-all duration-500 group-hover:ring-accent/60 group-hover:shadow-xl group-hover:shadow-accent/10">
            {/* Rozetler — P2-4: Tek kaynaklı tutarlı rozet mantığı */}
            <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10 flex flex-col gap-1">
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
              onClick={handleFavorite}
              className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all duration-300 ${
                favorite
                  ? "bg-accent text-ink opacity-100"
                  : "bg-cream/80 opacity-0 hover:bg-cream group-hover:opacity-100"
              }`}
              aria-label="Favori"
            >
              <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
            </button>

            <Image
              src={image}
              alt={product.name}
              fill
              priority={imagePriority}
              quality={70}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                !inStock ? "grayscale opacity-70" : ""
              }`}
            />

            {/* Hover overlay — hızlı aksiyon */}
            {inStock && (
              <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-ink/90 via-ink/60 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
                <Button size="sm" onClick={handleAdd} className="flex-1">
                  <ShoppingBag className="h-4 w-4" /> Sepete Ekle
                </Button>
                <Button size="sm" variant="accent" className="px-3" onClick={handleQuickView} aria-label="Hızlı bakış">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Bilgi */}
          <div className="mt-2.5 sm:mt-3 space-y-1 sm:space-y-1.5">
            {product.brand && (
              <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-accent">
                {product.brand.name}
              </p>
            )}
            <h3 className="font-serif text-xs sm:text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Fiyat + stok */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="font-bold text-sm sm:text-base text-ink">{formatPrice(price)}</span>
              {inStock && (
                <button
                  type="button"
                  onClick={handleAdd}
                  aria-label="Sepete Ekle"
                  className="flex sm:hidden items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-white shadow-2xs active:scale-95"
                >
                  <ShoppingBag className="h-3 w-3" /> Ekle
                </button>
              )}
            </div>

            {/* Rating + stok durumu (P0-5: Gerçek yorum yoksa yıldız gösterme) */}
            <div className="flex items-center justify-between">
              {product.rating > 0 && product.reviewCount > 0 ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${
                          s <= Math.round(product.rating)
                            ? "fill-accent text-accent"
                            : "fill-primary/10 text-primary/10"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted">
                    {product.rating.toFixed(1)} ({product.reviewCount})
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-muted">Ücretsiz Kargo</span>
              )}
              {inStock && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-primary/75">
                  <Check className="h-3 w-3 text-accent" /> Stokta
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
