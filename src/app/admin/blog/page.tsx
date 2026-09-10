import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Blog</h1>
        <p className="text-sm text-muted">{posts.length} yazı</p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
        <p className="text-sm text-muted mb-4">
          Blog yazısı yönetimi yakında eklenecek. Mevcut yazılar:
        </p>
        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary/20 p-12 text-center">
            <p className="text-sm text-muted">Henüz blog yazısı yok.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-primary/5 p-3">
                <div>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-muted">/{p.slug}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs ${p.isPublished ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-600"}`}>
                  {p.isPublished ? "Yayında" : "Taslak"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
