export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Başlık */}
      <div className="mb-8">
        <div className="h-10 w-3/4 animate-pulse rounded-lg bg-primary/10" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-primary/5" />
      </div>

      {/* İçerik */}
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-full animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-primary/5" />
        <div className="my-6 aspect-video animate-pulse rounded-2xl bg-primary/10" />
        <div className="h-4 w-full animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-full animate-pulse rounded bg-primary/5" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-primary/5" />
      </div>
    </div>
  );
}
