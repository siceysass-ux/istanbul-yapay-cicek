import Link from "next/link";
import { Plus, Search, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductInlineRow } from "@/components/admin/product-inline-row";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const where = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q } },
              { sku: { contains: q } },
            ],
          }
        : {},
      category ? { category: { slug: category } } : {},
    ],
  };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, brand: true, images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  const categoryOptions = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Ürünler</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm text-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>
              Toplam <strong>{products.length}</strong> ürün · Fiyat, stok, kategori, isim ve rozetlerin üzerine tıklayarak sayfadan çıkmadan anında değiştirebilirsiniz.
            </span>
          </p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d9560b] transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" /> Yeni Ürün Ekle
        </Link>
      </div>

      {/* Filtre bar */}
      <form className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/10 bg-white p-4 shadow-2xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Ürün adı veya SKU ara..."
            className="w-full rounded-full border border-primary/15 bg-white pl-10 pr-4 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <select
          name="category"
          defaultValue={category ?? ""}
          className="h-10 rounded-full border border-primary/15 bg-white px-4 text-sm focus:border-accent focus:outline-none"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-[#1e2426] px-5 py-2 text-sm font-medium text-white hover:bg-accent transition-colors"
        >
          <Search className="h-4 w-4" /> Filtrele
        </button>
        {(q || category) && (
          <Link
            href="/admin/urunler"
            className="rounded-full border border-primary/15 px-4 py-2 text-xs font-medium text-muted hover:text-ink"
          >
            Temizle
          </Link>
        )}
      </form>

      {/* Hızlı Düzenlenebilir Ürün Tablosu */}
      <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-2xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 bg-cream-dark/40 text-left text-muted text-xs">
              <th className="p-3.5 font-semibold">Ürün (Tıkla &amp; Adı Düzenle)</th>
              <th className="p-3.5 font-semibold">Kategori (Hızlı Seç)</th>
              <th className="p-3.5 font-semibold">Fiyat (Tıkla &amp; Yaz)</th>
              <th className="p-3.5 font-semibold">Stok (- / + / Yaz)</th>
              <th className="p-3.5 font-semibold">Durum ve Rozetler (Tek Tık)</th>
              <th className="p-3.5 font-semibold">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted">
                  Ürün bulunamadı.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <ProductInlineRow
                  key={p.id}
                  categories={categoryOptions}
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    sku: p.sku,
                    basePrice: p.basePrice,
                    discountPrice: p.discountPrice,
                    stock: p.stock,
                    isActive: p.isActive,
                    isFeatured: p.isFeatured,
                    isNew: p.isNew,
                    categoryId: p.categoryId,
                    imageUrl: p.images[0]?.url,
                  }}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
