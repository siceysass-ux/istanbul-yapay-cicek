import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductShowcase } from "@/components/home/product-showcase";
import { getCategories, getAllProducts } from "@/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} />
      <ProductShowcase products={allProducts} categories={categories} />
    </>
  );
}
