"use client";

import { useState, useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProjectAction } from "@/app/admin/projeler/actions";

export function ProjectForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await createProjectAction(formData);
      if (result?.error) return result;
      window.location.reload();
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="rounded-2xl border border-primary/10 bg-white/60 p-6 space-y-4">
      <h2 className="font-serif text-lg font-semibold">Yeni Proje</h2>
      <div>
        <label className="block text-sm font-medium mb-1.5">Başlık *</label>
        <Input name="title" required placeholder="ör. Ofis Yeşillendirme" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Slug (opsiyonel)</label>
        <Input name="slug" placeholder="otomatik" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Özet</label>
        <Input name="summary" placeholder="Kısa açıklama" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">İçerik</label>
        <textarea
          name="content"
          rows={4}
          className="w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3 text-sm focus:border-primary focus:outline-none"
          placeholder="Proje detayları"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">Lokasyon</label>
          <Input name="location" placeholder="İstanbul" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Süre</label>
          <Input name="duration" placeholder="2 Hafta" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Proje Tipi</label>
        <Input name="projectType" placeholder="Yapay Dikey Bahçe" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Kapak Görseli URL *</label>
        <Input name="coverImage" required placeholder="https://..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Etiketler (virgülle)</label>
        <Input name="tags" placeholder="ofis, dikey bahçe" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4 rounded border-primary/30 text-primary" />
        <span className="text-sm">Aktif</span>
      </label>
      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Proje Ekle"}
      </Button>
    </form>
  );
}
