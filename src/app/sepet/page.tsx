"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/stores/cart";
import { trackAddToCart } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TrustSeals } from "@/components/marketing/trust-seals";
import type { UpsellProduct } from "@/components/cart/cart-drawer";

export default function CartPage() {
  const { items, updateQuantity, removeItem, addItem } = useCart();
  const [catalog, setCatalog] = useState<UpsellProduct[]>([]);

  const total = items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0), 0);
  const shipping = total >= 2000 ? 0 : 49;
  const grandTotal = total + shipping;

  useEffect(() => {
    fetch("/api/social-proof")
      .then((r) => r.json())
      .then((data: { items?: UpsellProduct[] }) => {
        if (Array.isArray(data.items)) {
          setCatalog(data.items);
        }
      })
      .catch(() => {});
  }, []);

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

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/5">
          <ShoppingBag className="h-12 w-12 text-primary/30" />
        </div>
        <h1 className="font-serif text-3xl font-semibold">Sepetiniz boş</h1>
        <p className="mt-3 text-muted">Doğanın güzelliğini keşfedin</p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/kategori/yapay-agac">Alışverişe Başla</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3.5 py-6 pb-24 sm:px-4 sm:py-12 lg:px-8">
      <h1 className="font-serif text-2xl sm:text-3xl font-semibold mb-5 sm:mb-8">Sepetim</h1>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_360px]">
        {/* Ürünler + Tamamlayıcı Öneriler */}
        <div className="min-w-0 space-y-6">
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => {
              const key = item.variantId ? `${item.id}__${item.variantId}` : item.id;
              return (
                <div
                  key={key}
                  className="flex gap-3 sm:gap-4 rounded-2xl border border-primary/10 bg-white p-3 sm:p-4 shadow-2xs"
                >
                  <Link
                    href={`/urun/${item.slug}`}
                    className="h-20 w-18 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-primary/5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/urun/${item.slug}`} className="text-sm sm:text-base font-medium leading-snug line-clamp-2 hover:text-accent">
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.variantId)}
                        className="text-muted hover:text-red-500 p-1 shrink-0"
                        aria-label="Ürünü sepetten kaldır"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {item.variant && <p className="text-xs text-muted mt-1">{item.variant}</p>}
                    {item.maxStock > 0 && item.quantity >= item.maxStock && (
                      <p className="text-xs text-accent mt-1">Maksimum stok adedine ulaştınız</p>
                    )}
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/15 hover:bg-primary/5"
                          aria-label="Adedi azalt"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/15 hover:bg-primary/5"
                          aria-label="Adedi artır"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-price text-base font-extrabold text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sepet Sayfası Çapraz Satış / Benzer Ürünler */}
          {recommendations.length > 0 && (
            <div className="rounded-2xl border border-primary/10 bg-white p-4 sm:p-5 shadow-2xs">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <h2 className="font-serif text-base sm:text-lg font-semibold text-ink">
                  Yanına Çok Yakışacak Benzer Ürünler
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex flex-col rounded-xl border border-primary/10 bg-[#f9fafb] p-2.5 transition-all hover:border-accent/40"
                  >
                    <Link
                      href={`/urun/${rec.slug}`}
                      className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-white"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rec.image} alt={rec.name} className="h-full w-full object-cover" />
                    </Link>
                    <Link
                      href={`/urun/${rec.slug}`}
                      className="mt-2 font-serif text-xs font-medium leading-snug text-ink line-clamp-2 min-h-[2rem] hover:text-accent"
                    >
                      {rec.name}
                    </Link>
                    <div className="mt-auto pt-2 flex items-center justify-between gap-1">
                      <span className="font-price text-xs sm:text-sm font-extrabold text-ink">
                        {formatPrice(rec.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(rec)}
                        className="inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#d9560b]"
                      >
                        <Plus className="h-3 w-3" /> Ekle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Özet */}
        <div className="rounded-2xl border border-primary/10 bg-white p-5 sm:p-6 h-fit sticky top-24 shadow-2xs">
          <h2 className="font-serif text-xl font-semibold mb-4">Sipariş Özeti</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Ara toplam</span>
              <span className="font-price font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Kargo</span>
              <span className="font-price font-semibold">
                {shipping === 0 ? <span className="text-emerald-700">Ücretsiz</span> : formatPrice(shipping)}
              </span>
            </div>
            {total < 2000 && (
              <p className="text-xs text-accent bg-accent/10 rounded-lg p-2">
                {formatPrice(2000 - total)} daha ekleyin, ücretsiz kargo kazanın!
              </p>
            )}
            <div className="border-t border-primary/10 pt-3 flex justify-between text-base">
              <span className="font-semibold">Toplam</span>
              <span className="font-price text-xl font-extrabold text-ink">{formatPrice(grandTotal)}</span>
            </div>
          </div>
          <Button size="lg" className="w-full mt-6" asChild>
            <Link href="/odeme">Ödemeye Geç <ArrowRight className="h-4 w-4" /></Link>
          </Button>

          {/* Güven rozetleri */}
          <div className="mt-6">
            <TrustSeals />
          </div>
        </div>
      </div>
    </div>
  );
}
