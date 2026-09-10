export default function ApplicationDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-primary/10" />
        <div className="h-4 w-24 animate-pulse rounded bg-primary/10" />
      </div>
      <div className="space-y-6">
        <div className="aspect-[16/8] animate-pulse rounded-3xl bg-primary/10" />
        <div className="h-12 w-3/4 animate-pulse rounded-lg bg-primary/10" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-primary/5" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-primary/5" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-primary/5" />
          <div className="h-4 w-full animate-pulse rounded bg-primary/5" />
        </div>
      </div>
    </div>
  );
}
