export default function ApplicationsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-primary/10" />
        <div className="mx-auto mt-3 h-4 w-80 animate-pulse rounded bg-primary/5" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-primary/10">
            <div className="aspect-[4/3] animate-pulse bg-primary/10" />
            <div className="space-y-2 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-primary/10" />
              <div className="h-3 w-full animate-pulse rounded bg-primary/5" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-primary/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
