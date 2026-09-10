import { prisma } from "@/lib/prisma";
import type { ProductWithRelations, ProductListItem } from "@/lib/types";

export async function getCategories() {
  if (!prisma) return [];
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  if (!prisma) return null;
  return prisma.category.findUnique({
    where: { slug },
    include: { children: true, parent: true },
  });
}

export async function getProductsByCategory(categorySlug: string) {
  if (!prisma) return [];
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: { children: true },
  });
  if (!category) return [];
  const categoryIds = [category.id, ...category.children.map((c) => c.id)];
  return prisma.product.findMany({
    where: { categoryId: { in: categoryIds }, isActive: true },
    include: { brand: true, images: true, variants: true },
    orderBy: { createdAt: "desc" },
  }) as Promise<ProductWithRelations[]>;
}

export async function getFeaturedProducts(limit = 8) {
  if (!prisma) return [];
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { brand: true, images: true, variants: true },
    take: limit,
    orderBy: { rating: "desc" },
  }) as Promise<ProductWithRelations[]>;
}

export async function getNewProducts(limit = 8) {
  if (!prisma) return [];
  return prisma.product.findMany({
    where: { isNew: true, isActive: true },
    include: { brand: true, images: true, variants: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  }) as Promise<ProductWithRelations[]>;
}

export async function getProductBySlug(slug: string) {
  if (!prisma) return null;
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: { include: { parent: true } },
      brand: true,
      images: { orderBy: { order: "asc" } },
      variants: true,
      reviews: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  }) as Promise<ProductWithRelations | null>;
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  if (!prisma) return [];
  return prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    include: { brand: true, images: true, variants: true },
    take: limit,
  }) as Promise<ProductWithRelations[]>;
}

export async function getProjects() {
  if (!prisma) return [];
  return prisma.project.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getProjectBySlug(slug: string) {
  if (!prisma) return null;
  return prisma.project.findUnique({ where: { slug } });
}

export async function getAllProducts() {
  if (!prisma) return [];
  return prisma.product.findMany({
    where: { isActive: true },
    include: { brand: true, images: true, variants: true },
    orderBy: { createdAt: "desc" },
  }) as Promise<ProductWithRelations[]>;
}

export async function searchProducts(query: string) {
  if (!prisma) return [];
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query } },
        { shortDesc: { contains: query } },
        { description: { contains: query } },
      ],
    },
    include: { brand: true, images: true, variants: true },
    take: 20,
  }) as Promise<ProductWithRelations[]>;
}
