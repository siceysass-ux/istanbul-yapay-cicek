export default function DiscoveryLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto h-10 w-56 animate-pulse rounded-lg bg-primary/10" />
        <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded bg-primary/5" />
      </div>
      <div className="space-y-4 rounded-3xl border border-primary/10 bg-white/60 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-28 animate-pulse rounded bg-primary/10" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-primary/5" />
          </div>
        ))}
        <div className="h-12 w-full animate-pulse rounded-full bg-primary/10" />
      </div>
    </div>
  );
}
