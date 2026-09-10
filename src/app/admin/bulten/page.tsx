import { prisma } from "@/lib/prisma";
import { SubscriberList } from "@/components/admin/subscriber-list";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const [subscribers, activeCount, totalCount] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.newsletterSubscriber.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Bülten Aboneleri</h1>
        <p className="text-sm text-muted">
          {activeCount} aktif · {totalCount - activeCount} pasif · toplam {totalCount}
        </p>
      </div>

      <SubscriberList subscribers={subscribers} />
    </div>
  );
}
