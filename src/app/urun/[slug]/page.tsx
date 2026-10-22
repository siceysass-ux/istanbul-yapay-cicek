import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductCard } from "@/components/product/product-card";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  // P1-3: Olmayan üründe generateMetadata içinde de notFound() çağrılarak gerçek HTTP 404 döndürülür
  if (!product) {
    notFound();
  }
  const canonicalUrl = `${SITE_URL}/urun/${product.slug}`;
  const imgUrl = product.images[0]?.url
    ? product.images[0].url.startsWith("http")
      ? product.images[0].url
      : `${SITE_URL}${product.images[0].url}`
    : `${SITE_URL}/og-image.jpg`;

  return {
    title: product.name,
    description: product.shortDesc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${product.name} — Çiçek Yapay`,
      description: product.shortDesc,
      type: "website",
      url: canonicalUrl,
      images: [{ url: imgUrl, width: 720, height: 1200, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Çiçek Yapay`,
      description: product.shortDesc,
      images: [imgUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <ProductJsonLd
        product={{
          name: product.name,
          slug: product.slug,
          description: product.shortDesc,
          price: product.basePrice,
          discountPrice: product.discountPrice,
          image: product.images[0]?.url ?? "",
          sku: product.sku,
          rating: product.rating,
          reviewCount: product.reviewCount,
          inStock: product.stock > 0,
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Anasayfa", url: SITE_URL },
          { name: product.category.name, url: `${SITE_URL}/kategori/${product.category.slug}` },
          { name: product.name, url: `${SITE_URL}/urun/${product.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted mb-6 overflow-x-auto">
        <Link href="/" className="hover:text-accent shrink-0">Anasayfa</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <Link href={`/kategori/${product.category.slug}`} className="hover:text-accent shrink-0">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <span className="text-ink font-medium truncate">{product.name}</span>
      </nav>

      {/* Ürün detay */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images}
          productName={product.name}
          model3dUrl={product.model3dUrl}
        />
        <ProductDetail product={product} />
      </div>

      {/* İlgili ürünler */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-semibold mb-6">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
