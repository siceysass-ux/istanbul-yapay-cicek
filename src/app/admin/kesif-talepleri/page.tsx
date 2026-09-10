import { prisma } from "@/lib/prisma";
import { QuoteList } from "@/components/admin/quote-list";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where = status ? { status } : {};

  const [quotes, counts] = await Promise.all([
    prisma.quoteRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.quoteRequest.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c.status] = c._count;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Keşif Talepleri</h1>
        <p className="text-sm text-muted">
          Yeni: {countMap.NEW ?? 0} · İletişim: {countMap.CONTACTED ?? 0} · Teklif: {countMap.QUOTED ?? 0} · Kazanıldı: {countMap.WON ?? 0} · Kayıp: {countMap.LOST ?? 0}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: "Hepsi" },
          { value: "NEW", label: "Yeni" },
          { value: "CONTACTED", label: "İletişim" },
          { value: "QUOTED", label: "Teklif" },
          { value: "WON", label: "Kazanıldı" },
          { value: "LOST", label: "Kayıp" },
        ].map((f) => (
          <a
            key={f.value}
            href={`/admin/kesif-talepleri${f.value ? `?status=${f.value}` : ""}`}
            className={`rounded-full px-4 py-2 text-sm ${status === f.value || (!status && !f.value) ? "bg-primary text-cream" : "border border-primary/15 hover:bg-primary/5"}`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <QuoteList quotes={quotes} />
    </div>
  );
}
