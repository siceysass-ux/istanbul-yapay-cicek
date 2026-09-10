import { prisma } from "@/lib/prisma";
import { ReviewActions } from "@/components/admin/review-actions";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where = status ? { status } : { status: { in: ["PENDING", "APPROVED"] } };

  const reviews = await prisma.review.findMany({
    where,
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const counts = await prisma.review.groupBy({
    by: ["status"],
    _count: true,
  });
  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c.status] = c._count;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Yorumlar</h1>
        <p className="text-sm text-muted">
          Bekleyen: {countMap.PENDING ?? 0} · Onaylı: {countMap.APPROVED ?? 0} · Reddedilen: {countMap.REJECTED ?? 0}
        </p>
      </div>

      <div className="flex gap-2">
        {[
          { value: "", label: "Hepsi" },
          { value: "PENDING", label: "Bekleyen" },
          { value: "APPROVED", label: "Onaylı" },
          { value: "REJECTED", label: "Reddedilen" },
        ].map((f) => (
          <a
            key={f.value}
            href={`/admin/yorumlar${f.value ? `?status=${f.value}` : ""}`}
            className={`rounded-full px-4 py-2 text-sm ${status === f.value || (!status && !f.value) ? "bg-primary text-cream" : "border border-primary/15 hover:bg-primary/5"}`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-primary/10 bg-white/60 p-8 text-center text-muted">
            Yorum bulunamadı.
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-primary/10 bg-white/60 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{r.product.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      r.status === "PENDING" ? "bg-accent/20 text-accent" :
                      r.status === "APPROVED" ? "bg-primary/10 text-primary" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {r.status === "PENDING" ? "Bekleyen" : r.status === "APPROVED" ? "Onaylı" : "Reddedilen"}
                    </span>
                    <span className="text-xs text-muted">★ {r.rating}</span>
                  </div>
                  {r.title && <p className="font-medium text-sm mb-1">{r.title}</p>}
                  <p className="text-sm text-ink/80">{r.body}</p>
                  <p className="text-xs text-muted mt-2">
                    {new Date(r.createdAt).toLocaleDateString("tr-TR")} · {r.userId}
                  </p>
                </div>
                <ReviewActions id={r.id} status={r.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
