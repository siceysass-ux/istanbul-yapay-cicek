export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Başlık */}
      <div className="mb-8 text-center">
        <div className="mx-auto h-8 w-56 animate-pulse rounded-lg bg-primary/10" />
        <div className="mx-auto mt-2 h-4 w-72 animate-pulse rounded bg-primary/5" />
      </div>

      {/* Kampanya grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-primary/10 bg-white/60">
            <div className="aspect-[16/10] animate-pulse bg-primary/10" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-16 animate-pulse rounded-full bg-accent/20" />
              <div className="h-5 w-full animate-pulse rounded bg-primary/10" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-primary/5" />
              <div className="h-3 w-4/6 animate-pulse rounded bg-primary/5" />
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-primary/10" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-accent/20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
