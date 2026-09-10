"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSettingsAction } from "@/app/admin/ayarlar/actions";

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await updateSettingsAction(formData);
      if (result?.error) return result;
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6 space-y-4">
        <h2 className="font-serif text-lg font-semibold">Genel Bilgiler</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">Site Adı</label>
          <Input name="site_name" defaultValue={initial.site_name} placeholder="İstanbul Yapay Çiçek" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Telefon</label>
            <Input name="phone" defaultValue={initial.phone} placeholder="0(507) 884 66 03" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">E-posta</label>
            <Input name="email" type="email" defaultValue={initial.email} placeholder="info@..." />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Adres</label>
          <Input name="address" defaultValue={initial.address} placeholder="Adres" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">WhatsApp (ülke kodu ile)</label>
          <Input name="whatsapp" defaultValue={initial.whatsapp} placeholder="905078846603" />
        </div>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6 space-y-4">
        <h2 className="font-serif text-lg font-semibold">Kargo Ayarları</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Ücretsiz Kargo Eşiği (₺)</label>
            <Input name="free_shipping_threshold" type="number" defaultValue={initial.free_shipping_threshold} placeholder="2000" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Kargo Ücreti (₺)</label>
            <Input name="shipping_cost" type="number" defaultValue={initial.shipping_cost} placeholder="49" />
          </div>
        </div>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ayarları Kaydet"}
      </Button>
    </form>
  );
}
