"use client";

import { useState } from "react";
import { Trash2, Loader2, Pencil, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/kategoriler/actions";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  order?: number;
  _count: { products: number };
}

export function CategoryList({ categories }: { categories: CategoryWithCount[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) return;
    setBusy(id);
    const result = await deleteCategoryAction(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Kategori silindi");
      window.location.reload();
    }
    setBusy(null);
  };

  const handleSave = async (id: string) => {
    setBusy(id);
    const result = await updateCategoryAction(id, {
      name: editName,
      slug: editSlug,
    });
    setBusy(null);
    setEditingId(null);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Kategori güncellendi");
      window.location.reload();
    }
  };

  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs">
      <h2 className="font-serif text-lg font-semibold mb-4">Mevcut Kategoriler</h2>
      <div className="space-y-2.5">
        {categories.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">Henüz kategori yok.</p>
        ) : (
          categories.map((c) => {
            const isEditing = editingId === c.id;
            return (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/10 p-3.5 hover:bg-primary/[0.02]"
              >
                {isEditing ? (
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Kategori adı"
                      className="rounded-lg border border-accent px-3 py-1.5 text-sm font-medium"
                    />
                    <input
                      type="text"
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      placeholder="kategori-slug"
                      className="rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleSave(c.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <Check className="h-3.5 w-3.5" /> Kaydet
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-sm text-ink">{c.name}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                      <span>/kategori/{c.slug}</span>
                      <span>·</span>
                      <span className="font-medium text-ink">{c._count.products} ürün</span>
                      <Link
                        href={`/kategori/${c.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-0.5 text-accent hover:underline"
                      >
                        <span>Sitede Gör</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setEditingId(null);
                      } else {
                        setEditingId(c.id);
                        setEditName(c.name);
                        setEditSlug(c.slug);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/15 px-2.5 py-1.5 text-xs font-medium text-ink hover:border-accent hover:text-accent"
                  >
                    <Pencil className="h-3 w-3" /> {isEditing ? "İptal" : "Düzenle"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(c.id, c.name)}
                    disabled={busy === c.id}
                    className="text-red-500 hover:text-red-700 p-1.5"
                    title="Kategoriyi sil"
                  >
                    {busy === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
