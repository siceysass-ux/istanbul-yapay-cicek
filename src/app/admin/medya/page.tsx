import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const [assets, productImages, projectCovers] = await Promise.all([
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.productImage.count(),
    prisma.project.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Medya</h1>
        <p className="text-sm text-muted">
          {assets.length} medya · {productImages} ürün görseli · {projectCovers} proje görseli
        </p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
        <h2 className="font-serif text-lg font-semibold mb-2">Medya Kütüphanesi</h2>
        <p className="text-sm text-muted mb-4">
          Mevcut durumda görseller ürün ve proje formlarından URL ile eklenmektedir.
          Yüklenen görseller burada listelenir.
        </p>
        {assets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary/20 p-12 text-center">
            <p className="text-sm text-muted">Henüz medya yok.</p>
            <p className="text-xs text-muted mt-1">
              Ürün/proje formlarından görsel URL'si eklediğinizde burada görünecek.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {assets.map((a) => (
              <div key={a.id} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.url} alt={a.alt ?? ""} className="aspect-square w-full rounded-xl object-cover" />
                {a.alt && <p className="mt-1 text-xs text-muted line-clamp-1">{a.alt}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
