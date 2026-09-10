import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const [
    totalRevenue,
    orderCount,
    productCount,
    customerCount,
    lowStockProducts,
    topProductsRaw,
    recentOrders,
    statusBreakdown,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      include: { category: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),
    prisma.order.findMany({
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      select: { items: true, total: true },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
      _sum: { total: true },
    }),
  ]);

  // En çok satan ürünler
  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
  for (const order of topProductsRaw) {
    try {
      const items = JSON.parse(order.items) as { name: string; price: number; quantity: number }[];
      for (const item of items) {
        if (!productSales[item.name]) {
          productSales[item.name] = { name: item.name, qty: 0, revenue: 0 };
        }
        productSales[item.name].qty += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      }
    } catch {}
  }
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Raporlar</h1>
        <p className="text-sm text-muted">Genel performans özeti</p>
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-primary/10 bg-white/60 p-5">
          <div className="text-sm text-muted">Toplam Ciro</div>
          <div className="font-serif text-2xl font-bold text-primary">{formatPrice(totalRevenue._sum.total ?? 0)}</div>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-white/60 p-5">
          <div className="text-sm text-muted">Sipariş</div>
          <div className="font-serif text-2xl font-bold">{orderCount}</div>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-white/60 p-5">
          <div className="text-sm text-muted">Ürün</div>
          <div className="font-serif text-2xl font-bold">{productCount}</div>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-white/60 p-5">
          <div className="text-sm text-muted">Müşteri</div>
          <div className="font-serif text-2xl font-bold">{customerCount}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* En çok satan */}
        <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
          <h2 className="font-serif text-lg font-semibold mb-4">En Çok Satanlar</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">Veri yok.</p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                    {p.name}
                  </span>
                  <span className="text-muted">{p.qty} adet · {formatPrice(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stok az olan */}
        <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
          <h2 className="font-serif text-lg font-semibold mb-4">Düşük Stok (≤5)</h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">Tüm ürünlerde yeterli stok var.</p>
          ) : (
            <div className="space-y-2">
              {lowStockProducts.map((p) => (
                <Link key={p.id} href={`/admin/urunler/${p.id}`} className="flex items-center justify-between text-sm hover:bg-primary/5 rounded-lg p-2">
                  <span>{p.name}</span>
                  <span className={p.stock === 0 ? "text-red-500 font-medium" : "text-accent"}>{p.stock} adet</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sipariş durumu dağılımı */}
      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
        <h2 className="font-serif text-lg font-semibold mb-4">Sipariş Durumu Dağılımı</h2>
        <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {statusBreakdown.map((s) => (
            <div key={s.status} className="rounded-xl border border-primary/5 p-3 text-center">
              <div className="text-xs text-muted">{s.status}</div>
              <div className="font-serif text-xl font-bold">{s._count}</div>
              <div className="text-xs text-muted">{formatPrice(s._sum.total ?? 0)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
