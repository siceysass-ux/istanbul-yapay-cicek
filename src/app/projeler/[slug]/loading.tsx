export default function ProjectDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-primary/10" />
        <div className="h-4 w-24 animate-pulse rounded bg-primary/10" />
      </div>
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-[16/10] animate-pulse rounded-3xl bg-primary/10" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-primary/10" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-primary/10" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-primary/5" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-primary/5" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-primary/5" />
          </div>
          <div className="space-y-2 rounded-2xl bg-primary/5 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-20 animate-pulse rounded bg-primary/10" />
                <div className="h-3 w-24 animate-pulse rounded bg-primary/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
