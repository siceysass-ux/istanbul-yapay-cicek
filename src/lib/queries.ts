import { prisma } from "@/lib/prisma";
import type { ProductWithRelations, ProductListItem } from "@/lib/types";

const productListSelect = {
  id: true,
  slug: true,
  name: true,
  shortDesc: true,
  basePrice: true,
  discountPrice: true,
  stock: true,
  rating: true,
  reviewCount: true,
  isNew: true,
  isFeatured: true,
  arEnabled: true,
  categoryId: true,
  brand: { select: { name: true } },
  images: { orderBy: { order: "asc" as const }, take: 1, select: { id: true, url: true, alt: true } },
};

export async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { children: true, parent: true },
  });
}

export async function getProductsByCategory(categoryIds: string[], page = 1, pageSize = 12) {
  const where = { categoryId: { in: categoryIds }, isActive: true };
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productListSelect,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }) as Promise<ProductListItem[]>,
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    select: productListSelect,
    take: limit,
    orderBy: { rating: "desc" },
  }) as Promise<ProductListItem[]>;
}

export async function getNewProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isNew: true, isActive: true },
    select: productListSelect,
    take: limit,
    orderBy: { createdAt: "desc" },
  }) as Promise<ProductListItem[]>;
}

export async function getProductBySlug(slug: string) {
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
  return prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    select: productListSelect,
    take: limit,
  }) as Promise<ProductListItem[]>;
}

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    select: productListSelect,
    orderBy: { createdAt: "desc" },
  }) as Promise<ProductListItem[]>;
}

export async function searchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query } },
        { shortDesc: { contains: query } },
        { description: { contains: query } },
      ],
    },
    select: productListSelect,
    take: 20,
  }) as Promise<ProductListItem[]>;
}
