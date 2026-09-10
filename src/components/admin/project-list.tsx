"use client";

import { useState } from "react";
import { Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { deleteProjectAction, toggleProjectAction } from "@/app/admin/projeler/actions";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  coverImage: string;
  isActive: boolean;
}

export function ProjectList({ projects }: { projects: ProjectItem[] }) {
  const [busy, setBusy] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" projesini silmek istediğinize emin misiniz?`)) return;
    setBusy(id);
    const result = await deleteProjectAction(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Proje silindi");
      window.location.reload();
    }
    setBusy(null);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    setBusy(id);
    const result = await toggleProjectAction(id, isActive);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(isActive ? "Proje gizlendi" : "Proje yayına alındı");
      window.location.reload();
    }
    setBusy(null);
  };

  return (
    <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
      <h2 className="font-serif text-lg font-semibold mb-4">Mevcut Projeler</h2>
      <div className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">Henüz proje yok.</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-primary/5 p-3 hover:bg-primary/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.coverImage} alt={p.title} className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{p.title}</p>
                <p className="text-xs text-muted">{p.location ?? "—"}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${p.isActive ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-600"}`}>
                {p.isActive ? "Aktif" : "Pasif"}
              </span>
              <button
                onClick={() => handleToggle(p.id, p.isActive)}
                disabled={busy === p.id}
                className="text-muted hover:text-primary"
                title={p.isActive ? "Gizle" : "Yayına Al"}
              >
                {p.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => handleDelete(p.id, p.title)}
                disabled={busy === p.id}
                className="text-red-500 hover:text-red-700"
              >
                {busy === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
