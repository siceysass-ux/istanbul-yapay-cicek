"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2, Phone, Mail, Building2 } from "lucide-react";
import { toast } from "sonner";
import { updateQuoteStatusAction, deleteQuoteAction } from "@/app/admin/kesif-talepleri/actions";

interface QuoteItem {
  id: string;
  name: string;
  company: string | null;
  phone: string;
  email: string;
  placeType: string | null;
  area: string | null;
  description: string | null;
  status: string;
  createdAt: Date;
}

const statusOptions = [
  { value: "NEW", label: "Yeni" },
  { value: "CONTACTED", label: "İletişim" },
  { value: "QUOTED", label: "Teklif" },
  { value: "WON", label: "Kazanıldı" },
  { value: "LOST", label: "Kayıp" },
];

const statusColors: Record<string, string> = {
  NEW: "bg-accent/20 text-accent",
  CONTACTED: "bg-blue-100 text-blue-700",
  QUOTED: "bg-primary/10 text-primary",
  WON: "bg-primary/20 text-primary",
  LOST: "bg-red-100 text-red-700",
};

export function QuoteList({ quotes }: { quotes: QuoteItem[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleStatus = (id: string, status: string) => {
    setBusy(id);
    startTransition(async () => {
      const result = await updateQuoteStatusAction(id, status);
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
    if (!confirm(`"${name}" talebini silmek istediğinize emin misiniz?`)) return;
    setBusy(id);
    const result = await deleteQuoteAction(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Talep silindi");
      window.location.reload();
    }
    setBusy(null);
  };

  if (quotes.length === 0) {
    return (
      <p className="rounded-2xl border border-primary/10 bg-white/60 p-8 text-center text-muted">
        Keşif talebi bulunamadı.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {quotes.map((q) => (
        <div key={q.id} className="rounded-2xl border border-primary/10 bg-white/60 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium">{q.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors[q.status] ?? "bg-gray-200"}`}>
                  {statusOptions.find((s) => s.value === q.status)?.label ?? q.status}
                </span>
              </div>
              {q.company && (
                <p className="text-sm text-muted flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> {q.company}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                <a href={`tel:${q.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                  <Phone className="h-3 w-3" /> {q.phone}
                </a>
                <a href={`mailto:${q.email}`} className="flex items-center gap-1 text-primary hover:underline">
                  <Mail className="h-3 w-3" /> {q.email}
                </a>
              </div>
              {(q.placeType || q.area) && (
                <p className="mt-2 text-xs text-muted">
                  {q.placeType && <span>Mekan: {q.placeType}</span>}
                  {q.placeType && q.area && " · "}
                  {q.area && <span>Alan: {q.area} m²</span>}
                </p>
              )}
              {q.description && (
                <p className="mt-2 text-sm text-ink/80 rounded-lg bg-primary/5 p-3">
                  {q.description}
                </p>
              )}
              <p className="mt-2 text-xs text-muted">
                {new Date(q.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <select
                value={q.status}
                onChange={(e) => handleStatus(q.id, e.target.value)}
                disabled={busy === q.id}
                className="h-9 rounded-full border border-primary/15 bg-white/60 px-3 text-xs font-medium focus:border-primary focus:outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <button
                onClick={() => handleDelete(q.id, q.name)}
                disabled={busy === q.id}
                className="text-red-500 hover:text-red-700"
              >
                {busy === q.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
