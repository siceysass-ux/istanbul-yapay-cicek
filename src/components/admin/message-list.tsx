"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { updateMessageStatusAction, deleteMessageAction } from "@/app/admin/mesajlar/actions";

interface MessageItem {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

const statusOptions = [
  { value: "NEW", label: "Yeni" },
  { value: "READ", label: "Okundu" },
  { value: "REPLIED", label: "Yanıtlandı" },
  { value: "ARCHIVED", label: "Arşiv" },
];

const statusColors: Record<string, string> = {
  NEW: "bg-accent/20 text-accent",
  READ: "bg-blue-100 text-blue-700",
  REPLIED: "bg-primary/10 text-primary",
  ARCHIVED: "bg-gray-200 text-gray-600",
};

export function MessageList({ messages }: { messages: MessageItem[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleStatus = (id: string, status: string) => {
    setBusy(id);
    startTransition(async () => {
      const result = await updateMessageStatusAction(id, status);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Durum güncellendi");
        window.location.reload();
      }
      setBusy(null);
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" mesajını silmek istediğinize emin misiniz?`)) return;
    setBusy(id);
    const result = await deleteMessageAction(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Mesaj silindi");
      window.location.reload();
    }
    setBusy(null);
  };

  if (messages.length === 0) {
    return (
      <p className="rounded-2xl border border-primary/10 bg-white/60 p-8 text-center text-muted">
        Mesaj bulunamadı.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div key={m.id} className="rounded-2xl border border-primary/10 bg-white/60 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium">{m.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors[m.status] ?? "bg-gray-200"}`}>
                  {statusOptions.find((s) => s.value === m.status)?.label ?? m.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Phone className="h-3 w-3" /> {m.phone}
                  </a>
                )}
                {m.email && (
                  <a href={`mailto:${m.email}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Mail className="h-3 w-3" /> {m.email}
                  </a>
                )}
              </div>
              <p className="mt-3 text-sm text-ink/80 rounded-lg bg-primary/5 p-3 whitespace-pre-wrap">
                {m.message}
              </p>
              <p className="mt-2 text-xs text-muted">
                {new Date(m.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <select
                value={m.status}
                onChange={(e) => handleStatus(m.id, e.target.value)}
                disabled={busy === m.id}
                className="h-9 rounded-full border border-primary/15 bg-white/60 px-3 text-xs font-medium focus:border-primary focus:outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <button
                onClick={() => handleDelete(m.id, m.name)}
                disabled={busy === m.id}
                className="text-red-500 hover:text-red-700"
              >
                {busy === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
