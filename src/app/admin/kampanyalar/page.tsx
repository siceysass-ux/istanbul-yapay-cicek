import { prisma } from "@/lib/prisma";
import { CouponForm } from "@/components/admin/coupon-form";
import { CouponList } from "@/components/admin/coupon-list";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Kampanyalar</h1>
        <p className="text-sm text-muted">{coupons.length} kupon</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <CouponForm />
        <CouponList coupons={coupons} />
      </div>
    </div>
  );
}
