import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";

export const dynamic = "force-dynamic";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber: id },
  });

  if (!order) notFound();

  let items: OrderItem[] = [];
  try {
    items = JSON.parse(order.items) as OrderItem[];
  } catch {
    items = [];
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/admin/siparisler" className="mb-4 flex items-center gap-1 text-sm text-muted hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Siparişlere Dön
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold">{order.orderNumber}</h1>
            <p className="text-sm text-muted">
              {new Date(order.createdAt).toLocaleString("tr-TR")}
            </p>
          </div>
          <OrderStatusUpdater orderNumber={order.orderNumber} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ürünler */}
        <div className="lg:col-span-2 rounded-2xl border border-primary/10 bg-white/60 p-6">
          <h2 className="font-serif text-lg font-semibold mb-4">Ürünler</h2>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={`${item.name}-${i}`} className="flex items-center justify-between border-b border-primary/5 pb-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.variant && <p className="text-xs text-muted">{item.variant}</p>}
                  <p className="text-xs text-muted">{item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted">Ara toplam</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-primary"><span>İndirim</span><span>-{formatPrice(order.discount)}</span></div>
            )}
            <div className="flex justify-between"><span className="text-muted">Kargo</span><span>{order.shipping === 0 ? "Ücretsiz" : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between text-base font-semibold border-t border-primary/10 pt-2">
              <span>Toplam</span><span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Müşteri & Teslimat */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
            <h2 className="font-serif text-lg font-semibold mb-4">Müşteri</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted">Ad:</span> {order.email?.split("@")[0] ?? "Misafir"}</div>
              <div><span className="text-muted">E-posta:</span> {order.email ?? "-"}</div>
              <div><span className="text-muted">Telefon:</span> {order.phone ?? "-"}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
            <h2 className="font-serif text-lg font-semibold mb-4">Teslimat</h2>
            <div className="space-y-2 text-sm">
              <div>{order.address}</div>
              <div>{order.city} {order.postalCode}</div>
              <div className="mt-2 pt-2 border-t border-primary/10">
                <div><span className="text-muted">Kargo:</span> {order.cargoProvider ?? "Standart"}</div>
                <div><span className="text-muted">Ödeme:</span> {order.paymentMethod === "card" ? "Kredi Kartı" : "Kapıda Ödeme"}</div>
                {order.cargoCode && <div><span className="text-muted">Takip No:</span> {order.cargoCode}</div>}
              </div>
              {order.notes && (
                <div className="mt-2 pt-2 border-t border-primary/10">
                  <span className="text-muted">Not:</span> {order.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
