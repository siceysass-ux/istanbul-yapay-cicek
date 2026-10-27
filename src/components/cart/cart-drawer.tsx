"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/stores/cart";
import { trackAddToCart } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface UpsellProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  basePrice: number;
  stock: number;
  categoryName?: string;
  image: string;
}

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, addItem } = useCart();
  const [catalog, setCatalog] = useState<UpsellProduct[]>([]);

  const total = items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0), 0);
  const totalCount = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Sepet çekmecesi açıldığında veritabanından güncel ürünleri çek
  useEffect(() => {
    if (!isOpen || catalog.length > 0) return;
    fetch("/api/social-proof")
      .then((r) => r.json())
      .then((data: { items?: UpsellProduct[] }) => {
        if (Array.isArray(data.items)) {
          setCatalog(data.items);
        }
      })
      .catch(() => {});
  }, [isOpen, catalog.length]);

  // Sepette olmayan 4 tamamlayıcı/benzer ürünü seç
  const recommendations = useMemo(() => {
    const inCartIds = new Set(items.map((i) => i.id));
    return catalog.filter((p) => p.id && !inCartIds.has(p.id)).slice(0, 4);
  }, [catalog, items]);

  const handleQuickAdd = (p: UpsellProduct) => {
    addItem({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      basePrice: p.basePrice || p.price,
      image: p.image,
      maxStock: p.stock || 15,
    });
    trackAddToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
    });
    toast.success("Sepete eklendi", { description: p.name });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-accent" />
                <h2 className="font-serif text-lg font-semibold">Sepetim</h2>
                <span className="text-sm text-muted">({totalCount})</span>
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Sepeti kapat">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Items + Tamamlayıcı Öneriler */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                  <div className="flex h-18 w-18 items-center justify-center rounded-full bg-primary/5">
                    <ShoppingBag className="h-9 w-9 text-primary/30" />
                  </div>
                  <div>
                    <p className="font-serif text-lg">Sepetiniz boş</p>
                    <p className="text-sm text-muted mt-1">Koleksiyonumuzdaki popüler ürünlere göz atın</p>
                  </div>
                  <Button onClick={closeCart} asChild>
                    <Link href="/kategori/yapay-agac">Alışverişe Başla</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => {
                    const key = item.variantId ? `${item.id}__${item.variantId}` : item.id;
                    return (
                      <div
                        key={key}
                        className="flex gap-3 rounded-2xl border border-primary/10 bg-cream-dark/40 p-3"
                      >
                        <Link
                          href={`/urun/${item.slug}`}
                          onClick={closeCart}
                          className="h-20 w-18 shrink-0 overflow-hidden rounded-xl bg-white border border-primary/8"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/urun/${item.slug}`}
                              onClick={closeCart}
                              className="text-xs sm:text-sm font-medium leading-snug line-clamp-2 hover:text-accent"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id, item.variantId)}
                              className="text-muted hover:text-red-500 transition-colors shrink-0"
                              aria-label="Ürünü sepetten kaldır"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {item.variant && (
                            <p className="text-[11px] text-muted mt-0.5 truncate">{item.variant}</p>
                          )}
                          <div className="mt-auto pt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/15 bg-white hover:bg-primary/5"
                                aria-label="Adedi azalt"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs sm:text-sm font-semibold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/15 bg-white hover:bg-primary/5"
                                aria-label="Adedi artır"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="font-price text-sm font-extrabold text-ink">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Çapraz Satış / Benzer Ürün Önerileri */}
              {recommendations.length > 0 && (
                <div className="border-t border-primary/10 pt-5">
                  <div className="mb-3 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <h3 className="font-serif text-sm font-semibold text-ink">
                      Yanına Çok Yakışacak Benzer Ürünler
                    </h3>
                  </div>
                  <div className="space-y-2.5">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-[#f9fafb] p-2.5 transition-colors hover:border-accent/40"
                      >
                        <Link
                          href={`/urun/${rec.slug}`}
                          onClick={closeCart}
                          className="h-15 w-12 shrink-0 overflow-hidden rounded-xl border border-primary/10 bg-white"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={rec.image}
                            alt={rec.name}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/urun/${rec.slug}`}
                            onClick={closeCart}
                            className="block text-xs font-medium leading-snug text-ink line-clamp-2 hover:text-accent"
                          >
                            {rec.name}
                          </Link>
                          <span className="mt-1 block font-price text-xs font-extrabold text-accent">
                            {formatPrice(rec.price)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(rec)}
                          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[#d9560b] active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Ekle</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-primary/10 bg-white p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Kargo</span>
                  <span className="font-semibold text-emerald-700">Ücretsiz Kargo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">Toplam</span>
                  <span className="font-price text-xl font-extrabold text-ink">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-emerald-700 bg-emerald-500/10 rounded-xl p-2 text-center font-medium">
                  🚚 Tüm ürünlerde Türkiye geneli ücretsiz kargo!
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button variant="outline" className="w-full" onClick={closeCart} asChild>
                    <Link href="/sepet">Sepete Git</Link>
                  </Button>
                  <Button className="w-full" asChild onClick={closeCart}>
                    <Link href="/odeme">Ödemeye Geç</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
