"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function createCategoryAction(formData: FormData): Promise<{ error?: string }> {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Kategori adı gerekli." };
  const slug = (formData.get("slug") as string)?.trim() || slugify(name);
  const parentId = (formData.get("parentId") as string) || null;

  try {
    await prisma.category.create({
      data: { name, slug, parentId: parentId || null },
    });
    revalidatePath("/");
    revalidatePath("/kategori/[slug]", "page");
    revalidatePath("/admin/kategoriler");
    revalidatePath("/admin/urunler");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Kategori oluşturulamadı (slug çakışması olabilir)." };
  }
}

export async function updateCategoryAction(
  id: string,
  patch: { name?: string; slug?: string; order?: number }
): Promise<{ error?: string }> {
  try {
    await prisma.category.update({
      where: { id },
      data: {
        ...(patch.name?.trim() ? { name: patch.name.trim() } : {}),
        ...(patch.slug?.trim() ? { slug: slugify(patch.slug.trim()) } : {}),
        ...(patch.order !== undefined ? { order: Number(patch.order) } : {}),
      },
    });
    revalidatePath("/");
    revalidatePath("/kategori/[slug]", "page");
    revalidatePath("/admin/kategoriler");
    revalidatePath("/admin/urunler");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Kategori güncellenemedi." };
  }
}

export async function deleteCategoryAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/kategori/[slug]", "page");
    revalidatePath("/admin/kategoriler");
    revalidatePath("/admin/urunler");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Kategori silinemedi (bu kategoriye bağlı ürünler var)." };
  }
}
