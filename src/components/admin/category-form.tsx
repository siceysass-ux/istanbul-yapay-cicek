"use client";

import { useState, useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategoryAction } from "@/app/admin/kategoriler/actions";
import type { Category } from "@prisma/client";

export function CategoryForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await createCategoryAction(formData);
      if (result?.error) return result;
      window.location.reload();
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="rounded-2xl border border-primary/10 bg-white/60 p-6 space-y-4">
      <h2 className="font-serif text-lg font-semibold">Yeni Kategori</h2>
      <div>
        <label className="block text-sm font-medium mb-1.5">Kategori Adı *</label>
        <Input name="name" required placeholder="ör. Yapay Buketler" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Slug (opsiyonel)</label>
        <Input name="slug" placeholder="otomatik oluşturulur" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Üst Kategori</label>
        <select
          name="parentId"
          defaultValue=""
          className="h-11 w-full rounded-full border border-primary/15 bg-white/60 px-4 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">Üst kategori yok</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kategori Ekle"}
      </Button>
    </form>
  );
}
