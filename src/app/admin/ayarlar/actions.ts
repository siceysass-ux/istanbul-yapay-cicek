"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword, requireAdmin } from "@/lib/auth";

export async function updateSettingsAction(
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Yetkisiz işlem." };
  }

  const keys = [
    "site_name",
    "phone",
    "email",
    "address",
    "whatsapp",
    "google_ads_id",
    "google_ads_purchase_label",
    "google_ads_whatsapp_label",
    "ga4_id",
    "meta_pixel_id",
    "social_proof_enabled",
  ];

  try {
    for (const key of keys) {
      const raw = formData.get(key);
      if (raw !== null) {
        const value = String(raw).trim();
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
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { error: "Ayarlar güncellenemedi." };
  }
}
