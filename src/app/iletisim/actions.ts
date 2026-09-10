"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendContactMessageAdminNotification } from "@/lib/notifications";

export interface ContactResult {
  success?: boolean;
  error?: string;
}

export async function createContactMessageAction(
  formData: FormData
): Promise<ContactResult> {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim();

  // Honeypot
  const website = formData.get("website") as string;
  if (website) return { success: true };

  if (!name || !message) {
    return { error: "Ad ve mesaj zorunludur." };
  }

  if (!phone && !email) {
    return { error: "En az bir iletişim kanalı (telefon veya e-posta) gerekli." };
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "Geçerli bir e-posta adresi girin." };
    }
  }

  try {
    await prisma.contactMessage.create({
      data: { name, phone, email, message, status: "NEW" },
    });
    revalidatePath("/admin/mesajlar");

    // Admin bildirimi (async, kaydı engellemez)
    sendContactMessageAdminNotification({
      name, phone: phone ?? undefined, email: email ?? undefined, message,
    }).catch((e) => console.error("Admin e-posta:", e));

    return { success: true };
  } catch (err) {
    console.error("Mesaj kaydedilemedi:", err);
    return { error: "Mesajınız kaydedilemedi. Lütfen tekrar deneyin." };
  }
}
