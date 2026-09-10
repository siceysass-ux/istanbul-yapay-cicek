"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export interface ProductFormInput {
  name: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  discountPrice?: number | null;
  sku: string;
  stock: number;
  categoryId: string;
  brandId?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  tags: string;
  images: { url: string; alt: string }[];
}

export async function createProductAction(formData: FormData): Promise<{ error?: string }> {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Ürün adı gerekli." };

  const slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) return { error: "Bu isimde bir ürün zaten var." };

  const shortDesc = (formData.get("shortDesc") as string)?.trim() ?? "";
  const description = (formData.get("description") as string)?.trim() ?? "";
  const basePrice = Number(formData.get("basePrice") ?? 0);
  const discountPriceRaw = formData.get("discountPrice") as string;
  const discountPrice = discountPriceRaw ? Number(discountPriceRaw) : null;
  const sku = (formData.get("sku") as string)?.trim() ?? "";
  const stock = Number(formData.get("stock") ?? 0);
  const categoryId = formData.get("categoryId") as string;
  const brandIdRaw = formData.get("brandId") as string;
  const brandId = brandIdRaw && brandIdRaw !== "none" ? brandIdRaw : null;
  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isNew = formData.get("isNew") === "on";
  const tags = (formData.get("tags") as string)?.trim() ?? "";
  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw ? JSON.parse(imagesRaw) : [];

  if (!categoryId) return { error: "Kategori seçin." };
  if (!sku) return { error: "SKU gerekli." };

  try {
    await prisma.product.create({
      data: {
        slug,
        name,
        shortDesc,
        description,
        basePrice,
        discountPrice,
        sku,
        stock,
        categoryId,
        brandId,
        isActive,
        isFeatured,
        isNew,
        tags,
        images: {
          create: images.map((img: { url: string; alt: string }, i: number) => ({
            url: img.url,
            alt: img.alt || name,
            width: 800,
            height: 800,
            order: i,
          })),
        },
      },
    });
    revalidatePath("/admin/urunler");
    redirect("/admin/urunler");
  } catch (err) {
    console.error(err);
    return { error: "Ürün oluşturulurken hata oluştu." };
  }
}

export async function updateProductAction(id: string, formData: FormData): Promise<{ error?: string }> {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Ürün adı gerekli." };

  const shortDesc = (formData.get("shortDesc") as string)?.trim() ?? "";
  const description = (formData.get("description") as string)?.trim() ?? "";
  const basePrice = Number(formData.get("basePrice") ?? 0);
  const discountPriceRaw = formData.get("discountPrice") as string;
  const discountPrice = discountPriceRaw ? Number(discountPriceRaw) : null;
  const sku = (formData.get("sku") as string)?.trim() ?? "";
  const stock = Number(formData.get("stock") ?? 0);
  const categoryId = formData.get("categoryId") as string;
  const brandIdRaw = formData.get("brandId") as string;
  const brandId = brandIdRaw && brandIdRaw !== "none" ? brandIdRaw : null;
  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isNew = formData.get("isNew") === "on";
  const tags = (formData.get("tags") as string)?.trim() ?? "";
  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw ? JSON.parse(imagesRaw) : [];

  if (!categoryId) return { error: "Kategori seçin." };
  if (!sku) return { error: "SKU gerekli." };

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        shortDesc,
        description,
        basePrice,
        discountPrice,
        sku,
        stock,
        categoryId,
        brandId,
        isActive,
        isFeatured,
        isNew,
        tags,
      },
    });

    // Görselleri yenile
    if (images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: images.map((img: { url: string; alt: string }, i: number) => ({
          productId: id,
          url: img.url,
          alt: img.alt || name,
          width: 800,
          height: 800,
          order: i,
        })),
      });
    }

    revalidatePath("/admin/urunler");
    redirect("/admin/urunler");
  } catch (err) {
    console.error(err);
    return { error: "Ürün güncellenirken hata oluştu." };
  }
}

export async function deleteProductAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/urunler");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Ürün silinemedi." };
  }
}
