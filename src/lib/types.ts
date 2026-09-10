import type { Product, Category, Brand, ProductImage, Variant, Review } from "@prisma/client";

export type ProductWithRelations = Product & {
  category: Category;
  brand: Brand | null;
  images: ProductImage[];
  variants: Variant[];
  reviews: Review[];
};

export type ProductListItem = Pick<
  ProductWithRelations,
  "id" | "slug" | "name" | "shortDesc" | "basePrice" | "discountPrice" | "stock" | "rating" | "reviewCount" | "isNew" | "isFeatured" | "arEnabled" | "categoryId"
> & {
  brand: Pick<Brand, "name"> | null;
  images: Pick<ProductImage, "id" | "url" | "alt">[];
};
