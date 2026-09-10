"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateQuoteStatusAction(
  id: string,
  status: string
): Promise<{ error?: string }> {
  try {
    await prisma.quoteRequest.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/kesif-talepleri");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Durum güncellenemedi." };
  }
}

export async function deleteQuoteAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.quoteRequest.delete({ where: { id } });
    revalidatePath("/admin/kesif-talepleri");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Talep silinemedi." };
  }
}
