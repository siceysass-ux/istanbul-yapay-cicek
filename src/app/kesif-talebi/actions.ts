"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendQuoteRequestEmail, sendQuoteRequestSms, sendQuoteRequestAdminNotification } from "@/lib/notifications";

export interface QuoteResult {
  success?: boolean;
  error?: string;
}

export async function createQuoteRequestAction(
  formData: FormData
): Promise<QuoteResult> {
  const name = (formData.get("name") as string)?.trim();
  const company = (formData.get("company") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const placeType = (formData.get("placeType") as string)?.trim() || null;
  const area = (formData.get("area") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  // Basit honeypot — spam botlar genelde bu alanı doldurur
  const website = formData.get("website") as string;
  if (website) return { success: true }; // bot ise sessizce yut

  if (!name || !phone || !email) {
    return { error: "Ad, telefon ve e-posta zorunludur." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Geçerli bir e-posta adresi girin." };
  }

  const phoneClean = phone.replace(/\D/g, "");
  if (phoneClean.length < 10) {
    return { error: "Geçerli bir telefon numarası girin." };
  }

  try {
    await prisma.quoteRequest.create({
      data: {
        name,
        company,
        phone,
        email,
        placeType,
        area,
        description,
        status: "NEW",
      },
    });
    revalidatePath("/admin/kesif-talepleri");

    // Bildirimler (async, kaydı engellemez)
    sendQuoteRequestEmail(email, name).catch((e: unknown) => console.error("E-posta:", e));
    sendQuoteRequestSms(phone, name).catch((e: unknown) => console.error("SMS:", e));
    sendQuoteRequestAdminNotification({
      name, phone, email, placeType: placeType ?? undefined, area: area ?? undefined, description: description ?? undefined,
    }).catch((e: unknown) => console.error("Admin e-posta:", e));

    return { success: true };
  } catch (err) {
    console.error("Keşif talebi kaydedilemedi:", err);
    return { error: "Talebiniz kaydedilemedi. Lütfen tekrar deneyin." };
  }
}
