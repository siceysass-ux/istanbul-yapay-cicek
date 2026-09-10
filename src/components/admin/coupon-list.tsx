"use client";

import { useState } from "react";
import { Trash2, Loader2, Power } from "lucide-react";
import { toast } from "sonner";
import { deleteCouponAction, toggleCouponAction } from "@/app/admin/kampanyalar/actions";

interface CouponItem {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
}

export function CouponList({ coupons }: { coupons: CouponItem[] }) {
  const [busy, setBusy] = useState<string | null>(null);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`"${code}" kuponunu silmek istediğinize emin misiniz?`)) return;
    setBusy(id);
    const result = await deleteCouponAction(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Kupon silindi");
      window.location.reload();
    }
    setBusy(null);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    setBusy(id);
    const result = await toggleCouponAction(id, isActive);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(isActive ? "Kupon pasifleştirildi" : "Kupon aktifleştirildi");
      window.location.reload();
    }
    setBusy(null);
  };

  return (
    <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
      <h2 className="font-serif text-lg font-semibold mb-4">Mevcut Kuponlar</h2>
      <div className="space-y-3">
        {coupons.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">Henüz kupon yok.</p>
        ) : (
          coupons.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-xl border border-primary/5 p-3 hover:bg-primary/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 font-serif text-lg font-bold text-primary">
                {c.type === "PERCENT" ? `%${c.value}` : `₺${c.value}`}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{c.code}</p>
                <p className="text-xs text-muted">
                  {c.type === "PERCENT" ? `Yüzde ${c.value}%` : `Sabit ${c.value}₺`} ·
                  Min {c.minOrder}₺ ·
                  {c.maxUses > 0 ? ` ${c.usedCount}/${c.maxUses} kullanım` : " sınırsız"}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${c.isActive ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-600"}`}>
                {c.isActive ? "Aktif" : "Pasif"}
              </span>
              <button
                onClick={() => handleToggle(c.id, c.isActive)}
                disabled={busy === c.id}
                className="text-muted hover:text-primary"
                title={c.isActive ? "Pasifleştir" : "Aktifleştir"}
              >
                <Power className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(c.id, c.code)}
                disabled={busy === c.id}
                className="text-red-500 hover:text-red-700"
              >
                {busy === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
