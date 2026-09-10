export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-24 animate-pulse rounded bg-primary/5" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Sol — form */}
        <div className="space-y-6">
          {/* Adım göstergesi */}
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 flex-1 animate-pulse rounded-xl bg-primary/10" />
            ))}
          </div>

          {/* Form kartı */}
          <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
            <div className="mb-4 h-6 w-40 animate-pulse rounded bg-primary/10" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="mb-2 h-4 w-24 animate-pulse rounded bg-primary/5" />
                  <div className="h-11 w-full animate-pulse rounded-xl bg-primary/10" />
                </div>
              ))}
            </div>
          </div>

          {/* Ödeme yöntemi */}
          <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-primary/10" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 w-full animate-pulse rounded-xl bg-primary/5" />
              ))}
            </div>
          </div>
        </div>

        {/* Sağ — özet */}
        <div className="h-fit rounded-2xl border border-primary/10 bg-white/60 p-6 lg:sticky lg:top-28">
          <div className="mb-4 h-6 w-32 animate-pulse rounded bg-primary/10" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-16 w-16 animate-pulse rounded-xl bg-primary/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-primary/5" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-primary/5" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-primary/10 pt-4">
            <div className="h-4 w-full animate-pulse rounded bg-primary/5" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-primary/5" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-primary/10" />
          </div>
          <div className="mt-6 h-12 w-full animate-pulse rounded-full bg-primary/10" />
        </div>
      </div>
    </div>
  );
}
