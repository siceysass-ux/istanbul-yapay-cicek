import { prisma } from "@/lib/prisma";
import { MessageList } from "@/components/admin/message-list";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where = status ? { status } : { status: { in: ["NEW", "READ"] } };

  const [messages, counts] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c.status] = c._count;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Mesajlar</h1>
        <p className="text-sm text-muted">
          Yeni: {countMap.NEW ?? 0} · Okundu: {countMap.READ ?? 0} · Yanıtlandı: {countMap.REPLIED ?? 0}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: "Aktif" },
          { value: "NEW", label: "Yeni" },
          { value: "READ", label: "Okundu" },
          { value: "REPLIED", label: "Yanıtlandı" },
          { value: "ARCHIVED", label: "Arşiv" },
        ].map((f) => (
          <a
            key={f.value}
            href={`/admin/mesajlar${f.value ? `?status=${f.value}` : ""}`}
            className={`rounded-full px-4 py-2 text-sm ${status === f.value || (!status && !f.value) ? "bg-primary text-cream" : "border border-primary/15 hover:bg-primary/5"}`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <MessageList messages={messages} />
    </div>
  );
}
