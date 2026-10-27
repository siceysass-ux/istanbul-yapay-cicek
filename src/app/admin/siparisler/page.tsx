import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Eye } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderItemSummary {
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-accent/20 text-accent",
  PAID: "bg-emerald-500/15 text-emerald-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-emerald-500/15 text-emerald-700",
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
            className={`rounded-2xl border p-4 transition-colors hover:border-accent/40 ${
              status === s ? "border-accent bg-accent/5" : "border-primary/10 bg-white"
            }`}
          >
            <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[s]} mb-2`}>
              {statusLabels[s]}
            </div>
            <div className="font-price text-2xl font-bold">{countMap[s] ?? 0}</div>
          </Link>
        ))}
      </div>

      {/* Filtre */}
      <form className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/10 bg-white p-4">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Sipariş no, e-posta, telefon ara..."
          className="flex-1 min-w-[200px] rounded-full border border-primary/15 bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-[#1e2426] px-5 py-2 text-sm font-medium text-white hover:bg-accent"
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
      <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-2xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 bg-cream-dark/40 text-left text-muted text-xs">
              <th className="p-4 font-semibold">Sipariş No</th>
              <th className="p-4 font-semibold">Müşteri</th>
              <th className="p-4 font-semibold">Sipariş Edilen Ürünler ve Varyasyonlar</th>
              <th className="p-4 font-semibold">Tutar</th>
              <th className="p-4 font-semibold">Durum</th>
              <th className="p-4 font-semibold">Tarih</th>
              <th className="p-4 font-semibold">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted">
                  Sipariş bulunamadı.
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                let parsedItems: OrderItemSummary[] = [];
                try {
                  parsedItems = JSON.parse(o.items) as OrderItemSummary[];
                } catch {
                  parsedItems = [];
                }
                return (
                  <tr key={o.id} className="border-b border-primary/5 hover:bg-primary/[0.03]">
                    <td className="p-4 font-semibold">
                      <Link href={`/admin/siparisler/${o.orderNumber}`} className="text-ink hover:text-accent">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{o.email ?? "Misafir"}</div>
                      <div className="text-xs text-muted">{o.phone}</div>
                      <div className="text-[11px] text-muted">{o.city}</div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1.5 max-w-sm">
                        {parsedItems.map((it, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="font-medium text-ink">
                              {it.quantity}× {it.name}
                            </span>
                            {it.variant && (
                              <span className="ml-1.5 inline-block rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent">
                                {it.variant}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-price font-extrabold text-ink">{formatPrice(o.total)}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[o.status] ?? "bg-gray-200"}`}>
                        {statusLabels[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted text-xs">
                      {new Date(o.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/siparisler/${o.orderNumber}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary/15 px-3 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detay
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
