"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateSettingsAction(formData: FormData): Promise<{ error?: string }> {
  const keys = [
    "site_name", "phone", "email", "address", "whatsapp",
    "free_shipping_threshold", "shipping_cost",
  ];

  try {
    for (const key of keys) {
      const value = (formData.get(key) as string)?.trim() ?? "";
      if (value) {
        await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }
    revalidatePath("/admin/ayarlar");
    revalidatePath("/");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Ayarlar güncellenemedi." };
  }
}
