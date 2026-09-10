"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { Category, Brand } from "@prisma/client";
import type { ProductFormInput } from "@/app/admin/urunler/actions";

interface ProductFormProps {
  action: (formData: FormData) => Promise<{ error?: string }>;
  categories: Category[];
  brands: Brand[];
  initial?: Partial<ProductFormInput> & { id?: string };
  submitLabel?: string;
}

export function ProductForm({ action, categories, brands, initial, submitLabel = "Kaydet" }: ProductFormProps) {
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    initial?.images ?? []
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      formData.set("images", JSON.stringify(images));
      return await action(formData);
    },
    null
  );

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, { url: newImageUrl.trim(), alt: "" }]);
    setNewImageUrl("");
  };

  const removeImage = (i: number) => {
    setImages(images.filter((_, idx) => idx !== i));
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Temel bilgiler */}
      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
        <h2 className="font-serif text-lg font-semibold mb-4">Temel Bilgiler</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Ürün Adı *</label>
            <Input name="name" defaultValue={initial?.name} required placeholder="Ürün adı" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Kısa Açıklama</label>
            <Input name="shortDesc" defaultValue={initial?.shortDesc} placeholder="Kısa açıklama" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Açıklama</label>
            <textarea
              name="description"
              defaultValue={initial?.description}
              rows={5}
              className="w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ürün açıklaması"
            />
          </div>
        </div>
      </div>

      {/* Fiyat & stok */}
      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
        <h2 className="font-serif text-lg font-semibold mb-4">Fiyat & Stok</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Baz Fiyat (₺) *</label>
            <Input name="basePrice" type="number" step="0.01" defaultValue={initial?.basePrice ?? 0} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">İndirim Fiyatı (₺)</label>
            <Input name="discountPrice" type="number" step="0.01" defaultValue={initial?.discountPrice ?? ""} placeholder="Boş bırakılabilir" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">SKU *</label>
            <Input name="sku" defaultValue={initial?.sku} required placeholder="ör. GD-KR-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Stok</label>
            <Input name="stock" type="number" defaultValue={initial?.stock ?? 0} />
          </div>
        </div>
      </div>

      {/* Kategori & marka */}
      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
        <h2 className="font-serif text-lg font-semibold mb-4">Sınıflandırma</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Kategori *</label>
            <select
              name="categoryId"
              defaultValue={initial?.categoryId ?? ""}
              required
              className="h-11 w-full rounded-full border border-primary/15 bg-white/60 px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Seçin</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Marka</label>
            <select
              name="brandId"
              defaultValue={initial?.brandId ?? "none"}
              className="h-11 w-full rounded-full border border-primary/15 bg-white/60 px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="none">Markasız</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Etiketler (virgülle)</label>
            <Input name="tags" defaultValue={initial?.tags} placeholder="yapay, çiçek, dekorasyon" />
          </div>
        </div>
      </div>

      {/* Görseller */}
      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
        <h2 className="font-serif text-lg font-semibold mb-4">Görseller</h2>
        <div className="flex gap-2 mb-4">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Görsel URL'si"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addImage}>
            <Plus className="h-4 w-4" /> Ekle
          </Button>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt} className="aspect-square w-full rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Durum */}
      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
        <h2 className="font-serif text-lg font-semibold mb-4">Durum</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} className="h-4 w-4 rounded border-primary/30 text-primary" />
            <span className="text-sm">Aktif</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isFeatured" defaultChecked={initial?.isFeatured ?? false} className="h-4 w-4 rounded border-primary/30 text-primary" />
            <span className="text-sm">Öne Çıkan</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isNew" defaultChecked={initial?.isNew ?? false} className="h-4 w-4 rounded border-primary/30 text-primary" />
            <span className="text-sm">Yeni</span>
          </label>
        </div>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Kaydediliyor...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
