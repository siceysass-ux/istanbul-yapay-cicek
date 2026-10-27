"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function updateSettingsAction(
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  const keys = ["site_name", "phone", "email", "address", "whatsapp"];

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

    const newPassword = (formData.get("new_admin_password") as string)?.trim() ?? "";
    if (newPassword) {
      if (newPassword.length < 6) {
        return { error: "Yeni yönetici şifresi en az 6 karakter olmalıdır." };
      }
      const passwordHash = await hashPassword(newPassword);
      await prisma.user.updateMany({
        where: { role: "ADMIN" },
        data: { passwordHash },
      });
    }

    revalidatePath("/admin/ayarlar");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { error: "Ayarlar güncellenemedi." };
  }
}
