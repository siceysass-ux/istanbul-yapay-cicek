export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-primary/10" />
        <div className="h-4 w-24 animate-pulse rounded bg-primary/10" />
        <div className="h-4 w-32 animate-pulse rounded bg-primary/10" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Görsel */}
        <div className="space-y-4">
          <div className="aspect-square animate-pulse rounded-3xl bg-primary/10" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 animate-pulse rounded-xl bg-primary/10" />
            ))}
          </div>
        </div>

        {/* Detay */}
        <div className="space-y-5">
          <div className="h-4 w-24 animate-pulse rounded bg-primary/10" />
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-primary/10" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-4 animate-pulse rounded-full bg-primary/10" />
            ))}
            <div className="h-4 w-32 animate-pulse rounded bg-primary/5" />
          </div>
          <div className="h-8 w-1/3 animate-pulse rounded bg-primary/10" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-primary/5" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-primary/5" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-primary/5" />
          </div>
          <div className="flex gap-3">
            <div className="h-12 w-32 animate-pulse rounded-full bg-primary/10" />
            <div className="h-12 w-12 animate-pulse rounded-full bg-primary/10" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-full bg-primary/10" />

          {/* Güvence ikonları */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-primary/10 bg-white/60 p-5 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-6 w-6 animate-pulse rounded-full bg-primary/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-primary/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
