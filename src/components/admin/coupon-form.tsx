"use client";

import { useState, useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCouponAction } from "@/app/admin/kampanyalar/actions";

export function CouponForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await createCouponAction(formData);
      if (result?.error) return result;
      window.location.reload();
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="rounded-2xl border border-primary/10 bg-white/60 p-6 space-y-4">
      <h2 className="font-serif text-lg font-semibold">Yeni Kupon</h2>
      <div>
        <label className="block text-sm font-medium mb-1.5">Kupon Kodu *</label>
        <Input name="code" required placeholder="ör. BAHAR20" className="uppercase" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">İndirim Tipi</label>
        <select
          name="type"
          defaultValue="PERCENT"
          className="h-11 w-full rounded-full border border-primary/15 bg-white/60 px-4 text-sm focus:border-primary focus:outline-none"
        >
          <option value="PERCENT">Yüzde (%)</option>
          <option value="FIXED">Sabit Tutar (₺)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Değer *</label>
        <Input name="value" type="number" step="0.01" required placeholder="ör. 10" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Min. Sepet Tutarı (₺)</label>
        <Input name="minOrder" type="number" defaultValue={0} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Max. Kullanım (0 = sınırsız)</label>
        <Input name="maxUses" type="number" defaultValue={0} />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kupon Oluştur"}
      </Button>
    </form>
  );
}
