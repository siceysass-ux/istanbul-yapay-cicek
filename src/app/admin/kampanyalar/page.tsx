import { prisma } from "@/lib/prisma";
import { CouponForm } from "@/components/admin/coupon-form";
import { CouponList } from "@/components/admin/coupon-list";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const [coupons, enabledSetting, codeSetting] = await Promise.all([
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.setting.findUnique({ where: { key: "exit_popup_enabled" } }),
    prisma.setting.findUnique({ where: { key: "exit_popup_coupon_code" } }),
  ]);

  const initialExitEnabled = (enabledSetting?.value ?? "true") !== "false";
  const initialExitCouponCode = codeSetting?.value || "SEPET5";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Kampanyalar ve Kupon Yönetimi</h1>
        <p className="text-sm text-muted">
          İndirim kuponlarını ve sepet terk etme (exit-intent) indirim penceresini buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <CouponForm />
        <CouponList
          coupons={coupons}
          initialExitEnabled={initialExitEnabled}
          initialExitCouponCode={initialExitCouponCode}
        />
      </div>
    </div>
  );
}
