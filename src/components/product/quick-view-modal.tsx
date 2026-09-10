"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ChevronLeft, ChevronRight, Star, Truck, RotateCcw, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/stores/cart";
import { formatPrice, cn } from "@/lib/utils";
import type { ProductListItem } from "@/lib/types";

interface QuickViewModalProps {
  product: ProductListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);

  if (!product) return null;

  const price = product.discountPrice ?? product.basePrice;
  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.basePrice) * 100)
    : 0;
  const images = product.images;

  const handleAdd = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price,
      basePrice: product.basePrice,
      image: images[0]?.url ?? "",
      maxStock: product.stock,
    }, quantity);
    toast.success("Sepete eklendi!", { description: `${quantity} adet ${product.name}` });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-cream shadow-2xl pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="quick-view-title"
            >
              {/* Kapat */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cream/80 backdrop-blur hover:bg-cream transition-colors"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid gap-0 md:grid-cols-2">
                {/* Görsel */}
                <div className="relative aspect-square bg-primary/5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="h-full w-full"
                    >
                      <Image
                        src={images[activeImage]?.url ?? "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="50vw"
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Rozetler */}
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {product.isNew && <Badge variant="new">YENİ</Badge>}
                    {discount > 0 && <Badge variant="discount">%{discount}</Badge>}
                  </div>

                  {/* Galeri navigasyon */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-cream/80 backdrop-blur hover:bg-cream"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-cream/80 backdrop-blur hover:bg-cream"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      {/* Thumbnail'lar */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((img, i) => (
                          <button
                            key={img.id}
                            onClick={() => setActiveImage(i)}
                            className={cn(
                              "h-12 w-12 overflow-hidden rounded-lg border-2 transition-all",
                              activeImage === i ? "border-primary" : "border-transparent opacity-60"
                            )}
                          >
                            <Image src={img.url} alt={img.alt} width={48} height={48} className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Bilgi */}
                <div className="flex flex-col p-6 sm:p-8">
                  {product.brand && (
                    <p className="text-xs text-muted mb-1">{product.brand.name}</p>
                  )}
                  <h2 id="quick-view-title" className="font-serif text-2xl font-semibold leading-tight text-balance">
                    {product.name}
                  </h2>

                  {/* Puan */}
                  {product.rating > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn("h-4 w-4", s <= Math.round(product.rating) ? "fill-accent text-accent" : "text-primary/20")} />
                        ))}
                      </div>
                      <span className="text-muted">{product.rating.toFixed(1)} ({product.reviewCount})</span>
                    </div>
                  )}

                  {/* Fiyat */}
                  <div className="mt-4 flex items-center gap-3">
                    <span className="font-serif text-3xl font-bold text-primary">{formatPrice(price)}</span>
                    {product.discountPrice && (
                      <span className="text-lg text-muted line-through">{formatPrice(product.basePrice)}</span>
                    )}
                  </div>

                  {/* Açıklama */}
                  <p className="mt-4 text-sm text-muted leading-relaxed line-clamp-3">{product.shortDesc}</p>

                  {/* Stok */}
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    {product.stock > 0 ? (
                      <>
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-primary font-medium">Stokta var</span>
                      </>
                    ) : (
                      <span className="text-red-500">Tükendi</span>
                    )}
                  </div>

                  {/* Miktar + Sepete ekle */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-primary/20 p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-primary/5"
                      >−</button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-primary/5"
                      >+</button>
                    </div>
                    <Button size="lg" className="flex-1" onClick={handleAdd} disabled={product.stock === 0}>
                      <ShoppingBag className="h-5 w-5" /> Sepete Ekle
                    </Button>
                  </div>

                  {/* Güvence */}
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    {[
                      { icon: Truck, label: "1-3 gün" },
                      { icon: RotateCcw, label: "14 gün iade" },
                      { icon: Check, label: "3 taksit" },
                    ].map((g) => (
                      <div key={g.label} className="flex flex-col items-center gap-1 rounded-xl bg-primary/5 py-2">
                        <g.icon className="h-4 w-4 text-primary" />
                        <span className="text-[10px] text-muted">{g.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Detay linki */}
                  <Button variant="outline" className="mt-5 w-full" asChild onClick={onClose}>
                    <Link href={`/urun/${product.slug}`}>
                      Tüm detayları gör <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
