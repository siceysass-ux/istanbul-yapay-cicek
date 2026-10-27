"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export interface ProductVariantInput {
  type: string;
  name: string;
  priceDelta: number;
  stock: number;
}

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
  arEnabled?: boolean;
  model3dUrl?: string | null;
  tags: string;
  images: { url: string; alt: string }[];
  variants?: ProductVariantInput[];
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
  const arEnabled = formData.get("arEnabled") === "on";
  const model3dUrlRaw = (formData.get("model3dUrl") as string)?.trim();
  const model3dUrl = model3dUrlRaw || null;
  const tags = (formData.get("tags") as string)?.trim() ?? "";
  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw ? JSON.parse(imagesRaw) : [];
  const variantsRaw = formData.get("variants") as string;
  const variants: ProductVariantInput[] = variantsRaw ? JSON.parse(variantsRaw) : [];

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
        arEnabled,
        model3dUrl,
        tags,
        images: {
          create: images.map((img: { url: string; alt: string }, i: number) => ({
            url: img.url,
            alt: img.alt || name,
            width: 720,
            height: 1200,
            order: i,
          })),
        },
        variants: {
          create: variants
            .filter((v) => v.type?.trim() && v.name?.trim())
            .map((v, i) => ({
              type: v.type.trim(),
              name: v.name.trim(),
              sku: `${sku}-V${i + 1}`,
              stock: Math.max(0, Number(v.stock ?? stock)),
              priceDelta: Number(v.priceDelta ?? 0),
            })),
        },
      },
    });
  } catch (err) {
    console.error(err);
    return { error: "Ürün oluşturulurken hata oluştu." };
  }

  revalidatePath("/");
  revalidatePath("/kategori/[slug]", "page");
  revalidatePath(`/urun/${slug}`);
  revalidatePath("/admin/urunler");
  redirect("/admin/urunler");
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
  const arEnabled = formData.get("arEnabled") === "on";
  const model3dUrlRaw = (formData.get("model3dUrl") as string)?.trim();
  const model3dUrl = model3dUrlRaw || null;
  const tags = (formData.get("tags") as string)?.trim() ?? "";
  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw ? JSON.parse(imagesRaw) : [];
  const variantsRaw = formData.get("variants") as string | null;
  const variants: ProductVariantInput[] | null = variantsRaw ? JSON.parse(variantsRaw) : null;

  if (!categoryId) return { error: "Kategori seçin." };
  if (!sku) return { error: "SKU gerekli." };

  let updatedSlug = "";
  try {
    const updated = await prisma.product.update({
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
        arEnabled,
        model3dUrl,
        tags,
      },
    });
    updatedSlug = updated.slug;

    // Görselleri yenile
    if (images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: images.map((img: { url: string; alt: string }, i: number) => ({
          productId: id,
          url: img.url,
          alt: img.alt || name,
          width: 720,
          height: 1200,
          order: i,
        })),
      });
    }

    // Varyasyonları yenile
    if (variants !== null) {
      const validVariants = variants.filter((v) => v.type?.trim() && v.name?.trim());
      await prisma.variant.deleteMany({ where: { productId: id } });
      if (validVariants.length > 0) {
        await prisma.variant.createMany({
          data: validVariants.map((v, i) => ({
            productId: id,
            type: v.type.trim(),
            name: v.name.trim(),
            sku: `${sku}-V${i + 1}`,
            stock: Math.max(0, Number(v.stock ?? stock)),
            priceDelta: Number(v.priceDelta ?? 0),
          })),
        });
      }
    }
  } catch (err) {
    console.error(err);
    return { error: "Ürün güncellenirken hata oluştu." };
  }

  revalidatePath("/");
  revalidatePath("/kategori/[slug]", "page");
  if (updatedSlug) {
    revalidatePath(`/urun/${updatedSlug}`);
  }
  revalidatePath("/admin/urunler");
  redirect("/admin/urunler");
}

export async function deleteProductAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/kategori/[slug]", "page");
    revalidatePath("/admin/urunler");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Ürün silinemedi." };
  }
}

export interface QuickUpdatePatch {
  name?: string;
  sku?: string;
  categoryId?: string;
  basePrice?: number;
  discountPrice?: number | null;
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
}

export async function quickUpdateProductAction(
  id: string,
  patch: QuickUpdatePatch
): Promise<{ ok?: boolean; error?: string }> {
  try {
    const data: Record<string, unknown> = {};
    if (typeof patch.name === "string" && patch.name.trim()) {
      data.name = patch.name.trim();
    }
    if (typeof patch.sku === "string" && patch.sku.trim()) {
      data.sku = patch.sku.trim();
    }
    if (typeof patch.categoryId === "string" && patch.categoryId) {
      data.categoryId = patch.categoryId;
    }
    if (typeof patch.basePrice === "number" && !Number.isNaN(patch.basePrice) && patch.basePrice >= 0) {
      data.basePrice = patch.basePrice;
    }
    if (patch.discountPrice !== undefined) {
      data.discountPrice =
        patch.discountPrice !== null && !Number.isNaN(Number(patch.discountPrice)) && Number(patch.discountPrice) > 0
          ? Number(patch.discountPrice)
          : null;
    }
    if (typeof patch.stock === "number" && !Number.isNaN(patch.stock)) {
      data.stock = Math.max(0, Math.round(patch.stock));
    }
    if (typeof patch.isActive === "boolean") {
      data.isActive = patch.isActive;
    }
    if (typeof patch.isFeatured === "boolean") {
      data.isFeatured = patch.isFeatured;
    }
    if (typeof patch.isNew === "boolean") {
      data.isNew = patch.isNew;
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
      select: { slug: true },
    });

    revalidatePath("/");
    revalidatePath("/kategori/[slug]", "page");
    revalidatePath(`/urun/${updated.slug}`);
    revalidatePath("/admin/urunler");
    return { ok: true };
  } catch (err) {
    console.error("Hızlı ürün güncelleme hatası:", err);
    return { error: "Güncellenemedi." };
  }
}
