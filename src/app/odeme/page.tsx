"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, CreditCard, Truck, MapPin, Tag, X, Loader2 } from "lucide-react";
import { useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createOrderAction, type CheckoutFormInput } from "./actions";
import { validateCouponAction } from "./coupon";
import { TrustSeals } from "@/components/marketing/trust-seals";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear, couponCode, couponDiscount, setCoupon, clearCoupon } = useCart();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState(couponCode ?? "");
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standart");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", postalCode: "", notes: "",
  });

  const shippingCost = shippingMethod === "hizli" ? 99 : shippingMethod === "cod" ? 49 : total >= 2000 ? 0 : 49;
  const discountedTotal = Math.max(0, total - couponDiscount);
  const grandTotal = discountedTotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold">Sepetiniz boş</h1>
        <Button className="mt-6" onClick={() => router.push("/kategori/yapay-cicek")}>
          Alışverişe Başla
        </Button>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const result = await validateCouponAction(couponInput, total);
      if (result.valid && result.discount) {
        setCoupon(couponInput.toUpperCase(), result.discount);
        toast.success(`Kupon uygulandı: -${formatPrice(result.discount)}`);
      } else {
        clearCoupon();
        toast.error(result.error ?? "Geçersiz kupon.");
      }
    } catch {
      toast.error("Kupon doğrulanamadı.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final submit — server action
    setSubmitting(true);
    const payload: CheckoutFormInput = {
      ...form,
      shippingMethod,
      shippingCost,
      paymentMethod,
      couponCode: couponCode,
      items: items.map((i) => ({
        id: i.id,
        variantId: i.variantId,
        slug: i.slug,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        variant: i.variant,
      })),
      subtotal: total,
      total: grandTotal,
    };

    try {
      const formData = new FormData();
      formData.set("payload", JSON.stringify(payload));
      // createOrderAction redirect yapacak; hata dönerse yakala
      const result = await createOrderAction(formData);
      if (result?.error) {
        toast.error(result.error);
        setSubmitting(false);
      }
      // Başarılıysa redirect zaten olur
    } catch {
      // redirect bir exception fırlatır, normal
    }
  };

  const steps = [
    { num: 1, label: "Teslimat", icon: MapPin },
    { num: 2, label: "Kargo", icon: Truck },
    { num: 3, label: "Ödeme", icon: CreditCard },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold mb-8">Ödeme</h1>

      {/* Adımlar */}
      <div className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2 sm:gap-4">
            <div className={`flex items-center gap-2 ${step >= s.num ? "text-primary" : "text-muted"}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= s.num ? "bg-primary text-cream" : "bg-primary/10"}`}>
                {step > s.num ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </div>
              <span className="hidden sm:block text-sm font-medium">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`h-px w-8 sm:w-16 ${step > s.num ? "bg-primary" : "bg-primary/20"}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-primary/10 bg-white/60 p-6">
          {step === 1 && (
            <>
              <h2 className="font-serif text-xl font-semibold mb-4">Teslimat Bilgileri</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Ad Soyad</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Adınız Soyadınız" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">E-posta</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="e-posta@ornek.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Telefon</label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="05XX XXX XX XX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Şehir</label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required placeholder="İstanbul" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Adres</label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required placeholder="Mahalle, sokak, kapı no" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Posta Kodu</label>
                  <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="34000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Sipariş Notu</label>
                  <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Teslimat notu (opsiyonel)" />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full">Devam Et</Button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-serif text-xl font-semibold mb-4">Kargo Seçimi</h2>
              <div className="space-y-3">
                {[
                  { id: "standart", name: "Standart Kargo", desc: "1-3 iş günü", price: total >= 2000 ? 0 : 49 },
                  { id: "hizli", name: "Hızlı Kargo", desc: "Aynı gün teslim (İstanbul içi)", price: 99 },
                  { id: "cod", name: "Kapıda Ödeme", desc: "İstanbul içi, nakit ödeme", price: 49 },
                ].map((opt) => (
                  <label key={opt.id} className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-colors ${shippingMethod === opt.id ? "border-primary bg-primary/5" : "border-primary/15 hover:border-primary/40"}`}>
                    <input type="radio" name="shipping" checked={shippingMethod === opt.id} onChange={() => setShippingMethod(opt.id)} className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{opt.name}</div>
                      <div className="text-xs text-muted">{opt.desc}</div>
                    </div>
                    <span className="font-medium text-sm">{opt.price === 0 ? "Ücretsiz" : formatPrice(opt.price)}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>Geri</Button>
                <Button type="submit" size="lg" className="flex-1">Devam Et</Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-serif text-xl font-semibold mb-4">Ödeme Yöntemi</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: "card", name: "Kredi Kartı (3 Taksit)" },
                  { id: "cod", name: "Kapıda Ödeme (Nakit)" },
                ].map((method) => (
                  <label key={method.id} className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-colors ${paymentMethod === method.id ? "border-primary bg-primary/5" : "border-primary/15 hover:border-primary/40"}`}>
                    <input type="radio" name="payment" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{method.name}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4 rounded-2xl bg-primary/5 p-4">
                  <p className="text-xs text-muted">Kart bilgileriniz 256-bit SSL ile şifrelenir.</p>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Kart Numarası</label>
                    <Input placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Son Kullanma</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">CVV</label>
                      <Input placeholder="000" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(2)}>Geri</Button>
                <Button type="submit" size="lg" className="flex-1" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sipariş işleniyor...
                    </>
                  ) : (
                    `Siparişi Tamamla — ${formatPrice(grandTotal)}`
                  )}
                </Button>
              </div>
            </>
          )}
        </form>

        {/* Özet */}
        <div className="rounded-2xl border border-primary/10 bg-white/60 p-6 h-fit">
          <h2 className="font-serif text-lg font-semibold mb-4">Sipariş Özeti</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
            {items.map((item) => {
              const key = item.variantId ? `${item.id}__${item.variantId}` : item.id;
              return (
                <div key={key} className="flex gap-3 text-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    {item.variant && <p className="text-xs text-muted">{item.variant}</p>}
                    <p className="text-xs text-muted">{item.quantity} adet</p>
                  </div>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          {/* Kupon */}
          <div className="border-t border-primary/10 pt-4 mb-4">
            {couponCode ? (
              <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-medium">{couponCode}</span>
                  <span className="text-muted">-{formatPrice(couponDiscount)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { clearCoupon(); setCouponInput(""); }}
                  className="text-muted hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Kupon kodu"
                  className="text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                >
                  {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Uygula"}
                </Button>
              </div>
            )}
          </div>

          <div className="border-t border-primary/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted">Ara toplam</span><span>{formatPrice(total)}</span></div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-primary"><span>İndirim</span><span>-{formatPrice(couponDiscount)}</span></div>
            )}
            <div className="flex justify-between"><span className="text-muted">Kargo</span><span>{shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}</span></div>
            <div className="flex justify-between text-base font-semibold border-t border-primary/10 pt-2">
              <span>Toplam</span><span className="text-primary">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Güven rozetleri */}
          <div className="mt-6">
            <TrustSeals />
          </div>
        </div>
      </div>
    </div>
  );
}
