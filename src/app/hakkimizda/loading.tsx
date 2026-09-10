export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mx-auto h-12 w-72 animate-pulse rounded-lg bg-primary/10" />
        <div className="mx-auto mt-4 h-5 w-96 animate-pulse rounded bg-primary/5" />
      </div>
      <div className="aspect-[16/6] animate-pulse rounded-3xl bg-primary/10" />
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-3xl border border-primary/10 bg-white/60 p-6">
            <div className="h-12 w-12 animate-pulse rounded-full bg-primary/10" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-primary/10" />
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-primary/5" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-primary/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
