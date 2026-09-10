export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Geri link */}
      <div className="mb-6 h-4 w-24 animate-pulse rounded bg-primary/5" />

      {/* Hero görsel */}
      <div className="mb-8 aspect-[16/9] animate-pulse rounded-3xl bg-primary/10" />

      {/* Başlık */}
      <div className="mb-4 h-10 w-3/4 animate-pulse rounded-lg bg-primary/10" />
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-primary/10" />
        <div className="space-y-1.5">
          <div className="h-3 w-32 animate-pulse rounded bg-primary/5" />
          <div className="h-3 w-24 animate-pulse rounded bg-primary/5" />
        </div>
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
      </div>
    </div>
  );
}
