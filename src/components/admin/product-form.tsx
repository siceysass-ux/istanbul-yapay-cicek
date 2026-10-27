"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Layers } from "lucide-react";
import type { Category, Brand } from "@prisma/client";
import type { ProductFormInput, ProductVariantInput } from "@/app/admin/urunler/actions";

interface ProductFormProps {
  action: (formData: FormData) => Promise<{ error?: string }>;
  categories: Category[];
  brands: Brand[];
  initial?: Partial<ProductFormInput> & { id?: string };
  submitLabel?: string;
}

interface VariantGroupState {
  id: string;
  title: string;
  options: {
    id: string;
    name: string;
    optionPrice: string;
    stock: number;
  }[];
}

function buildInitialGroups(
  variants: ProductVariantInput[] | undefined,
  basePrice: number
): VariantGroupState[] {
  if (!variants || variants.length === 0) return [];
  const map = new Map<string, VariantGroupState>();
  variants.forEach((v, idx) => {
    const label = v.type === "size" ? "Boy / Ölçü" : v.type === "color" ? "Renk" : v.type;
    if (!map.has(label)) {
      map.set(label, {
        id: `grp-${idx}`,
        title: label,
        options: [],
      });
    }
    const finalPrice = Math.max(0, basePrice + Number(v.priceDelta ?? 0));
    map.get(label)!.options.push({
      id: `opt-${idx}`,
      name: v.name,
      optionPrice: String(finalPrice),
      stock: v.stock ?? 15,
    });
  });
  return Array.from(map.values());
}

export function ProductForm({
  action,
  categories,
  brands,
  initial,
  submitLabel = "Kaydet",
}: ProductFormProps) {
  const [basePriceVal, setBasePriceVal] = useState<number>(
    Number(initial?.discountPrice ?? initial?.basePrice ?? 0)
  );
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    initial?.images ?? []
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [variantGroups, setVariantGroups] = useState<VariantGroupState[]>(() =>
    buildInitialGroups(
      initial?.variants,
      Number(initial?.discountPrice ?? initial?.basePrice ?? 0)
    )
  );

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      formData.set("images", JSON.stringify(images));

      const effectiveBase = Number(
        formData.get("discountPrice") || formData.get("basePrice") || basePriceVal || 0
      );
      const flatVariants: ProductVariantInput[] = [];
      for (const grp of variantGroups) {
        const typeTitle = grp.title.trim();
        if (!typeTitle) continue;
        for (const opt of grp.options) {
          const optName = opt.name.trim();
          if (!optName) continue;
          const optPriceNum = Number(opt.optionPrice);
          const priceDelta =
            !Number.isNaN(optPriceNum) && optPriceNum > 0
              ? Math.round((optPriceNum - effectiveBase) * 100) / 100
              : 0;
          flatVariants.push({
            type: typeTitle,
            name: optName,
            priceDelta,
            stock: Math.max(0, Number(opt.stock || 0)),
          });
        }
      }
      formData.set("variants", JSON.stringify(flatVariants));

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

  const addVariantGroup = (presetTitle = "Boy / Ölçü") => {
    setVariantGroups((prev) => [
      ...prev,
      {
        id: `grp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: presetTitle,
        options: [
          {
            id: `opt-${Date.now()}-1`,
            name: presetTitle === "Boy / Ölçü" ? "150 cm" : "",
            optionPrice: String(basePriceVal || 0),
            stock: initial?.stock ?? 15,
          },
          {
            id: `opt-${Date.now()}-2`,
            name: presetTitle === "Boy / Ölçü" ? "180 cm" : "",
            optionPrice: String(basePriceVal || 0),
            stock: initial?.stock ?? 15,
          },
        ],
      },
    ]);
  };

  const removeVariantGroup = (grpId: string) => {
    setVariantGroups((prev) => prev.filter((g) => g.id !== grpId));
  };

  const updateGroupTitle = (grpId: string, title: string) => {
    setVariantGroups((prev) =>
      prev.map((g) => (g.id === grpId ? { ...g, title } : g))
    );
  };

  const addOptionToGroup = (grpId: string) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.id === grpId
          ? {
              ...g,
              options: [
                ...g.options,
                {
                  id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  name: "",
                  optionPrice: String(basePriceVal || 0),
                  stock: initial?.stock ?? 15,
                },
              ],
            }
          : g
      )
    );
  };

  const updateOptionInGroup = (
    grpId: string,
    optId: string,
    patch: Partial<VariantGroupState["options"][number]>
  ) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.id === grpId
          ? {
              ...g,
              options: g.options.map((o) =>
                o.id === optId ? { ...o, ...patch } : o
              ),
            }
          : g
      )
    );
  };

  const removeOptionFromGroup = (grpId: string, optId: string) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.id === grpId
          ? { ...g, options: g.options.filter((o) => o.id !== optId) }
          : g
      )
    );
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Temel bilgiler */}
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs">
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
              className="w-full rounded-2xl border border-primary/15 bg-white px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Ürün açıklaması"
            />
          </div>
        </div>
      </div>

      {/* Fiyat & stok */}
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs">
        <h2 className="font-serif text-lg font-semibold mb-4">Fiyat ve Stok</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Baz Fiyat (₺) *</label>
            <Input
              name="basePrice"
              type="number"
              step="0.01"
              defaultValue={initial?.basePrice ?? 0}
              onChange={(e) => setBasePriceVal(Number(e.target.value || 0))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">İndirim Fiyatı (₺)</label>
            <Input
              name="discountPrice"
              type="number"
              step="0.01"
              defaultValue={initial?.discountPrice ?? ""}
              placeholder="Boş bırakılabilir"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">SKU *</label>
            <Input name="sku" defaultValue={initial?.sku} required placeholder="ör. CY-143" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Stok</label>
            <Input name="stock" type="number" defaultValue={initial?.stock ?? 15} />
          </div>
        </div>
      </div>

      {/* Varyasyonlar (Boy, Ölçü, Saksı Rengi vb.) */}
      <div className="rounded-2xl border border-accent/25 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-accent" />
              <h2 className="font-serif text-lg font-semibold">
                Ürün Varyasyonları (Boy, Ölçü, Saksı Rengi vb.)
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted">
              İstediğiniz varyasyon başlığını (örn. <strong>Boy / Ölçü</strong>, <strong>Saksı Rengi</strong>) ve şıklarını kendi satış fiyatlarıyla ekleyebilirsiniz. Müşterinin seçtiği şık sepette ve sipariş detayında görünür.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addVariantGroup("Boy / Ölçü")}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#d9560b] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Boy / Ölçü Ekle
            </button>
            <button
              type="button"
              onClick={() => addVariantGroup("Saksı Rengi")}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-cream-dark px-3.5 py-2 text-xs font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Saksı Rengi Ekle
            </button>
            <button
              type="button"
              onClick={() => addVariantGroup("Seçenek")}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white px-3.5 py-2 text-xs font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Özel Varyasyon Ekle
            </button>
          </div>
        </div>

        {variantGroups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary/20 bg-cream-dark/30 p-6 text-center text-xs text-muted">
            Bu üründe henüz varyasyon yok. Yukarıdaki <strong>&ldquo;+ Boy / Ölçü Ekle&rdquo;</strong> butonuna tıklayarak hemen boy veya özel seçenek şıkları ekleyebilirsiniz.
          </div>
        ) : (
          <div className="space-y-4">
            {variantGroups.map((grp) => (
              <div
                key={grp.id}
                className="rounded-2xl border border-primary/12 bg-cream-dark/40 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 max-w-sm">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                      Varyasyon Başlığı (Müşterinin Göreceği Başlık)
                    </label>
                    <Input
                      value={grp.title}
                      onChange={(e) => updateGroupTitle(grp.id, e.target.value)}
                      placeholder="Örn: Boy / Ölçü, Saksı Rengi..."
                      className="bg-white font-semibold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariantGroup(grp.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Grubu Kaldır
                  </button>
                </div>

                {/* Şıklar Başlığı */}
                <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-muted px-1 pt-1">
                  <div className="col-span-5 sm:col-span-6">Şık / Seçenek Adı (Örn: 150 cm, 180 cm, 210 cm)</div>
                  <div className="col-span-4 sm:col-span-3">Bu Şıkkın Fiyatı (₺)</div>
                  <div className="col-span-2">Stok</div>
                  <div className="col-span-1 text-right">Sil</div>
                </div>

                {/* Şık Satırları */}
                <div className="space-y-2">
                  {grp.options.map((opt) => (
                    <div key={opt.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5 sm:col-span-6">
                        <Input
                          value={opt.name}
                          onChange={(e) =>
                            updateOptionInGroup(grp.id, opt.id, { name: e.target.value })
                          }
                          placeholder="Örn: 180 cm"
                          className="bg-white h-10 text-sm"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-3">
                        <Input
                          type="number"
                          step="10"
                          value={opt.optionPrice}
                          onChange={(e) =>
                            updateOptionInGroup(grp.id, opt.id, {
                              optionPrice: e.target.value,
                            })
                          }
                          placeholder={String(basePriceVal || 0)}
                          className="bg-white h-10 font-price font-bold text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={opt.stock}
                          onChange={(e) =>
                            updateOptionInGroup(grp.id, opt.id, {
                              stock: Number(e.target.value || 0),
                            })
                          }
                          className="bg-white h-10 text-sm text-center"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeOptionFromGroup(grp.id, opt.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-red-50 hover:text-red-600"
                          title="Şıkkı sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addOptionToGroup(grp.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/15 bg-white px-3.5 py-2 text-xs font-semibold text-accent hover:border-accent"
                >
                  <Plus className="h-3.5 w-3.5" /> Yeni Şık Ekle
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Kategori & marka */}
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs">
        <h2 className="font-serif text-lg font-semibold mb-4">Sınıflandırma</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Kategori *</label>
            <select
              name="categoryId"
              defaultValue={initial?.categoryId ?? ""}
              required
              className="h-11 w-full rounded-full border border-primary/15 bg-white px-4 text-sm focus:border-accent focus:outline-none"
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
              className="h-11 w-full rounded-full border border-primary/15 bg-white px-4 text-sm focus:border-accent focus:outline-none"
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
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs">
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
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs">
        <h2 className="font-serif text-lg font-semibold mb-4">Durum</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} className="h-4 w-4 rounded border-primary/30 text-accent" />
            <span className="text-sm">Aktif</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isFeatured" defaultChecked={initial?.isFeatured ?? false} className="h-4 w-4 rounded border-primary/30 text-accent" />
            <span className="text-sm">Öne Çıkan</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isNew" defaultChecked={initial?.isNew ?? false} className="h-4 w-4 rounded border-primary/30 text-accent" />
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
