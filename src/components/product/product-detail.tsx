"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  Check,
  Star,
  Calendar,
  MapPin,
  ThumbsUp,
  MessageCircle,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCart } from "@/stores/cart";
import { trackViewItem, trackAddToCart, trackWhatsAppClick } from "@/lib/analytics";
import { formatPrice, cn } from "@/lib/utils";
import { ReviewForm } from "@/components/product/review-form";
import { TrustSeals } from "@/components/marketing/trust-seals";
import type { ProductWithRelations } from "@/lib/types";

export function ProductDetail({ product }: { product: ProductWithRelations }) {
  const [quantity, setQuantity] = useState(1);

  // Varyant tiplerini grupla
  const variantGroups = product.variants.reduce<Record<string, typeof product.variants>>((acc, v) => {
    if (!acc[v.type]) acc[v.type] = [];
    acc[v.type].push(v);
    return acc;
  }, {});

  // Varsayılan olarak her grubun ilk seçeneğini seçili getir
  const initialSelected: Record<string, string> = {};
  for (const [type, list] of Object.entries(variantGroups)) {
    if (list[0]) initialSelected[type] = list[0].name;
  }

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(initialSelected);
  const addItem = useCart((s) => s.addItem);

  const price = product.discountPrice ?? product.basePrice;

  // Her varyant grubundan seçili olan varyant nesnelerini bul
  const selectedVariantObjs = Object.entries(selectedVariants)
    .map(([type, name]) => product.variants.find((v) => v.type === type && v.name === name))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const primarySelectedVariant = selectedVariantObjs[0];
  const variantPriceDelta = selectedVariantObjs.reduce((sum, v) => sum + (v.priceDelta ?? 0), 0);
  const finalPrice = Math.max(0, price + variantPriceDelta);
  const variantStock =
    selectedVariantObjs.length > 0
      ? Math.min(...selectedVariantObjs.map((v) => v.stock))
      : product.stock;
  const variantDesc = Object.entries(selectedVariants)
    .map(([type, name]) => `${type === "color" ? "Renk" : type === "size" ? "Boy / Ölçü" : type}: ${name}`)
    .join(" · ");

  useEffect(() => {
    trackViewItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      category: product.category?.name,
      sku: product.sku,
    });
  }, [product.id, product.name, finalPrice, product.category?.name, product.sku]);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        variantId: primarySelectedVariant?.id,
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
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      quantity,
    });
    toast.success("Sepete eklendi!", { description: `${quantity} adet ${product.name}` });
  };

  const productUrl = `https://cicekyapay.com/urun/${product.slug}`;
  const whatsappProductMsg = encodeURIComponent(
    `Merhaba, "${product.name}" (${productUrl}) ürünü hakkında bilgi almak istiyorum.`
  );
  const whatsappBulkMsg = encodeURIComponent(
    `Merhaba, "${product.name}" (${productUrl}) ürünü için kurumsal / toplu alım fiyat teklifi almak istiyorum.`
  );

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      {/* Marka & isim */}
      {product.brand && <p className="text-xs sm:text-sm font-medium text-accent">{product.brand.name}</p>}
      <h1 className="font-serif text-xl font-semibold leading-snug sm:text-3xl lg:text-4xl text-balance">
        {product.name}
      </h1>

      {/* Puan (Yalnızca gerçek onaylı yorum varsa gösterilir — P0-5) */}
      {product.rating > 0 && product.reviewCount > 0 && (
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
        </div>
      )}

      {/* Fiyat */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <span className="font-price text-2xl sm:text-3xl font-extrabold text-ink">{formatPrice(finalPrice)}</span>
        <span className="rounded-full bg-primary/8 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-ink/75">
          KDV Dahil
        </span>
      </div>

      {/* Kısa açıklama */}
      <p className="text-sm sm:text-base text-muted leading-relaxed">{product.shortDesc}</p>

      {/* Stok durumu — P0-8: Yapay kıtlık mesajı kaldırıldı */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
        {variantStock > 0 ? (
          <>
            <Check className="h-4 w-4 text-accent shrink-0" />
            <span className="text-ink font-medium">Stokta mevcut</span>
            <span className="text-muted">· İstanbul 1-3, tüm Türkiye 2-5 iş günü teslim</span>
          </>
        ) : (
          <span className="text-red-500 font-medium">Tükendi</span>
        )}
      </div>

      {/* Varyantlar — P2-3: Özel varyasyon başlığı ve fiyat farkı gösterimi */}
      {Object.entries(variantGroups).map(([type, variants]) => {
        const displayType = type === "color" ? "Renk" : type === "size" ? "Boy / Ölçü" : type;
        return (
          <div key={type} className="space-y-2">
            <h3 className="text-sm font-medium">
              {displayType}:{" "}
              <span className="text-muted font-semibold">{selectedVariants[type] ?? "Seçiniz"}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const isSelected = selectedVariants[type] === v.name;
                const optPrice = Math.max(0, price + (v.priceDelta ?? 0));
                const showPriceBadge = variants.some((x) => (x.priceDelta ?? 0) !== 0);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariants((s) => ({ ...s, [type]: v.name }))}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs sm:text-sm transition-all flex items-center gap-1.5",
                      isSelected
                        ? "border-accent bg-accent text-white font-semibold shadow-xs"
                        : "border-primary/20 bg-white hover:border-accent"
                    )}
                  >
                    <span>{v.name}</span>
                    {showPriceBadge && (
                      <span
                        className={cn(
                          "font-price text-[11px] font-bold",
                          isSelected ? "text-white/90" : "text-accent"
                        )}
                      >
                        ({formatPrice(optPrice)})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Miktar + Sepete ekle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-primary/20 p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-8 sm:w-9 items-center justify-center rounded-full hover:bg-primary/5"
            aria-label="Adedi azalt"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-7 sm:w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-9 w-8 sm:w-9 items-center justify-center rounded-full hover:bg-primary/5"
            aria-label="Adedi artır"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button size="lg" className="flex-1 min-w-0 px-4 text-sm sm:text-base" onClick={handleAddToCart} disabled={variantStock === 0}>
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /> <span className="truncate">Sepete Ekle</span>
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="px-3 sm:px-4 shrink-0"
          onClick={() => toast.info("Favorilere eklendi")}
          aria-label="Favorilere ekle"
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* P3-2 & P3-3: Ürün Bazlı Hazır Mesajlı WhatsApp + Kurumsal / Toplu Alım Teklif Yolu */}
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={`https://wa.me/905078846603?text=${whatsappProductMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick(`urun:${product.slug}`)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:brightness-95"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span>WhatsApp ile Bilgi ve Sipariş</span>
        </a>

        <a
          href={`https://wa.me/905078846603?text=${whatsappBulkMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick(`toplu-teklif:${product.slug}`)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-cream-dark px-4 py-3 text-xs font-semibold text-ink transition-all hover:border-accent hover:text-accent"
        >
          <Building2 className="h-4 w-4 text-accent shrink-0" />
          <span>Mekanınız İçin Toplu Teklif Alın</span>
        </a>
      </div>
      <p className="text-[11px] text-muted">
        * Otel, ofis, kafe, restoran ve proje alımlarında kurumsal fatura düzenlenir; çoklu adetlerde özel proje iskontosu uygulanır.
      </p>

      {/* Güven rozetleri */}
      <TrustSeals />

      {/* Sekmeler */}
      <Tabs defaultValue="description" className="mt-8">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="description">Açıklama</TabsTrigger>
          <TabsTrigger value="specs">Özellikler</TabsTrigger>
          <TabsTrigger value="shipping">Kargo ve İade</TabsTrigger>
          <TabsTrigger value="reviews">Yorumlar ({product.reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="prose prose-sm max-w-none">
          <p className="text-ink/80 leading-relaxed whitespace-pre-line">{product.description}</p>
        </TabsContent>

        <TabsContent value="specs">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between border-b border-primary/10 pb-2">
              <span className="text-muted">Stok Kodu (SKU)</span>
              <span className="font-medium">{product.sku}</span>
            </li>
            <li className="flex justify-between border-b border-primary/10 pb-2">
              <span className="text-muted">Marka</span>
              <span className="font-medium">Çiçek Yapay</span>
            </li>
            <li className="flex justify-between border-b border-primary/10 pb-2">
              <span className="text-muted">Fatura Tipi</span>
              <span className="font-medium">Bireysel / Kurumsal E-Fatura</span>
            </li>
          </ul>
        </TabsContent>

        <TabsContent value="shipping">
          <div className="space-y-3 text-sm text-ink/80">
            <p>• Tüm ürünlerimizde Türkiye geneli <strong>kargo ücretsizdir</strong>.</p>
            <p>• Siparişleriniz özenli korumalı ambalajla 1-3 iş günü içinde kargoya teslim edilir.</p>
            <p>• Teslimat süresi İstanbul içi 1-3 iş günü, diğer iller için 2-5 iş günüdür.</p>
            <p>• iyzico 3D Secure güvencesiyle kredi kartına 12 taksite kadar ödeme imkanı sunulmaktadır.</p>
            <p>• Teslimattan itibaren 14 gün içinde kullanılmamış ve orijinal ambalajındaki ürünlerde cayma/iade hakkınız bulunmaktadır.</p>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            {/* Yorum listesi — P0-4: Uydurma yorumlar kaldırıldı */}
            <div className="space-y-4">
              {product.reviews.length === 0 ? (
                <div className="rounded-2xl border border-primary/10 bg-cream-dark/50 p-8 text-center">
                  <p className="text-sm font-medium text-ink">
                    Henüz bu ürün için değerlendirme yazılmamış.
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Ürünü satın alıp deneyimlediyseniz aşağıdaki formdan yorumunuzu paylaşabilirsiniz; yorumlar editör onayından sonra yayınlanır.
                  </p>
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-primary/10 bg-white p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-serif text-sm font-bold text-white">
                          {(review.authorName ?? "M").charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-medium">{review.authorName ?? "Müşteri"}</span>
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
