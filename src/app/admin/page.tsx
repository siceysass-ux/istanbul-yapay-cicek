import Link from "next/link";
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, customerCount, products, orders, revenueAgg] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { images: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.total ?? 0;

  // Son 30 gün karşılaştırması
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const [recentOrdersCount, prevOrdersCount, recentRevenue, prevRevenue] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.count({
      where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
      },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
      },
    }),
  ]);

  const revenueChange =
    prevRevenue._sum.total && prevRevenue._sum.total > 0
      ? (((recentRevenue._sum.total ?? 0) - prevRevenue._sum.total) / prevRevenue._sum.total) * 100
      : 0;
  const orderChange =
    prevOrdersCount > 0
      ? ((recentOrdersCount - prevOrdersCount) / prevOrdersCount) * 100
      : 0;

  const stats = [
    {
      label: "Toplam Ciro",
      value: formatPrice(totalRevenue),
      change: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`,
      up: revenueChange >= 0,
      icon: DollarSign,
    },
    {
      label: "Sipariş",
      value: String(orderCount),
      change: `${orderChange >= 0 ? "+" : ""}${orderChange.toFixed(1)}%`,
      up: orderChange >= 0,
      icon: ShoppingCart,
    },
    {
      label: "Ürün",
      value: String(productCount),
      change: "Aktif",
      up: true,
      icon: Package,
    },
    {
      label: "Müşteri",
      value: String(customerCount),
      change: "Kayıtlı",
      up: true,
      icon: Users,
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-accent/20 text-accent",
    PAID: "bg-primary/10 text-primary",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-primary/10 text-primary",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Beklemede",
    PAID: "Ödendi",
    PROCESSING: "Hazırlanıyor",
    SHIPPED: "Kargoda",
    DELIVERED: "Teslim Edildi",
    CANCELLED: "İptal",
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted">Hoş geldiniz, işte güncel durum</p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-cream hover:bg-primary-dark transition-colors"
        >
          + Yeni Ürün
        </Link>
      </div>

      {/* KPI kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-primary/10 bg-white/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.up ? "text-primary" : "text-red-500"
                }`}
              >
                {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </span>
            </div>
            <div className="font-serif text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Son siparişler */}
        <div className="lg:col-span-2 rounded-2xl border border-primary/10 bg-white/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold">Son Siparişler</h2>
            <Link
              href="/admin/siparisler"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Tümü <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Henüz sipariş yok.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary/10 text-left text-muted text-xs">
                    <th className="pb-3 font-medium">Sipariş No</th>
                    <th className="pb-3 font-medium">Müşteri</th>
                    <th className="pb-3 font-medium">Tutar</th>
                    <th className="pb-3 font-medium">Durum</th>
                    <th className="pb-3 font-medium">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-primary/5">
                      <td className="py-3 font-medium">
                        <Link href={`/admin/siparisler/${order.orderNumber}`} className="hover:text-primary">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3">{order.email ?? "Misafir"}</td>
                      <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusColors[order.status] ?? "bg-gray-200"
                          }`}
                        >
                          {statusLabels[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted text-xs">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Son ürünler */}
        <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold">Son Ürünler</h2>
            <Link
              href="/admin/urunler"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Tümü <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/admin/urunler/${p.id}`}
                className="flex items-center gap-3 rounded-xl hover:bg-primary/5 p-2 transition-colors"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-primary/5">
                  {p.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                  <p className="text-xs text-muted">{formatPrice(p.basePrice)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hızlı aksiyon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Yeni Ürün", href: "/admin/urunler/yeni", icon: Package },
          { label: "Siparişler", href: "/admin/siparisler", icon: ShoppingCart },
          { label: "Kampanyalar", href: "/admin/kampanyalar", icon: TrendingUp },
          { label: "Ayarlar", href: "/admin/ayarlar", icon: Users },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white/60 p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
