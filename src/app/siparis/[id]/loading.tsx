export default function OrderDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-primary/10" />
        <div className="h-4 w-24 animate-pulse rounded bg-primary/10" />
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-primary/10 bg-white/60 p-5">
          <div className="space-y-2">
            <div className="h-6 w-40 animate-pulse rounded bg-primary/10" />
            <div className="h-3 w-24 animate-pulse rounded bg-primary/5" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded-full bg-primary/10" />
        </div>
        <div className="space-y-3 rounded-2xl border border-primary/10 bg-white/60 p-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-14 w-14 animate-pulse rounded-lg bg-primary/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-primary/10" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-primary/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
