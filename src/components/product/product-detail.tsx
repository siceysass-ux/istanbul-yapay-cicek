"use client";

import { useState } from "react";
import { ShoppingBag, Heart, Minus, Plus, Check, Star, BadgeCheck, Calendar, MapPin, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCart } from "@/stores/cart";
import { formatPrice, cn } from "@/lib/utils";
import { ReviewForm } from "@/components/product/review-form";
import { TrustSeals } from "@/components/marketing/trust-seals";
import type { ProductWithRelations } from "@/lib/types";

export function ProductDetail({ product }: { product: ProductWithRelations }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const addItem = useCart((s) => s.addItem);

  const price = product.discountPrice ?? product.basePrice;
  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.basePrice) * 100)
    : 0;

  // Varyant tiplerini grupla
  const variantGroups = product.variants.reduce<Record<string, typeof product.variants>>((acc, v) => {
    if (!acc[v.type]) acc[v.type] = [];
    acc[v.type].push(v);
    return acc;
  }, {});

  // Seçili varyantın fiyat farkını uygula
  const selectedVariant = product.variants.find((v) =>
    Object.entries(selectedVariants).every(([type, name]) => v.type === type && v.name === name)
  );
  const variantPriceDelta = selectedVariant?.priceDelta ?? 0;
  const finalPrice = price + variantPriceDelta;
  const variantStock = selectedVariant?.stock ?? product.stock;
  const variantDesc = Object.entries(selectedVariants)
    .map(([type, name]) => `${type === "color" ? "Renk" : type === "size" ? "Beden" : type}: ${name}`)
    .join(", ");

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        variantId: selectedVariant?.id,
        slug: product.slug,
        name: product.name,
        price: finalPrice,
        basePrice: product.basePrice,
        image: product.images[0]?.url ?? "",
        variant: variantDesc || undefined,
        maxStock: variantStock,
      },
      quantity
    );
    toast.success("Sepete eklendi!", { description: `${quantity} adet ${product.name}` });
  };

  return (
    <div className="space-y-6">
      {/* Marka & isim */}
      {product.brand && <p className="text-sm text-muted">{product.brand.name}</p>}
      <h1 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl text-balance">
        {product.name}
      </h1>

      {/* Puan */}
      {product.rating > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${
                  s <= Math.round(product.rating)
                    ? "fill-accent text-accent"
                    : "fill-primary/10 text-primary/10"
                }`}
              />
            ))}
          </div>
          <span className="text-muted">{product.rating.toFixed(1)} ({product.reviewCount} yorum)</span>
          <span className="text-primary/30">·</span>
          <span className="text-primary font-medium">Yüksek puan</span>
        </div>
      )}

      {/* Fiyat */}
      <div className="flex items-center gap-3">
        <span className="font-serif text-3xl font-bold text-primary">{formatPrice(finalPrice)}</span>
        {product.discountPrice && (
          <>
            <span className="text-lg text-muted line-through">{formatPrice(product.basePrice)}</span>
            <Badge variant="discount">%{discount} indirim</Badge>
          </>
        )}
      </div>

      {/* Kısa açıklama */}
      <p className="text-muted leading-relaxed">{product.shortDesc}</p>

      {/* Stok durumu */}
      <div className="flex items-center gap-2 text-sm">
        {variantStock > 0 ? (
          <>
            <Check className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">Stokta var</span>
            <span className="text-muted">({variantStock} adet kaldı)</span>
          </>
        ) : (
          <span className="text-red-500 font-medium">Tükendi</span>
        )}
      </div>

      {/* Varyantlar */}
      {Object.entries(variantGroups).map(([type, variants]) => (
        <div key={type} className="space-y-2">
          <h3 className="text-sm font-medium">
            {type === "color" ? "Renk" : type === "size" ? "Beden" : type}:{" "}
            <span className="text-muted">{selectedVariants[type] ?? "Seçiniz"}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariants((s) => ({ ...s, [type]: v.name }))}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-all",
                  selectedVariants[type] === v.name
                    ? "border-primary bg-primary text-cream"
                    : "border-primary/20 hover:border-primary/50"
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Miktar + Sepete ekle */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-primary/20 p-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-primary/5"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={variantStock === 0}>
          <ShoppingBag className="h-5 w-5" /> Sepete Ekle
        </Button>
        <Button size="lg" variant="outline" onClick={() => toast.info("Favorilere eklendi")}>
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Güven rozetleri */}
      <TrustSeals />

      {/* Sekmeler */}
      <Tabs defaultValue="description" className="mt-8">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="description">Açıklama</TabsTrigger>
          <TabsTrigger value="specs">Özellikler</TabsTrigger>
          <TabsTrigger value="shipping">Kargo & İade</TabsTrigger>
          <TabsTrigger value="reviews">Yorumlar ({product.reviewCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="prose prose-sm max-w-none">
          <p className="text-ink/80 leading-relaxed whitespace-pre-line">{product.description}</p>
        </TabsContent>

        <TabsContent value="specs">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between border-b border-primary/10 pb-2">
              <span className="text-muted">SKU</span>
              <span className="font-medium">{product.sku}</span>
            </li>
            <li className="flex justify-between border-b border-primary/10 pb-2">
              <span className="text-muted">Para Birimi</span>
              <span className="font-medium">{product.currency}</span>
            </li>
            {product.arEnabled && (
              <li className="flex justify-between border-b border-primary/10 pb-2">
                <span className="text-muted">3D / AR Görünüm</span>
                <span className="font-medium text-primary">Mevcut</span>
              </li>
            )}
          </ul>
        </TabsContent>

        <TabsContent value="shipping">
          <div className="space-y-3 text-sm text-ink/80">
            <p>• Siparişleriniz 1-3 iş günü içinde kargoya verilir.</p>
            <p>• 2000₺ üzeri siparişlerde kargo ücretsizdir.</p>
            <p>• İstanbul içi kapıda ödeme seçeneği mevcuttur.</p>
            <p>• 14 gün içinde koşulsuz iade hakkınız bulunmaktadır.</p>
            <p>• Kredi kartına 3 taksit imkanı sunulmaktadır.</p>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            {/* Özet */}
            {product.reviewCount > 0 && (
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <div className="text-center sm:text-left">
                    <div className="font-serif text-4xl font-bold text-primary">
                      {product.rating.toFixed(1)}
                    </div>
                    <div className="mt-1 flex justify-center sm:justify-start">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= Math.round(product.rating)
                              ? "fill-accent text-accent"
                              : "fill-primary/10 text-primary/10"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted">{product.reviewCount} yorum</p>
                  </div>
                  <div className="text-sm text-muted text-center sm:text-right">
                    <p className="flex items-center gap-1.5 justify-center sm:justify-end">
                      <BadgeCheck className="h-4 w-4 text-primary" />
                      Tüm yorumlar doğrulanmış alıcılar tarafından yazılmıştır
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Yorum listesi */}
            <div className="space-y-4">
              {product.reviews.length === 0 ? (
                <div className="rounded-2xl border border-primary/10 bg-white/60 p-8 text-center">
                  <p className="text-sm text-muted">
                    Henüz yorum yapılmamış. İlk yorumu sen yap!
                  </p>
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-primary/10 bg-white/60 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light font-serif text-sm font-bold text-cream">
                          {(review.authorName ?? "M").charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{review.authorName ?? "Misafir"}</span>
                            {review.verified && (
                              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                <BadgeCheck className="h-3 w-3" /> Doğrulanmış
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                            {review.authorLocation && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="h-3 w-3" /> {review.authorLocation}
                              </span>
                            )}
                            <span className="flex items-center gap-0.5">
                              <Calendar className="h-3 w-3" />
                              {new Date(review.createdAt).toLocaleDateString("tr-TR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-4 w-4 ${
                              s <= review.rating
                                ? "fill-accent text-accent"
                                : "fill-primary/10 text-primary/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && <h4 className="font-medium text-sm mb-1.5">{review.title}</h4>}
                    <p className="text-sm text-muted leading-relaxed">{review.body}</p>
                    {review.helpfulCount > 0 && (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
                        <ThumbsUp className="h-3 w-3" /> {review.helpfulCount} kişi faydalı buldu
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Yorum yazma formu */}
            <ReviewForm productId={product.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
