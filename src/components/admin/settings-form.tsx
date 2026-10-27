"use client";

import { useActionState } from "react";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
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
