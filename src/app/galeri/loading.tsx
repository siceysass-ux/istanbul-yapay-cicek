export default function GalleryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto h-10 w-48 animate-pulse rounded-lg bg-primary/10" />
        <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded bg-primary/5" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-2xl bg-primary/10" />
        ))}
      </div>
    </div>
  );
}
