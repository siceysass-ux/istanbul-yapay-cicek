"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, CreditCard, Truck, MapPin, Tag, X, Loader2, Building2, UserCheck } from "lucide-react";
import { useCart } from "@/stores/cart";
import { trackBeginCheckout } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createOrderAction, type CheckoutFormInput } from "./actions";
import { validateCouponAction } from "./coupon";
import { TrustSeals } from "@/components/marketing/trust-seals";

const TURKISH_CITIES = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep",
  "Kocaeli", "Mersin", "Kayseri", "Eskişehir", "Samsun", "Denizli", "Şanlıurfa",
  "Sakarya", "uğla".replace("uğla", "Muğla"), "Tekirdağ", "Balıkesir", "Manisa", "Trabzon", "Diyarbakır",
  "Hatay", "Aydın", "Kahramanmaraş", "Van", "Malatya", "Erzurum", "Ordu", "Afyonkarahisar",
  "Sivas", "Zonguldak", "Tokat", "Çanakkale", "Elazığ", "Çorum", "Kütahya", "Giresun",
  "Isparta", "Edirne", "Düzce", "Yalova", "Kırklareli", "Bolu", "Aksaray", "Kastamonu",
  "Rize", "Uşak", "Niğde", "Karabük", "Kırıkkale", "Nevşehir", "Bilecik", "Amasya",
  "Burdur", "Çankırı", "Erzincan", "Karaman", "Kırşehir", "Sinop", "Bartın", "Artvin",
  "Yozgat", "Adıyaman", "Batman", "Mardin", "Osmaniye", "Kilis", "Siirt", "Şırnak",
  "Bitlis", "Muş", "Ağrı", "Kars", "Bingöl", "Hakkari", "Iğdır", "Ardahan", "Tunceli",
  "Gümüşhane", "Bayburt",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, couponCode, couponDiscount, setCoupon, clearCoupon } = useCart();

  // P0-1: Ara toplam her render'da doğrudan items'tan hesaplanır
  const total = items.reduce(
    (sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0),
    0
  );

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState(couponCode ?? "");
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standart");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [invoiceType, setInvoiceType] = useState<"individual" | "corporate">("individual");
  const [contractAccepted, setContractAccepted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "İstanbul",
    district: "",
    address: "",
    postalCode: "",
    notes: "",
    tcIdentity: "",
    companyName: "",
    taxOffice: "",
    taxNumber: "",
  });

  const [card, setCard] = useState({
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
    installment: 1,
  });

  const isIstanbul = form.city === "İstanbul";
  const baseShippingCost =
    shippingMethod === "hizli" && isIstanbul
      ? 99
      : total >= 2000
      ? 0
      : 49;
  const codFee = paymentMethod === "cod" && isIstanbul ? 49 : 0;
  const shippingCost = baseShippingCost + codFee;
  const discountedTotal = Math.max(0, total - couponDiscount);
  const grandTotal = discountedTotal + shippingCost;

  // P0-9: begin_checkout etkinliği
  const trackedRef = useRef(false);
  useEffect(() => {
    if (items.length > 0 && !trackedRef.current) {
      trackedRef.current = true;
      trackBeginCheckout(
        items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total
      );
    }
  }, [items, total]);

  // Şehir İstanbul dışına değişirse kapıda ödeme ve aynı gün kargoyu standart kargoya çek
  useEffect(() => {
    if (!isIstanbul) {
      if (shippingMethod === "hizli") setShippingMethod("standart");
      if (paymentMethod === "cod") setPaymentMethod("card");
    }
  }, [isIstanbul, shippingMethod, paymentMethod]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold">Sepetiniz boş</h1>
        <Button className="mt-6" onClick={() => router.push("/kategori/yapay-agac")}>
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
    if (step === 1) {
      if (invoiceType === "corporate" && (!form.companyName.trim() || !form.taxOffice.trim() || !form.taxNumber.trim())) {
        toast.error("Kurumsal fatura için Firma Unvanı, Vergi Dairesi ve Vergi Numarası zorunludur.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }

    if (!contractAccepted) {
      toast.error("Siparişi tamamlamak için Ön Bilgilendirme ve Mesafeli Satış Sözleşmesi'ni onaylamalısınız.");
      return;
    }

    setSubmitting(true);
    const fullAddress = `${form.address} (${form.district} / ${form.city})`;
    const invoiceNotes =
      invoiceType === "corporate"
        ? `[KURUMSAL FATURA: ${form.companyName} | VD: ${form.taxOffice} | VKN: ${form.taxNumber}]`
        : form.tcIdentity
        ? `[BİREYSEL FATURA TCKN: ${form.tcIdentity}]`
        : "[BİREYSEL FATURA]";
    const combinedNotes = [invoiceNotes, form.notes].filter(Boolean).join(" — ");

    const payload: CheckoutFormInput = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: fullAddress,
      city: form.city,
      postalCode: form.postalCode,
      notes: combinedNotes,
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
      cardHolderName: card.cardHolderName || form.name,
      cardNumber: card.cardNumber,
      expireMonth: card.expireMonth,
      expireYear: card.expireYear,
      cvc: card.cvc,
      installment: card.installment,
    };

    try {
      const formData = new FormData();
      formData.set("payload", JSON.stringify(payload));
      const result = await createOrderAction(formData);
      if (result?.error) {
        toast.error(result.error);
        setSubmitting(false);
      }
    } catch {
      // redirect
    }
  };

  const steps = [
    { num: 1, label: "Teslimat ve Fatura", icon: MapPin },
    { num: 2, label: "Kargo Seçimi", icon: Truck },
    { num: 3, label: "Ödeme ve Onay", icon: CreditCard },
  ];

  return (
    <div className="mx-auto max-w-5xl px-3.5 py-6 pb-24 sm:px-4 sm:py-10 lg:px-8">
      <h1 className="font-serif text-2xl sm:text-3xl font-semibold mb-5 sm:mb-8">Güvenli Ödeme</h1>

      {/* Adımlar — Mobilde de başlıklarıyla net görünür */}
      <div className="mb-6 sm:mb-10 grid grid-cols-3 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-4">
        {steps.map((s, i) => (
          <div key={s.num} className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
            <div className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 ${step >= s.num ? "text-ink" : "text-muted"}`}>
              <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full ${step >= s.num ? "bg-accent text-white shadow-xs" : "bg-primary/10"}`}>
                {step > s.num ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </div>
              <span className="text-[11px] sm:text-sm font-medium leading-tight">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`hidden sm:block h-px w-8 sm:w-16 ${step > s.num ? "bg-accent" : "bg-primary/20"}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="min-w-0 space-y-5 rounded-2xl border border-primary/10 bg-white p-4 sm:p-6 shadow-xs">
          {step === 1 && (
            <>
              <h2 className="font-serif text-xl font-semibold">1. Teslimat ve Fatura Bilgileri</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Ad Soyad *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Adınız Soyadınız" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Telefon *</label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="05XX XXX XX XX" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">E-posta Adresi (Sipariş ve E-Fatura İçin) *</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="ornek@eposta.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">İl *</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                    className="h-11 w-full rounded-2xl border border-primary/15 bg-white px-4 text-sm focus:border-accent focus:outline-none"
                  >
                    {TURKISH_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">İlçe *</label>
                  <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required placeholder="Örn: Kadıköy / Çankaya" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Açık Adres *</label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required placeholder="Mahalle, cadde/sokak, bina ve daire/kapı no" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Posta Kodu</label>
                  <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="34000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Teslimat Notu</label>
                  <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Opsiyonel teslimat notu" />
                </div>
              </div>

              {/* P1-16: Bireysel / Kurumsal Fatura Seçimi */}
              <div className="border-t border-primary/10 pt-5 space-y-4">
                <h3 className="font-serif text-base font-semibold">Fatura Tipi</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInvoiceType("individual")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                      invoiceType === "individual"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-primary/15 text-ink/75 hover:border-primary/30"
                    }`}
                  >
                    <UserCheck className="h-4 w-4" />
                    Bireysel Fatura
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoiceType("corporate")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                      invoiceType === "corporate"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-primary/15 text-ink/75 hover:border-primary/30"
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    Kurumsal Fatura (Şirket)
                  </button>
                </div>

                {invoiceType === "individual" ? (
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">
                      T.C. Kimlik Numarası (E-Arşiv Fatura İçin — Opsiyonel)
                    </label>
                    <Input
                      maxLength={11}
                      value={form.tcIdentity}
                      onChange={(e) => setForm({ ...form, tcIdentity: e.target.value.replace(/\D/g, "") })}
                      placeholder="11 haneli TCKN"
                    />
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 rounded-2xl bg-cream-dark/60 p-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1">Firma Ticari Unvanı *</label>
                      <Input
                        required
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        placeholder="Örn: ... Turizm Otelcilik ve Tic. Ltd. Şti."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Vergi Dairesi *</label>
                      <Input
                        required
                        value={form.taxOffice}
                        onChange={(e) => setForm({ ...form, taxOffice: e.target.value })}
                        placeholder="Vergi Dairesi"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Vergi Numarası (VKN) *</label>
                      <Input
                        required
                        maxLength={11}
                        value={form.taxNumber}
                        onChange={(e) => setForm({ ...form, taxNumber: e.target.value.replace(/\D/g, "") })}
                        placeholder="10 haneli VKN"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full">Kargo Seçimine Devam Et</Button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-serif text-xl font-semibold mb-4">2. Kargo Seçimi ({form.city})</h2>
              <div className="space-y-3">
                {[
                  {
                    id: "standart",
                    name: "Standart Kargo (Yurtiçi / Aras Kargo)",
                    desc: isIstanbul
                      ? "İstanbul içi 1-3 iş gününde teslim"
                      : "Türkiye geneli 2-5 iş gününde teslim",
                    price: total >= 2000 ? 0 : 49,
                    enabled: true,
                  },
                  {
                    id: "hizli",
                    name: "İstanbul İçi Özel Kurye Teslimatı",
                    desc: isIstanbul
                      ? "Aynı gün veya ertesi iş günü özel araçla teslimat"
                      : "Yalnızca İstanbul içi adreslerde geçerlidir",
                    price: 99,
                    enabled: isIstanbul,
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 rounded-2xl border p-4 transition-colors ${
                      !opt.enabled
                        ? "opacity-45 cursor-not-allowed border-primary/10"
                        : shippingMethod === opt.id
                        ? "border-accent bg-accent/5 cursor-pointer"
                        : "border-primary/15 hover:border-accent/40 cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      disabled={!opt.enabled}
                      checked={shippingMethod === opt.id}
                      onChange={() => setShippingMethod(opt.id)}
                      className="h-4 w-4 text-accent"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{opt.name}</div>
                      <div className="text-xs text-muted">{opt.desc}</div>
                    </div>
                    <span className="font-semibold text-sm">
                      {opt.price === 0 ? "Ücretsiz" : formatPrice(opt.price)}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>Geri</Button>
                <Button type="submit" size="lg" className="flex-1">Ödeme Adımına Geç</Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-serif text-xl font-semibold mb-4">3. Ödeme Yöntemi ve Sözleşme Onayı</h2>
              <div className="space-y-3 mb-5">
                {[
                  {
                    id: "card",
                    name: "Kredi / Banka Kartı (iyzico Güvencesiyle Tek Çekim veya 3 Taksit)",
                    desc: "Mastercard, Visa, American Express, Troy kartlarla 256-bit SSL güvenli ödeme",
                    enabled: true,
                  },
                  {
                    id: "cod",
                    name: "Kapıda Nakit Ödeme (+49₺ Hizmet Bedeli)",
                    desc: isIstanbul
                      ? "İstanbul içi teslimatlarda ürünü teslim alırken nakit ödeme"
                      : "Kapıda ödeme yalnızca İstanbul içi teslimatlarda geçerlidir",
                    enabled: isIstanbul,
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                      !method.enabled
                        ? "opacity-45 cursor-not-allowed border-primary/10"
                        : paymentMethod === method.id
                        ? "border-accent bg-accent/5 cursor-pointer"
                        : "border-primary/15 hover:border-accent/40 cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      disabled={!method.enabled}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="mt-1 h-4 w-4 text-accent"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{method.name}</div>
                      <div className="text-xs text-muted mt-0.5">{method.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4 rounded-2xl bg-cream-dark/70 p-5 border border-primary/10">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 pb-3">
                    <p className="text-xs text-muted">Kart bilgileriniz 256-bit SSL ve iyzico güvencesiyle şifrelenir.</p>
                    <div className="rounded-lg bg-white px-3 py-1.5 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/iyzico-band-colored.svg"
                        alt="iyzico ile Öde — Mastercard, Visa, American Express, Troy"
                        className="h-5 w-auto object-contain"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1">Kart Üzerindeki Ad Soyad *</label>
                      <Input
                        required
                        value={card.cardHolderName}
                        onChange={(e) => setCard({ ...card, cardHolderName: e.target.value })}
                        placeholder="Kart sahibinin adı soyadı"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1">Kart Numarası *</label>
                      <Input
                        required
                        maxLength={19}
                        value={card.cardNumber}
                        onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Ay (AA) *</label>
                        <Input
                          required
                          maxLength={2}
                          value={card.expireMonth}
                          onChange={(e) => setCard({ ...card, expireMonth: e.target.value.replace(/\D/g, "") })}
                          placeholder="08"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Yıl (YY) *</label>
                        <Input
                          required
                          maxLength={4}
                          value={card.expireYear}
                          onChange={(e) => setCard({ ...card, expireYear: e.target.value.replace(/\D/g, "") })}
                          placeholder="28"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">CVV / CVC *</label>
                      <Input
                        required
                        maxLength={4}
                        value={card.cvc}
                        onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "") })}
                        placeholder="000"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1">Taksit Seçeneği</label>
                      <select
                        value={card.installment}
                        onChange={(e) => setCard({ ...card, installment: Number(e.target.value) })}
                        className="h-10 w-full rounded-xl border border-primary/15 bg-white px-3 text-xs font-medium"
                      >
                        <option value={1}>Tek Çekim — {formatPrice(grandTotal)}</option>
                        <option value={2}>2 Taksit — 2 × {formatPrice(Math.round(grandTotal / 2))}</option>
                        <option value={3}>3 Taksit — 3 × {formatPrice(Math.round(grandTotal / 3))}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* P1-16: Ön Bilgilendirme ve Mesafeli Satış Sözleşmesi Onay Kutusu */}
              <label className="flex items-start gap-2.5 rounded-2xl border border-primary/15 bg-cream-dark/40 p-4 text-xs text-ink/85 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contractAccepted}
                  onChange={(e) => setContractAccepted(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-primary/30 text-accent focus:ring-accent"
                />
                <span>
                  Sipariş özeti bilgilerini,{" "}
                  <Link href="/sayfalar/mesafeli-satis-sozlesmesi" target="_blank" className="font-semibold text-accent hover:underline">
                    Ön Bilgilendirme Koşulları ve Mesafeli Satış Sözleşmesi
                  </Link>
                  &apos;ni,{" "}
                  <Link href="/sayfalar/iade-kosullari" target="_blank" className="font-semibold text-accent hover:underline">
                    İade Koşulları
                  </Link>
                  &apos;nı ve{" "}
                  <Link href="/sayfalar/kvkk-aydinlatma" target="_blank" className="font-semibold text-accent hover:underline">
                    KVKK Aydınlatma Metni
                  </Link>
                  &apos;ni okudum, kabul ediyorum. *
                </span>
              </label>

              <div className="flex gap-3 pt-2">
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
        <div className="rounded-2xl border border-primary/10 bg-white p-6 h-fit shadow-xs">
          <h2 className="font-serif text-lg font-semibold mb-4">Sipariş Özeti</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
            {items.map((item) => {
              const key = item.variantId ? `${item.id}__${item.variantId}` : item.id;
              return (
                <div key={key} className="flex gap-3 text-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    {item.variant && <p className="text-xs text-muted truncate">{item.variant}</p>}
                    <p className="text-xs text-muted">{item.quantity} adet × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          {/* Kupon */}
          <div className="border-t border-primary/10 pt-4 mb-4">
            {couponCode ? (
              <div className="flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-accent" />
                  <span className="font-medium">{couponCode}</span>
                  <span className="text-muted">-{formatPrice(couponDiscount)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { clearCoupon(); setCouponInput(""); }}
                  className="text-muted hover:text-red-500"
                  aria-label="Kuponu kaldır"
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
            <div className="flex justify-between"><span className="text-muted">Ara toplam</span><span className="font-medium">{formatPrice(total)}</span></div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-accent"><span>İndirim</span><span>-{formatPrice(couponDiscount)}</span></div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Kargo</span>
              <span className="font-medium">{baseShippingCost === 0 ? "Ücretsiz" : formatPrice(baseShippingCost)}</span>
            </div>
            {codFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted">Kapıda Ödeme Hizmet Bedeli</span>
                <span className="font-medium">{formatPrice(codFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold border-t border-primary/10 pt-2">
              <span>Toplam</span><span className="text-ink">{formatPrice(grandTotal)}</span>
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
