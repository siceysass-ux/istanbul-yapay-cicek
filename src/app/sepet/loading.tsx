import { ProductGridSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Başlık */}
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-primary/10" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-primary/5" />
      </div>

      {/* Breadcrumb */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-24 animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-32 animate-pulse rounded bg-primary/5" />
      </div>

      {/* Filtre barı */}
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-primary/10" />
        ))}
      </div>

      {/* Ürün grid */}
      <ProductGridSkeleton count={12} />

      {/* Sayfalama */}
      <div className="mt-10 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-10 animate-pulse rounded-lg bg-primary/10" />
        ))}
      </div>
    </div>
  );
}
