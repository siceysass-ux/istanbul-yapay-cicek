import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const [users, guests] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: true } },
        orders: {
          where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
          select: { total: true },
        },
      },
    }),
    prisma.order.groupBy({
      by: ["email"],
      where: { userId: null, email: { not: null } },
      _count: true,
      _sum: { total: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Müşteriler</h1>
        <p className="text-sm text-muted">{users.length} kayıtlı · {guests.length} misafir</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-muted text-xs">
              <th className="p-4 font-medium">Müşteri</th>
              <th className="p-4 font-medium">E-posta</th>
              <th className="p-4 font-medium">Telefon</th>
              <th className="p-4 font-medium">Sipariş</th>
              <th className="p-4 font-medium">Toplam Harcama</th>
              <th className="p-4 font-medium">Kayıt</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && guests.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted">Müşteri yok.</td></tr>
            ) : (
              users.map((u) => {
                const totalSpent = u.orders.reduce((s, o) => s + o.total, 0);
                return (
                  <tr key={u.id} className="border-b border-primary/5 hover:bg-primary/5">
                    <td className="p-4 font-medium">{u.name ?? u.email.split("@")[0]}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.phone ?? "—"}</td>
                    <td className="p-4">{u._count.orders}</td>
                    <td className="p-4 font-medium">{formatPrice(totalSpent)}</td>
                    <td className="p-4 text-muted text-xs">{new Date(u.createdAt).toLocaleDateString("tr-TR")}</td>
                  </tr>
                );
              })
            )}
            {guests.map((g) => (
              <tr key={g.email} className="border-b border-primary/5 hover:bg-primary/5 opacity-75">
                <td className="p-4 font-medium">Misafir</td>
                <td className="p-4">{g.email}</td>
                <td className="p-4">—</td>
                <td className="p-4">{g._count}</td>
                <td className="p-4 font-medium">{formatPrice(g._sum.total ?? 0)}</td>
                <td className="p-4 text-muted text-xs">Misafir</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
