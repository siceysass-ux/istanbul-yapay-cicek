import { HeroSkeleton, CategorySkeleton, ProductGridSkeleton, ProjectsSkeleton, TestimonialsSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSkeleton />

      {/* TrustBar */}
      <div className="border-y border-primary/10 bg-cream-dark/30 py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="h-11 w-11 animate-pulse rounded-full bg-primary/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-primary/10" />
                <div className="h-2 w-20 animate-pulse rounded bg-primary/5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kategoriler */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-primary/10" />
          <div className="mx-auto mt-2 h-4 w-64 animate-pulse rounded bg-primary/5" />
        </div>
        <CategorySkeleton />
      </div>

      {/* Ürünler */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-primary/10" />
          <div className="mx-auto mt-2 h-4 w-64 animate-pulse rounded bg-primary/5" />
        </div>
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-primary/10" />
          ))}
        </div>
        <ProductGridSkeleton count={12} />
      </div>

      {/* Projeler */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-primary/10" />
        </div>
        <ProjectsSkeleton />
      </div>

      {/* Yorumlar */}
      <div className="bg-cream-dark/40 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-primary/10" />
          </div>
          <TestimonialsSkeleton />
        </div>
      </div>
    </div>
  );
}
