"use server";

import { prisma } from "@/lib/prisma";

export interface CouponResult {
  valid: boolean;
  error?: string;
  discount?: number;
  type?: string;
  value?: number;
}

export async function validateCouponAction(
  code: string,
  subtotal: number
): Promise<CouponResult> {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: "Kupon kodu girin." };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return { valid: false, error: "Geçersiz kupon kodu." };
  }

  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: "Bu kupon kullanım sınırına ulaştı." };
  }

  if (coupon.endsAt && new Date(coupon.endsAt) < new Date()) {
    return { valid: false, error: "Bu kuponun süresi dolmuş." };
  }

  if (coupon.startsAt && new Date(coupon.startsAt) > new Date()) {
    return { valid: false, error: "Bu kupon henüz başlamamış." };
  }

  if (subtotal < coupon.minOrder) {
    return {
      valid: false,
      error: `Bu kupon en az ${coupon.minOrder}₺ alışveriş için geçerlidir.`,
    };
  }

  const discount =
    coupon.type === "PERCENT"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  return {
    valid: true,
    discount,
    type: coupon.type,
    value: coupon.value,
  };
}
