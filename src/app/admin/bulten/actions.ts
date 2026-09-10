"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function deleteSubscriberAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
    revalidatePath("/admin/bulten");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Abone silinemedi." };
  }
}

export async function toggleSubscriberAction(id: string, isActive: boolean): Promise<{ error?: string }> {
  try {
    await prisma.newsletterSubscriber.update({
      where: { id },
      data: { isActive: !isActive },
    });
    revalidatePath("/admin/bulten");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Durum güncellenemedi." };
  }
}
