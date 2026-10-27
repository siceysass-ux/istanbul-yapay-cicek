"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Loader2, Minus, Plus, Star, Sparkles, ExternalLink, Pencil } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { quickUpdateProductAction, type QuickUpdatePatch } from "@/app/admin/urunler/actions";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ProductRowData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  discountPrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  categoryId: string;
  imageUrl?: string;
}

export function ProductInlineRow({
  product,
  categories,
}: {
  product: ProductRowData;
  categories: CategoryOption[];
}) {
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(product.name);
  const [editingName, setEditingName] = useState(false);

  const [categoryId, setCategoryId] = useState(product.categoryId);

  const effectiveInitialPrice = product.discountPrice ?? product.basePrice;
  const [price, setPrice] = useState<number>(effectiveInitialPrice);
  const [priceInput, setPriceInput] = useState<string>(String(effectiveInitialPrice));
  const [editingPrice, setEditingPrice] = useState(false);

  const [stock, setStock] = useState<number>(product.stock);
  const [stockInput, setStockInput] = useState<string>(String(product.stock));
  const [editingStock, setEditingStock] = useState(false);

  const [isActive, setIsActive] = useState(product.isActive);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured);
  const [isNew, setIsNew] = useState(product.isNew);

  const savePatch = (patch: QuickUpdatePatch, label: string) => {
    startTransition(async () => {
      const res = await quickUpdateProductAction(product.id, patch);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`${label} güncellendi`, { duration: 1800 });
      }
    });
  };

  const handleNameCommit = () => {
    setEditingName(false);
    const trimmed = name.trim();
    if (!trimmed || trimmed === product.name) {
      setName(trimmed || product.name);
      return;
    }
    savePatch({ name: trimmed }, "Ürün adı");
  };

  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    savePatch({ categoryId: newCatId }, "Kategori");
  };

  const handlePriceCommit = () => {
    setEditingPrice(false);
    const parsed = Number(priceInput.replace(",", "."));
    if (Number.isNaN(parsed) || parsed <= 0 || parsed === price) {
      setPriceInput(String(price));
      return;
    }
    setPrice(parsed);
    // Hem basePrice'ı güncelle hem de varsa eski discountPrice'ı sıfırla ki vitrin fiyatı net olsun
    savePatch({ basePrice: parsed, discountPrice: null }, `Fiyat (${formatPrice(parsed)})`);
  };

  const handleStockCommit = (nextStock?: number) => {
    setEditingStock(false);
    const val =
      nextStock !== undefined
        ? Math.max(0, nextStock)
        : Math.max(0, Math.round(Number(stockInput) || 0));
    setStock(val);
    setStockInput(String(val));
    if (val === product.stock && nextStock === undefined) return;
    savePatch({ stock: val }, `Stok (${val} adet)`);
  };

  const toggleActive = () => {
    const next = !isActive;
    setIsActive(next);
    savePatch({ isActive: next }, next ? "Ürün aktif edildi" : "Ürün pasife alındı");
  };

  const toggleFeatured = () => {
    const next = !isFeatured;
    setIsFeatured(next);
    savePatch({ isFeatured: next }, next ? "Öne çıkanlara eklendi" : "Öne çıkanlardan çıkarıldı");
  };

  const toggleNew = () => {
    const next = !isNew;
    setIsNew(next);
    savePatch({ isNew: next }, next ? "'Yeni' rozeti açıldı" : "'Yeni' rozeti kapatıldı");
  };

  return (
    <tr className="border-b border-primary/8 transition-colors hover:bg-primary/[0.03]">
      {/* 1. Ürün Görseli + Tıklayınca Düzenlenen İsim */}
      <td className="p-3.5">
        <div className="flex items-center gap-3">
          <Link
            href={`/urun/${product.slug}`}
            target="_blank"
            className="relative h-13 w-11 shrink-0 overflow-hidden rounded-lg border border-primary/10 bg-[#f6f5f2] group"
            title="Sitede görüntüle"
          >
            {product.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            )}
          </Link>

          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleNameCommit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNameCommit();
                    if (e.key === "Escape") {
                      setName(product.name);
                      setEditingName(false);
                    }
                  }}
                  className="w-full rounded-lg border border-accent bg-white px-2.5 py-1 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-accent/25"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="group flex items-center gap-1.5 text-left font-medium text-ink hover:text-accent transition-colors"
                title="İsmi hızlı düzenlemek için tıklayın"
              >
                <span className="line-clamp-1">{name}</span>
                <Pencil className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-70 text-accent" />
              </button>
            )}
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
              <span>{product.sku}</span>
              <Link
                href={`/urun/${product.slug}`}
                target="_blank"
                className="inline-flex items-center gap-0.5 text-[11px] text-accent hover:underline"
              >
                <span>Sitede Gör</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        </div>
      </td>

      {/* 2. Kategori — Doğrudan Açılır Seçim */}
      <td className="p-3.5">
        <select
          value={categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          disabled={pending}
          className="h-9 rounded-xl border border-primary/15 bg-white px-2.5 text-xs font-medium text-ink transition-colors hover:border-accent focus:border-accent focus:outline-none cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </td>

      {/* 3. Fiyat — Üzerine Tıklayınca Anında Düzenlenen Fiyat */}
      <td className="p-3.5">
        {editingPrice ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="10"
              autoFocus
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              onBlur={handlePriceCommit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePriceCommit();
                if (e.key === "Escape") {
                  setPriceInput(String(price));
                  setEditingPrice(false);
                }
              }}
              className="w-24 rounded-lg border border-accent bg-white px-2.5 py-1 font-price text-sm font-bold text-ink focus:outline-none focus:ring-2 focus:ring-accent/25"
            />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handlePriceCommit();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white"
              title="Kaydet"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setPriceInput(String(price));
              setEditingPrice(true);
            }}
            className="group inline-flex items-center gap-1.5 rounded-xl border border-transparent bg-primary/[0.04] px-3 py-1.5 font-price text-sm font-extrabold text-ink transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
            title="Fiyatı hızlı değiştirmek için tıklayın"
          >
            <span>{formatPrice(price)}</span>
            <Pencil className="h-3 w-3 opacity-40 group-hover:opacity-100 text-accent" />
          </button>
        )}
      </td>

      {/* 4. Stok — +/- Butonları + Üzerine Tıklayınca Yazılabilir Stok */}
      <td className="p-3.5">
        <div className="inline-flex items-center gap-1 rounded-xl border border-primary/12 bg-white p-1">
          <button
            type="button"
            disabled={pending || stock <= 0}
            onClick={() => handleStockCommit(Math.max(0, stock - 1))}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-muted hover:bg-primary/8 hover:text-ink disabled:opacity-30"
            title="Stok 1 azalt"
          >
            <Minus className="h-3 w-3" />
          </button>

          {editingStock ? (
            <input
              type="number"
              autoFocus
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              onBlur={() => handleStockCommit()}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStockCommit();
                if (e.key === "Escape") {
                  setStockInput(String(stock));
                  setEditingStock(false);
                }
              }}
              className="w-12 rounded border border-accent bg-white text-center font-price text-xs font-bold text-ink focus:outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setStockInput(String(stock));
                setEditingStock(true);
              }}
              className={`min-w-9 px-1.5 py-0.5 text-center font-price text-xs font-bold rounded hover:bg-accent/10 ${
                stock > 0 ? "text-ink" : "text-red-600"
              }`}
              title="Stok adedini yazmak için tıklayın"
            >
              {stock}
            </button>
          )}

          <button
            type="button"
            disabled={pending}
            onClick={() => handleStockCommit(stock + 1)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-muted hover:bg-primary/8 hover:text-ink disabled:opacity-30"
            title="Stok 1 artır"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </td>

      {/* 5. Durum ve Rozetler — Tek Tıkla Aktif/Pasif, Öne Çıkan, Yeni */}
      <td className="p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={toggleActive}
            disabled={pending}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            title="Tıklayarak Aktif / Pasif durumunu değiştirin"
          >
            {isActive ? "Aktif" : "Pasif"}
          </button>

          <button
            type="button"
            onClick={toggleFeatured}
            disabled={pending}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
              isFeatured
                ? "bg-accent text-white shadow-2xs"
                : "bg-primary/6 text-muted hover:bg-primary/12 hover:text-ink"
            }`}
            title="Tıklayarak 'Öne Çıkan' rozetini açıp kapatın"
          >
            <Star className={`h-3 w-3 ${isFeatured ? "fill-current" : ""}`} />
            <span>Öne Çıkan</span>
          </button>

          <button
            type="button"
            onClick={toggleNew}
            disabled={pending}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
              isNew
                ? "bg-[#1e2426] text-white shadow-2xs"
                : "bg-primary/6 text-muted hover:bg-primary/12 hover:text-ink"
            }`}
            title="Tıklayarak 'Yeni' rozetini açıp kapatın"
          >
            <Sparkles className="h-3 w-3" />
            <span>Yeni</span>
          </button>
        </div>
      </td>

      {/* 6. İşlemler */}
      <td className="p-3.5">
        <div className="flex items-center gap-3">
          {pending && <Loader2 className="h-4 w-4 animate-spin text-accent" />}
          <Link
            href={`/admin/urunler/${product.id}`}
            className="rounded-lg border border-primary/15 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
          >
            Detaylı Düzenle
          </Link>
          <DeleteProductButton id={product.id} name={name} />
        </div>
      </td>
    </tr>
  );
}
