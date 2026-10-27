import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [enabledSetting, codeSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: "exit_popup_enabled" } }),
      prisma.setting.findUnique({ where: { key: "exit_popup_coupon_code" } }),
    ]);

    const isEnabled = (enabledSetting?.value ?? "true") !== "false";
    if (!isEnabled) {
      return NextResponse.json({ enabled: false });
    }

    const targetCode = (codeSetting?.value || "SEPET5").trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: targetCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ enabled: false });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ enabled: false });
    }

    if (coupon.endsAt && new Date(coupon.endsAt) < new Date()) {
      return NextResponse.json({ enabled: false });
    }

    return NextResponse.json({
      enabled: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
    });
  } catch {
    return NextResponse.json({ enabled: false });
  }
}
