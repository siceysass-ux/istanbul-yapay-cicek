import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";

export const dynamic = "force-dynamic";

interface OrderItem {
  productId?: string;
  variantId?: string;
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-semibold">Sipariş #{order.orderNumber}</h1>
            <p className="text-sm text-muted">
              {new Date(order.createdAt).toLocaleString("tr-TR")}
            </p>
          </div>
          <OrderStatusUpdater orderNumber={order.orderNumber} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ürünler & Seçilen Varyasyonlar */}
        <div className="lg:col-span-2 rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs">
          <h2 className="font-serif text-lg font-semibold mb-4">Sipariş Edilen Ürünler ve Varyasyonlar</h2>
          <div className="space-y-3.5">
            {items.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="flex items-start justify-between gap-4 rounded-xl border border-primary/8 bg-cream-dark/30 p-3.5"
              >
                <div className="space-y-1">
                  <p className="font-medium text-ink">{item.name}</p>
                  {item.variant ? (
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent">
                      <Layers className="h-3.5 w-3.5" />
                      <span>Seçilen Varyasyon: {item.variant}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted">Standart (Varyasyonsuz)</p>
                  )}
                  <p className="text-xs text-muted font-price">
                    {item.quantity} adet × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="font-price text-base font-extrabold text-ink shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 text-sm border-t border-primary/10 pt-4">
            <div className="flex justify-between">
              <span className="text-muted">Ara toplam</span>
              <span className="font-price font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-accent">
                <span>İndirim</span>
                <span className="font-price font-semibold">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Kargo</span>
              <span className="font-price font-semibold">
                {order.shipping === 0 ? "Ücretsiz" : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-primary/10 pt-2">
              <span>Toplam</span>
              <span className="font-price text-xl font-extrabold text-ink">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Müşteri & Teslimat */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs">
            <h2 className="font-serif text-lg font-semibold mb-4">Müşteri Bilgileri</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted">E-posta:</span> {order.email ?? "-"}</div>
              <div><span className="text-muted">Telefon:</span> {order.phone ?? "-"}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs">
            <h2 className="font-serif text-lg font-semibold mb-4">Teslimat ve Fatura</h2>
            <div className="space-y-2 text-sm">
              <div className="font-medium">{order.address}</div>
              <div>{order.city} {order.postalCode}</div>
              <div className="mt-2 pt-2 border-t border-primary/10 space-y-1">
                <div><span className="text-muted">Kargo:</span> {order.cargoProvider ?? "Standart"}</div>
                <div><span className="text-muted">Ödeme Yöntemi:</span> {order.paymentMethod === "card" ? "Kredi Kartı (iyzico 3D Secure)" : "Kapıda Ödeme"}</div>
                {order.paymentRef && <div><span className="text-muted">iyzico Ödeme No:</span> {order.paymentRef}</div>}
                {order.cargoCode && <div><span className="text-muted">Kargo Takip No:</span> {order.cargoCode}</div>}
              </div>
              {order.notes && (
                <div className="mt-2 pt-2 border-t border-primary/10 text-xs leading-relaxed">
                  <span className="font-semibold text-ink block mb-0.5">Fatura / Sipariş Notu:</span>
                  <span className="text-ink/80">{order.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
