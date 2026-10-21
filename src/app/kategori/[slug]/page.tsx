import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import { ProductCard } from "@/components/product/product-card";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.name} kategorisindeki yapay çiçek ve bitki ürünleri.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const requestedPage = Number(query.page ?? "1");
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const categoryIds = [category.id, ...category.children.map((child) => child.id)];
  const { products, total } = await getProductsByCategory(categoryIds, page);
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      {/* Kompakt Üst Başlık & Breadcrumb (Hero banner kaldırıldı) */}
      <div className="mb-6 flex flex-col gap-3 border-b border-primary/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="mb-1.5 flex items-center gap-1 text-xs text-muted">
            <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-primary font-medium">{category.name}</span>
          </nav>
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
              {category.name}
            </h1>
            <span className="rounded-full bg-primary/8 px-3 py-0.5 text-xs font-medium text-primary">
              {total} ürün
            </span>
          </div>
        </div>

        {/* Hızlı kategori geçiş hapları */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: "Yapay Ağaçlar", slug: "yapay-agac" },
            { label: "Yapay Çiçekler", slug: "yapay-cicek" },
            { label: "Saksılı & Bonsai", slug: "saksi" },
            { label: "Dev Çiçekler", slug: "yapay-guller" },
          ].map((cat) => {
            const isCurrent = cat.slug === slug;
            return (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-primary text-cream shadow-xs"
                    : "border border-primary/15 bg-white/60 text-ink/80 hover:border-primary/40 hover:bg-white"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Ürünler — Tam genişlik 4 sütun vitrin */}
      <div>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-primary/20 py-20 text-center">
            <p className="font-serif text-xl">Bu kategoride ürün bulunamadı</p>
            <p className="mt-2 text-sm text-muted">Yakında yeni ürünler eklenecek</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} imagePriority={i < 8} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Ürün sayfaları">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={pageNumber === 1 ? `/kategori/${slug}` : `/kategori/${slug}?page=${pageNumber}`}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors ${
                      pageNumber === page
                        ? "border-primary bg-primary text-cream"
                        : "border-primary/15 bg-white/60 hover:border-primary hover:bg-primary/5"
                    }`}
                    aria-current={pageNumber === page ? "page" : undefined}
                  >
                    {pageNumber}
                  </Link>
                ))}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
