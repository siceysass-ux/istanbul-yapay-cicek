"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createCouponAction(formData: FormData): Promise<{ error?: string }> {
  const code = (formData.get("code") as string)?.trim().toUpperCase();
  if (!code) return { error: "Kupon kodu gerekli." };
  const type = (formData.get("type") as string) ?? "PERCENT";
  const value = Number(formData.get("value") ?? 0);
  const minOrder = Number(formData.get("minOrder") ?? 0);
  const maxUses = Number(formData.get("maxUses") ?? 0);

  if (value <= 0) return { error: "Değer 0'dan büyük olmalı." };

  try {
    await prisma.coupon.create({
      data: { code, type, value, minOrder, maxUses, isActive: true },
    });
    revalidatePath("/admin/kampanyalar");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Kupon oluşturulamadı (kod çakışması olabilir)." };
  }
}

export async function deleteCouponAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/kampanyalar");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Kupon silinemedi." };
  }
}

export async function toggleCouponAction(id: string, isActive: boolean): Promise<{ error?: string }> {
  try {
    await prisma.coupon.update({ where: { id }, data: { isActive: !isActive } });
    revalidatePath("/admin/kampanyalar");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Durum güncellenemedi." };
  }
}
