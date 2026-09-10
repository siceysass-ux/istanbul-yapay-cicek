import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

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
      include: { category: true, brand: true, images: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Ürünler</h1>
          <p className="text-sm text-muted">{products.length} ürün</p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-cream hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" /> Yeni Ürün
        </Link>
      </div>

      {/* Filtre bar */}
      <form className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/10 bg-white/60 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Ürün adı veya SKU ara..."
            className="w-full rounded-full border border-primary/15 bg-white/60 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <select
          name="category"
          defaultValue={category ?? ""}
          className="h-10 rounded-full border border-primary/15 bg-white/60 px-4 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-cream hover:bg-primary-dark"
        >
          <Search className="h-4 w-4" /> Ara
        </button>
      </form>

      {/* Tablo */}
      <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-muted text-xs">
              <th className="p-4 font-medium">Ürün</th>
              <th className="p-4 font-medium">Kategori</th>
              <th className="p-4 font-medium">Fiyat</th>
              <th className="p-4 font-medium">Stok</th>
              <th className="p-4 font-medium">Durum</th>
              <th className="p-4 font-medium">İşlem</th>
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
                <tr key={p.id} className="border-b border-primary/5 hover:bg-primary/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-primary/5">
                        {p.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{p.category.name}</td>
                  <td className="p-4 font-medium">{formatPrice(p.discountPrice ?? p.basePrice)}</td>
                  <td className="p-4">
                    <span className={p.stock > 0 ? "text-primary" : "text-red-500"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.isActive ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-600"}`}>
                      {p.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/urunler/${p.id}`} className="text-primary hover:underline text-xs font-medium">
                        Düzenle
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
