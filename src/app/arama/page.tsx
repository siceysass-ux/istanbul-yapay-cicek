import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LoadMoreProductGrid } from "@/components/product/load-more-product-grid";
import { SearchBar } from "@/components/layout/search-bar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ürün Arama Sonuçları",
  description: "Çiçek Yapay ürün ve kategori arama sonuçları.",
  robots: { index: false, follow: true },
};

function normalizeTr(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const normQ = normalizeTr(q);
  const tokens = normQ.split(" ").filter(Boolean);

  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
      brand: true,
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const matched =
    tokens.length === 0
      ? allProducts
      : allProducts.filter((p) => {
          const hay = normalizeTr(
            `${p.name} ${p.shortDesc} ${p.description} ${p.tags} ${p.sku} ${p.category.name}`
          );
          return tokens.every((t) => hay.includes(t));
        });

  return (
    <div className="mx-auto max-w-7xl px-3.5 py-6 pb-24 sm:px-4 sm:py-10 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mb-3">
          {q.trim() ? `"${q}" Arama Sonuçları` : "Tüm Ürünlerde Ara"}
        </h1>
        <SearchBar />
        <p className="mt-2.5 text-xs sm:text-sm text-muted">
          Toplam <span className="font-semibold text-ink">{matched.length}</span> ürün bulundu.
        </p>
      </div>

      {matched.length === 0 ? (
        <div className="rounded-3xl border border-primary/10 bg-cream-dark/50 p-10 text-center">
          <p className="font-serif text-xl font-semibold text-ink">
            Aramanızla eşleşen ürün bulunamadı
          </p>
          <p className="mt-2 text-sm text-muted">
            Farklı bir anahtar kelime deneyebilir veya aşağıdaki kategorilerimize göz atabilirsiniz.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {[
              { label: "Yapay Ağaçlar", href: "/kategori/yapay-agac" },
              { label: "Yapay Çiçekler", href: "/kategori/yapay-cicek" },
              { label: "Saksılı Bitkiler", href: "/kategori/saksi" },
              { label: "Dev Çiçekler", href: "/kategori/dev-cicekler" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-[#d9560b]"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <LoadMoreProductGrid products={matched} step={12} />
      )}
    </div>
  );
}
