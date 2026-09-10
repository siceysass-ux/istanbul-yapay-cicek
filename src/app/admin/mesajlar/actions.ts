"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateMessageStatusAction(
  id: string,
  status: string
): Promise<{ error?: string }> {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/mesajlar");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Durum güncellenemedi." };
  }
}

export async function deleteMessageAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/mesajlar");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Mesaj silinemedi." };
  }
}
