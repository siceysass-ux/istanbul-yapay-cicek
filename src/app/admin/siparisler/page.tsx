import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Eye } from "lucide-react";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-accent/20 text-accent",
  PAID: "bg-primary/10 text-primary",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-primary/10 text-primary",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  PAID: "Ödendi",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal",
  REFUNDED: "İade",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const where = {
    AND: [
      status ? { status } : {},
      q
        ? {
            OR: [
              { orderNumber: { contains: q } },
              { email: { contains: q } },
              { phone: { contains: q } },
            ],
          }
        : {},
    ],
  };

  const [orders, statusCounts] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap: Record<string, number> = {};
  for (const s of statusCounts) {
    countMap[s.status] = s._count;
  }

  const statuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Siparişler</h1>
        <p className="text-sm text-muted">{orders.length} sipariş</p>
      </div>

      {/* Kanban özet */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/siparisler?status=${s}`}
            className={`rounded-2xl border p-4 transition-colors hover:border-primary/30 ${
              status === s ? "border-primary bg-primary/5" : "border-primary/10 bg-white/60"
            }`}
          >
            <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[s]} mb-2`}>
              {statusLabels[s]}
            </div>
            <div className="font-serif text-2xl font-bold">{countMap[s] ?? 0}</div>
          </Link>
        ))}
      </div>

      {/* Filtre */}
      <form className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/10 bg-white/60 p-4">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Sipariş no, e-posta, telefon ara..."
          className="flex-1 min-w-[200px] rounded-full border border-primary/15 bg-white/60 px-4 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-cream hover:bg-primary-dark"
        >
          Ara
        </button>
        {(status || q) && (
          <Link
            href="/admin/siparisler"
            className="rounded-full border border-primary/15 px-4 py-2 text-sm hover:bg-primary/5"
          >
            Temizle
          </Link>
        )}
      </form>

      {/* Tablo */}
      <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-muted text-xs">
              <th className="p-4 font-medium">Sipariş No</th>
              <th className="p-4 font-medium">Müşteri</th>
              <th className="p-4 font-medium">Tutar</th>
              <th className="p-4 font-medium">Durum</th>
              <th className="p-4 font-medium">Tarih</th>
              <th className="p-4 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted">
                  Sipariş bulunamadı.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-primary/5 hover:bg-primary/5">
                  <td className="p-4 font-medium">
                    <Link href={`/admin/siparisler/${o.orderNumber}`} className="hover:text-primary">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div>{o.email ?? "Misafir"}</div>
                    <div className="text-xs text-muted">{o.phone}</div>
                  </td>
                  <td className="p-4 font-medium">{formatPrice(o.total)}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[o.status] ?? "bg-gray-200"}`}>
                      {statusLabels[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted text-xs">
                    {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/siparisler/${o.orderNumber}`}
                      className="flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                    >
                      <Eye className="h-3 w-3" /> Detay
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
