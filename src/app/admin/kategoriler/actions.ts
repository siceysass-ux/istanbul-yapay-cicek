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
    revalidatePath("/admin/kategoriler");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Kategori oluşturulamadı (slug çakışması olabilir)." };
  }
}

export async function deleteCategoryAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/kategoriler");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Kategori silinemedi (ürün bağlı olabilir)." };
  }
}
