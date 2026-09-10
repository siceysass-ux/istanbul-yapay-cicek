"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function createProjectAction(formData: FormData): Promise<{ error?: string }> {
  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Proje başlığı gerekli." };
  const slug = (formData.get("slug") as string)?.trim() || slugify(title);
  const summary = (formData.get("summary") as string)?.trim() ?? "";
  const content = (formData.get("content") as string)?.trim() ?? "";
  const location = (formData.get("location") as string)?.trim() ?? "";
  const projectType = (formData.get("projectType") as string)?.trim() ?? "";
  const duration = (formData.get("duration") as string)?.trim() ?? "";
  const coverImage = (formData.get("coverImage") as string)?.trim() ?? "";
  const tags = (formData.get("tags") as string)?.trim() ?? "";
  const isActive = formData.get("isActive") === "on";

  if (!coverImage) return { error: "Kapak görseli URL gerekli." };

  try {
    await prisma.project.create({
      data: {
        title, slug, summary, content, location, projectType, duration,
        coverImage, gallery: "[]", tags, isActive,
      },
    });
    revalidatePath("/admin/projeler");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Proje oluşturulamadı (slug çakışması olabilir)." };
  }
}

export async function deleteProjectAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projeler");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Proje silinemedi." };
  }
}

export async function toggleProjectAction(id: string, isActive: boolean): Promise<{ error?: string }> {
  try {
    await prisma.project.update({ where: { id }, data: { isActive: !isActive } });
    revalidatePath("/admin/projeler");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Durum güncellenemedi." };
  }
}
