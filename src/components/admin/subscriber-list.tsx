"use client";

import { useState } from "react";
import { Trash2, Loader2, Power, Copy } from "lucide-react";
import { toast } from "sonner";
import { deleteSubscriberAction, toggleSubscriberAction } from "@/app/admin/bulten/actions";

interface SubscriberItem {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

export function SubscriberList({ subscribers }: { subscribers: SubscriberItem[] }) {
  const [busy, setBusy] = useState<string | null>(null);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`"${email}" aboneliğini silmek istediğinize emin misiniz?`)) return;
    setBusy(id);
    const result = await deleteSubscriberAction(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Abone silindi");
      window.location.reload();
    }
    setBusy(null);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    setBusy(id);
    const result = await toggleSubscriberAction(id, isActive);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(isActive ? "Abone pasifleştirildi" : "Abone aktifleştirildi");
      window.location.reload();
    }
    setBusy(null);
  };

  const copyAll = () => {
    const emails = subscribers.filter((s) => s.isActive).map((s) => s.email).join("\n");
    navigator.clipboard.writeText(emails);
    toast.success("E-postalar kopyalandı");
  };

  return (
    <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold">Abone Listesi</h2>
        {subscribers.length > 0 && (
          <button
            onClick={copyAll}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Copy className="h-3 w-3" /> Tümünü Kopyala
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">Henüz abone yok.</p>
      ) : (
        <div className="space-y-2">
          {subscribers.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-primary/5 p-3 hover:bg-primary/5">
              <div className="flex-1">
                <p className="font-medium text-sm">{s.email}</p>
                <p className="text-xs text-muted">
                  {new Date(s.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${s.isActive ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-600"}`}>
                {s.isActive ? "Aktif" : "Pasif"}
              </span>
              <button
                onClick={() => handleToggle(s.id, s.isActive)}
                disabled={busy === s.id}
                className="text-muted hover:text-primary"
                title={s.isActive ? "Pasifleştir" : "Aktifleştir"}
              >
                <Power className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(s.id, s.email)}
                disabled={busy === s.id}
                className="text-red-500 hover:text-red-700"
              >
                {busy === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
