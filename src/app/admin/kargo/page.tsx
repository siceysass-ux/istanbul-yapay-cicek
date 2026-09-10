import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const shippedOrders = await prisma.order.findMany({
    where: { status: "SHIPPED" },
    orderBy: { createdAt: "desc" },
  });

  const pendingShipment = await prisma.order.findMany({
    where: { status: { in: ["PAID", "PROCESSING"] } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Kargo</h1>
        <p className="text-sm text-muted">{pendingShipment.length} bekleyen · {shippedOrders.length} kargoda</p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
        <h2 className="font-serif text-lg font-semibold mb-4">Kargoya Verilmeyi Bekleyen</h2>
        {pendingShipment.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">Bekleyen sipariş yok.</p>
        ) : (
          <div className="space-y-2">
            {pendingShipment.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-primary/5 p-3">
                <div>
                  <Link href={`/admin/siparisler/${o.orderNumber}`} className="font-medium text-sm hover:text-primary">
                    {o.orderNumber}
                  </Link>
                  <p className="text-xs text-muted">{o.address}, {o.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{formatPrice(o.total)}</p>
                  <p className="text-xs text-muted">{o.cargoProvider ?? "Standart"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
        <h2 className="font-serif text-lg font-semibold mb-4">Kargoya Verilen</h2>
        {shippedOrders.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">Kargoya verilen sipariş yok.</p>
        ) : (
          <div className="space-y-2">
            {shippedOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-primary/5 p-3">
                <div>
                  <Link href={`/admin/siparisler/${o.orderNumber}`} className="font-medium text-sm hover:text-primary">
                    {o.orderNumber}
                  </Link>
                  <p className="text-xs text-muted">{o.address}, {o.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Takip: {o.cargoCode ?? "—"}</p>
                  <p className="text-xs">{o.cargoProvider ?? "Standart"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
