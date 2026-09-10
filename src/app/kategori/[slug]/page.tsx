import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";

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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary">Anasayfa</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-primary font-medium">{category.name}</span>
      </nav>

      {/* Kategori hero */}
      <div className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-light p-8 text-cream sm:p-12">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">{category.name}</h1>
        <p className="mt-2 text-cream/70">{products.length} ürün</p>
      </div>

      {/* Alt kategoriler */}
      {category.children.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/kategori/${child.slug}`}
              className="rounded-full border border-primary/15 bg-white/60 px-4 py-2 text-sm font-medium hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      {/* Ürünler + Filtre */}
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <ProductFilters category={category} />
        <div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-primary/20 py-20 text-center">
              <p className="font-serif text-xl">Bu kategoride ürün bulunamadı</p>
              <p className="mt-2 text-sm text-muted">Yakında yeni ürünler eklenecek</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} imagePriority={i < 6} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
