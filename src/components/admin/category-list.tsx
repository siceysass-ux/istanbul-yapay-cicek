"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCategoryAction } from "@/app/admin/kategoriler/actions";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export function CategoryList({ categories }: { categories: CategoryWithCount[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) return;
    setDeleting(id);
    const result = await deleteCategoryAction(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Kategori silindi");
      window.location.reload();
    }
    setDeleting(null);
  };

  return (
    <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
      <h2 className="font-serif text-lg font-semibold mb-4">Mevcut Kategoriler</h2>
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">Henüz kategori yok.</p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-primary/5 p-3 hover:bg-primary/5">
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted">/{c.slug} · {c._count.products} ürün</p>
              </div>
              <button
                onClick={() => handleDelete(c.id, c.name)}
                disabled={deleting === c.id}
                className="text-red-500 hover:text-red-700"
              >
                {deleting === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
