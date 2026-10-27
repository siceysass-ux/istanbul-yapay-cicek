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
    return { error: "Kupon oluşturulamadı (bu kod zaten mevcut olabilir)." };
  }
}

export async function updateCouponAction(
  id: string,
  patch: { value?: number; minOrder?: number; maxUses?: number; type?: string }
): Promise<{ error?: string }> {
  try {
    await prisma.coupon.update({
      where: { id },
      data: {
        ...(patch.value !== undefined ? { value: Number(patch.value) } : {}),
        ...(patch.minOrder !== undefined ? { minOrder: Number(patch.minOrder) } : {}),
        ...(patch.maxUses !== undefined ? { maxUses: Number(patch.maxUses) } : {}),
        ...(patch.type !== undefined ? { type: patch.type } : {}),
      },
    });
    revalidatePath("/admin/kampanyalar");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Kupon güncellenemedi." };
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

export async function updateExitPopupSettingsAction(params: {
  enabled: boolean;
  couponCode: string;
}): Promise<{ error?: string }> {
  try {
    await Promise.all([
      prisma.setting.upsert({
        where: { key: "exit_popup_enabled" },
        update: { value: params.enabled ? "true" : "false" },
        create: { key: "exit_popup_enabled", value: params.enabled ? "true" : "false" },
      }),
      prisma.setting.upsert({
        where: { key: "exit_popup_coupon_code" },
        update: { value: params.couponCode.trim().toUpperCase() },
        create: { key: "exit_popup_coupon_code", value: params.couponCode.trim().toUpperCase() },
      }),
    ]);
    revalidatePath("/admin/kampanyalar");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Ayarlar kaydedilemedi." };
  }
}
