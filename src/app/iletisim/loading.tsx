export default function ContactLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto h-10 w-48 animate-pulse rounded-lg bg-primary/10" />
        <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded bg-primary/5" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-4 rounded-3xl border border-primary/10 bg-white/60 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-primary/10" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-primary/5" />
            </div>
          ))}
          <div className="h-12 w-full animate-pulse rounded-full bg-primary/10" />
        </div>
        {/* İletişim bilgileri */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white/60 p-5">
              <div className="h-12 w-12 animate-pulse rounded-full bg-primary/10" />
              <div className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-primary/10" />
                <div className="h-4 w-32 animate-pulse rounded bg-primary/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
