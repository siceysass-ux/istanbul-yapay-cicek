import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Truck, MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

export default async function OrderConfirmationPage({
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
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      {/* Başarı */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-serif text-3xl font-semibold">Siparişiniz Alındı!</h1>
        <p className="mt-2 text-muted">
          Sipariş numaranız: <span className="font-medium text-primary">{order.orderNumber}</span>
        </p>
        <p className="mt-1 text-sm text-muted">
          Onay e-postası {order.email} adresine gönderilecektir.
        </p>
      </div>

      {/* Sipariş detayı */}
      <div className="rounded-3xl border border-primary/10 bg-white/60 p-6 sm:p-8">
        <h2 className="font-serif text-xl font-semibold mb-4">Sipariş Detayı</h2>

        {/* Ürünler */}
        <div className="space-y-3 mb-6">
          {items.map((item, i) => (
            <div key={`${item.name}-${i}`} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                {item.variant && <p className="text-xs text-muted">{item.variant}</p>}
                <p className="text-xs text-muted">{item.quantity} adet × {formatPrice(item.price)}</p>
              </div>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Özet */}
        <div className="border-t border-primary/10 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Ara toplam</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-primary">
              <span>İndirim</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">Kargo</span>
            <span>{order.shipping === 0 ? "Ücretsiz" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-primary/10 pt-2">
            <span>Toplam</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Teslimat */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" /> Teslimat Adresi
            </div>
            <p className="text-sm text-ink/80">{order.address}</p>
            <p className="text-sm text-ink/80">{order.city} {order.postalCode}</p>
            <p className="text-sm text-muted mt-1">{order.phone}</p>
          </div>
          <div className="rounded-2xl bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Truck className="h-4 w-4 text-primary" /> Kargo & Ödeme
            </div>
            <p className="text-sm text-ink/80">{order.cargoProvider ?? "Standart Kargo"}</p>
            <p className="text-sm text-ink/80">
              {order.paymentMethod === "card" ? "Kredi Kartı" : "Kapıda Ödeme"}
            </p>
            <p className="text-sm text-muted mt-1">
              Durum: {order.status === "PAID" ? "Ödendi" : "Beklemede"}
            </p>
          </div>
        </div>
      </div>

      {/* Sonraki adımlar */}
      <div className="mt-8 rounded-3xl border border-primary/10 bg-primary/5 p-6">
        <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" /> Sıradaki Adımlar
        </h3>
        <ol className="space-y-2 text-sm text-ink/80">
          <li>1. Siparişiniz hazırlanmaya başlanacak.</li>
          <li>2. Kargoya verildiğinde takip numarası e-posta ile iletilecek.</li>
          <li>3. Tahmini teslimat: 1-3 iş günü.</li>
        </ol>
      </div>

      {/* Aksiyonlar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/kategori/yapay-cicek">
            Alışverişe Devam Et <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Anasayfa</Link>
        </Button>
      </div>
    </div>
  );
}
