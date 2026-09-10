import { ProductGridSkeleton } from "@/components/shared/skeletons";

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-primary/10" />
        <div className="h-4 w-24 animate-pulse rounded bg-primary/10" />
      </div>

      {/* Başlık */}
      <div className="mb-8">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-primary/10" />
        <div className="mt-3 h-4 w-96 animate-pulse rounded bg-primary/5" />
      </div>

      {/* Filtre çipleri */}
      <div className="mb-8 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-primary/10" />
        ))}
      </div>

      {/* Ürünler */}
      <ProductGridSkeleton count={12} />

      {/* Sayfalama */}
      <div className="mt-12 flex items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-10 animate-pulse rounded-full bg-primary/10" />
        ))}
      </div>
    </div>
  );
}
