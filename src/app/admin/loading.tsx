export default function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-cream-dark/20">
      {/* Sidebar skeleton */}
      <div className="hidden w-64 border-r border-primary/10 bg-white p-4 lg:block">
        <div className="mb-6 h-8 w-32 animate-pulse rounded bg-primary/10" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded-xl bg-primary/5" />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-primary/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-primary/10 bg-white p-5">
              <div className="h-3 w-20 animate-pulse rounded bg-primary/10" />
              <div className="h-8 w-16 animate-pulse rounded bg-primary/5" />
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 w-full animate-pulse rounded-xl bg-primary/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
