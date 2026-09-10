"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TrustSeals } from "@/components/marketing/trust-seals";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const shipping = total >= 2000 ? 0 : 49;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/5">
          <ShoppingBag className="h-12 w-12 text-primary/30" />
        </div>
        <h1 className="font-serif text-3xl font-semibold">Sepetiniz boş</h1>
        <p className="mt-3 text-muted">Doğanın güzelliğini keşfedin</p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/kategori/yapay-cicek">Alışverişe Başla</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold mb-8">Sepetim</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Ürünler */}
        <div className="space-y-4">
          {items.map((item) => {
            const key = item.variantId ? `${item.id}__${item.variantId}` : item.id;
            return (
            <div
              key={key}
              className="flex gap-4 rounded-2xl border border-primary/10 bg-white/60 p-4"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-primary/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/urun/${item.slug}`} className="font-medium hover:text-primary">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id, item.variantId)}
                    className="text-muted hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {item.variant && <p className="text-xs text-muted mt-1">{item.variant}</p>}
                {item.maxStock > 0 && item.quantity >= item.maxStock && (
                  <p className="text-xs text-accent mt-1">Maksimum stok adedine ulaştınız</p>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/15 hover:bg-primary/5"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/15 hover:bg-primary/5"
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

        {/* Özet */}
        <div className="rounded-2xl border border-primary/10 bg-white/60 p-6 h-fit sticky top-24">
          <h2 className="font-serif text-xl font-semibold mb-4">Sipariş Özeti</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Ara toplam</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Kargo</span>
              <span className="font-medium">
                {shipping === 0 ? <span className="text-primary">Ücretsiz</span> : formatPrice(shipping)}
              </span>
            </div>
            {total < 2000 && (
              <p className="text-xs text-accent bg-accent/10 rounded-lg p-2">
                {formatPrice(2000 - total)} daha ekleyin, ücretsiz kargo kazanın!
              </p>
            )}
            <div className="border-t border-primary/10 pt-3 flex justify-between text-base">
              <span className="font-semibold">Toplam</span>
              <span className="font-serif text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
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
