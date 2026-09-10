import { Construction } from "lucide-react";

export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold">{title}</h1>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 py-20 text-center">
        <Construction className="h-12 w-12 text-primary/30 mb-4" />
        <p className="font-serif text-xl">Bu modül geliştiriliyor</p>
        <p className="mt-2 text-sm text-muted">{title} sayfası yakında aktif olacak</p>
      </div>
    </div>
  );
}
