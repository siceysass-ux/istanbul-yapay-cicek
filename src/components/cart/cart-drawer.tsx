"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/stores/cart";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, total } = useCart();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary/10 p-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-lg font-semibold">Sepetim</h2>
                <span className="text-sm text-muted">({items.length})</span>
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/5">
                    <ShoppingBag className="h-10 w-10 text-primary/30" />
                  </div>
                  <div>
                    <p className="font-serif text-lg">Sepetiniz boş</p>
                    <p className="text-sm text-muted mt-1">Doğanın güzelliğini keşfedin</p>
                  </div>
                  <Button onClick={closeCart} asChild>
                    <Link href="/kategori/yapay-cicek">Alışverişe Başla</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const key = item.variantId ? `${item.id}__${item.variantId}` : item.id;
                    return (
                    <div
                      key={key}
                      className="flex gap-3 rounded-2xl border border-primary/10 bg-white/60 p-3"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-primary/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium leading-tight line-clamp-2">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id, item.variantId)}
                            className="text-muted hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {item.variant && (
                          <p className="text-xs text-muted mt-0.5">{item.variant}</p>
                        )}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/15 hover:bg-primary/5"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/15 hover:bg-primary/5"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-semibold text-primary">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-primary/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Ara toplam</span>
                  <span className="font-serif text-xl font-semibold">{formatPrice(total)}</span>
                </div>
                {total < 2000 && (
                  <p className="text-xs text-accent bg-accent/10 rounded-lg p-2 text-center">
                    🚚 {formatPrice(2000 - total)} daha ekleyin, ücretsiz kargo kazanın!
                  </p>
                )}
                {total >= 2000 && (
                  <p className="text-xs text-primary bg-primary/10 rounded-lg p-2 text-center">
                    ✓ Ücretsiz kargo kazandınız!
                  </p>
                )}
                <Button className="w-full" size="lg" asChild onClick={closeCart}>
                  <Link href="/odeme">Ödemeye Geç</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={closeCart} asChild>
                  <Link href="/sepet">Sepete Git</Link>
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
