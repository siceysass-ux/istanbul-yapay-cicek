/**
 * Tüm site için paylaşılan skeleton (yükleniyor) component'leri
 */

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/60 p-3">
      <div className="aspect-square animate-pulse rounded-xl bg-primary/10" />
      <div className="mt-3 h-3 w-1/4 animate-pulse rounded bg-primary/10" />
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-primary/10" />
      <div className="mt-2 flex items-center justify-between">
        <div className="h-4 w-1/3 animate-pulse rounded bg-primary/5" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-primary/5" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-5 sm:gap-6 lg:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <div className="h-20 w-20 animate-pulse rounded-full bg-primary/10 sm:h-24 sm:w-24" />
          <div className="h-3 w-16 animate-pulse rounded bg-primary/10" />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative flex min-h-[90vh] items-center justify-center bg-ink">
      <div className="absolute inset-0 animate-pulse bg-primary/10" />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="h-6 w-48 animate-pulse rounded bg-cream/10" />
        <div className="h-12 w-80 animate-pulse rounded-lg bg-cream/10" />
        <div className="h-12 w-72 animate-pulse rounded-lg bg-cream/10" />
        <div className="h-6 w-64 animate-pulse rounded bg-cream/10" />
        <div className="mt-4 flex gap-3">
          <div className="h-12 w-40 animate-pulse rounded-full bg-cream/10" />
          <div className="h-12 w-32 animate-pulse rounded-full bg-cream/10" />
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl">
          <div className="aspect-[4/3] animate-pulse bg-primary/10" />
        </div>
      ))}
    </div>
  );
}

export function TestimonialsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-primary/10 bg-white/60 p-8">
          <div className="mb-4 h-4 w-24 animate-pulse rounded bg-primary/10" />
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-primary/5" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-primary/5" />
            <div className="h-3 w-4/6 animate-pulse rounded bg-primary/5" />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-full bg-primary/10" />
            <div className="space-y-1.5">
              <div className="h-3 w-24 animate-pulse rounded bg-primary/10" />
              <div className="h-2 w-16 animate-pulse rounded bg-primary/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 h-8 w-64 animate-pulse rounded-lg bg-primary/10" />
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-primary/5" />
      </div>
    </div>
  );
}
