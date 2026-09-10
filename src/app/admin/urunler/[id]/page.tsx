import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!product) notFound();

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const action = updateProductAction.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/urunler" className="mb-4 flex items-center gap-1 text-sm text-muted hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Ürünlere Dön
        </Link>
        <h1 className="font-serif text-2xl font-semibold">Ürün Düzenle</h1>
        <p className="text-sm text-muted">{product.name}</p>
      </div>

      <ProductForm
        action={action}
        categories={categories}
        brands={brands}
        initial={{
          name: product.name,
          shortDesc: product.shortDesc,
          description: product.description,
          basePrice: product.basePrice,
          discountPrice: product.discountPrice,
          sku: product.sku,
          stock: product.stock,
          categoryId: product.categoryId,
          brandId: product.brandId,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          tags: product.tags,
          images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
        }}
        submitLabel="Değişiklikleri Kaydet"
      />
    </div>
  );
}
