import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/urunler" className="mb-4 flex items-center gap-1 text-sm text-muted hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Ürünlere Dön
        </Link>
        <h1 className="font-serif text-2xl font-semibold">Yeni Ürün</h1>
        <p className="text-sm text-muted">Yeni bir ürün ekleyin.</p>
      </div>

      <ProductForm
        action={createProductAction}
        categories={categories}
        brands={brands}
        submitLabel="Ürünü Oluştur"
      />
    </div>
  );
}
