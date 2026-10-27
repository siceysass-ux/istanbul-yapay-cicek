"use client";

import { useActionState } from "react";
import { Loader2, Lock, CheckCircle2, BarChart2, BellRing } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSettingsAction } from "@/app/admin/ayarlar/actions";

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { ok?: boolean; error?: string } | null, formData: FormData) => {
      const result = await updateSettingsAction(formData);
      if (result?.error) {
        toast.error(result.error);
        return result;
      }
      toast.success("Ayarlar başarıyla kaydedildi!");
      return { ok: true };
    },
    null
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs space-y-4">
        <h2 className="font-serif text-lg font-semibold">Genel Mağaza Bilgileri</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">Site Adı</label>
          <Input name="site_name" defaultValue={initial.site_name || "Çiçek Yapay"} placeholder="Çiçek Yapay" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Telefon</label>
            <Input name="phone" defaultValue={initial.phone || "0(507) 884 66 03"} placeholder="0(507) 884 66 03" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">E-posta</label>
            <Input name="email" type="email" defaultValue={initial.email || "info@cicekyapay.com"} placeholder="info@cicekyapay.com" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Adres</label>
          <Input
            name="address"
            defaultValue={initial.address || "Nuripaşa Mah. Merve Cad. No:73/A, Zeytinburnu / İstanbul"}
            placeholder="Adres"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">WhatsApp Numarası (Ülke Kodu ile)</label>
          <Input name="whatsapp" defaultValue={initial.whatsapp || "905078846603"} placeholder="905078846603" />
        </div>
      </div>

      {/* Reklam ve Dönüşüm Takip Kodları (Google Ads, GA4, Meta Pixel) */}
      <div className="rounded-2xl border border-accent/25 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-lg font-semibold">
            Reklam ve Dönüşüm Takip Kodları (Google Ads, GA4, Meta Pixel)
          </h2>
        </div>
        <p className="text-xs text-muted">
          Buraya girdiğiniz kimlik ve dönüşüm etiketleri anında tüm sitede aktif olur.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium mb-1">Google Ads Hesap ID</label>
            <Input
              name="google_ads_id"
              defaultValue={initial.google_ads_id || "AW-4312107150"}
              placeholder="AW-4312107150"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Google Analytics 4 (GA4) ID</label>
            <Input
              name="ga4_id"
              defaultValue={initial.ga4_id || ""}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Google Ads Satın Alma Dönüşüm Etiketi (Conversion Label)
            </label>
            <Input
              name="google_ads_purchase_label"
              defaultValue={initial.google_ads_purchase_label || ""}
              placeholder="Örn: AbCdEfGhIjKlMnOpQr"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Google Ads WhatsApp Tıklama Dönüşüm Etiketi
            </label>
            <Input
              name="google_ads_whatsapp_label"
              defaultValue={initial.google_ads_whatsapp_label || ""}
              placeholder="Örn: XyZaBcDeFgHiJkLmNo"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium mb-1">
              Meta (Facebook / Instagram) Pixel ID
            </label>
            <Input
              name="meta_pixel_id"
              defaultValue={initial.meta_pixel_id || ""}
              placeholder="Örn: 123456789012345"
            />
          </div>
        </div>
      </div>

      {/* Sol Alt Satın Alma Bildirimleri Ayarı */}
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <BellRing className="h-4 w-4 text-accent" />
          <h2 className="font-serif text-lg font-semibold">Sol Alt Satın Alma Bildirimleri</h2>
        </div>
        <div>
          <select
            name="social_proof_enabled"
            defaultValue={initial.social_proof_enabled ?? "true"}
            className="h-11 w-full rounded-xl border border-primary/15 bg-white px-4 text-sm font-medium focus:border-accent focus:outline-none"
          >
            <option value="true">Açık (Sitede Sol Altta Göster)</option>
            <option value="false">Kapalı (Reklam İnceleme Sürecinde Gizle)</option>
          </select>
        </div>
      </div>

      {/* Yönetici Şifresi Güncelleme */}
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-accent" />
          <h2 className="font-serif text-lg font-semibold">Admin Panel Şifresini Değiştir</h2>
        </div>
        <p className="text-xs text-muted">
          Şifrenizi değiştirmek istemiyorsanız bu alanı boş bırakabilirsiniz.
        </p>
        <div>
          <label className="block text-sm font-medium mb-1.5">Yeni Yönetici Şifresi</label>
          <Input
            name="new_admin_password"
            type="password"
            autoComplete="new-password"
            placeholder="En az 6 karakterli yeni şifre (opsiyonel)"
          />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Değişiklikler veritabanına kaydedildi.
        </p>
      )}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ayarları Kaydet"}
      </Button>
    </form>
  );
}
