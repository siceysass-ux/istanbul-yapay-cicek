import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryList } from "@/components/admin/category-list";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Kategoriler</h1>
        <p className="text-sm text-muted">{categories.length} kategori · {products} ürün</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <CategoryForm categories={categories} />
        <CategoryList categories={categories} />
      </div>
    </div>
  );
}
