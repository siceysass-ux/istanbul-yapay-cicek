"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface NewsletterResult {
  success?: boolean;
  error?: string;
}

export async function subscribeNewsletterAction(
  formData: FormData
): Promise<NewsletterResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email) {
    return { error: "E-posta adresi gerekli." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Geçerli bir e-posta adresi girin." };
  }

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return { error: "Bu e-posta zaten abone." };
      }
      // Re-activate
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true },
      });
      return { success: true };
    }

    await prisma.newsletterSubscriber.create({
      data: { email, isActive: true },
    });
    revalidatePath("/admin/bulten");
    return { success: true };
  } catch (err) {
    console.error("Bülten kaydı hatası:", err);
    return { error: "Kayıt yapılamadı. Lütfen tekrar deneyin." };
  }
}
