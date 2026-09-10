export function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">{title}</h1>
      {updatedAt && (
        <p className="mt-2 text-sm text-muted">Son güncelleme: {updatedAt}</p>
      )}
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink/80 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_p]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
