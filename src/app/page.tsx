import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductShowcase } from "@/components/home/product-showcase";
import { ProjectsShowcase } from "@/components/home/projects-showcase";
import { Testimonials } from "@/components/home/testimonials";
import { getCategories, getProjects, getAllProducts } from "@/lib/queries";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, projects, allProducts] = await Promise.all([
    getCategories(),
    getProjects(),
    getAllProducts(),
  ]);

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} />
      <ProductShowcase products={allProducts} categories={categories} />
      <ProjectsShowcase projects={projects} />
      <Testimonials />
    </>
  );
}
