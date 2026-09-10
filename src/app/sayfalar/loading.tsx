export default function LegalPageLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <div className="h-10 w-72 animate-pulse rounded-lg bg-primary/10" />
        <div className="mt-3 h-3 w-40 animate-pulse rounded bg-primary/5" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-primary/10" />
            <div className="h-3 w-full animate-pulse rounded bg-primary/5" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-primary/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
