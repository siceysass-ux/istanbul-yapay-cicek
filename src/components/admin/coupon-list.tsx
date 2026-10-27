"use client";

import { useState } from "react";
import { Trash2, Loader2, Power, Gift, Check, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  deleteCouponAction,
  toggleCouponAction,
  updateCouponAction,
  updateExitPopupSettingsAction,
} from "@/app/admin/kampanyalar/actions";

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

export function CouponList({
  coupons,
  initialExitEnabled = true,
  initialExitCouponCode = "SEPET5",
}: {
  coupons: CouponItem[];
  initialExitEnabled?: boolean;
  initialExitCouponCode?: string;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [exitEnabled, setExitEnabled] = useState(initialExitEnabled);
  const [exitCode, setExitCode] = useState(initialExitCouponCode);
  const [savingExit, setSavingExit] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editMinOrder, setEditMinOrder] = useState<string>("");

  const handleSaveExitSettings = async (nextEnabled: boolean, nextCode: string) => {
    setSavingExit(true);
    setExitEnabled(nextEnabled);
    setExitCode(nextCode);
    const res = await updateExitPopupSettingsAction({
      enabled: nextEnabled,
      couponCode: nextCode,
    });
    setSavingExit(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Sepet kurtarma penceresi ayarları güncellendi");
    }
  };

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

  const handleSaveInline = async (id: string) => {
    setBusy(id);
    const res = await updateCouponAction(id, {
      value: Number(editValue || 0),
      minOrder: Number(editMinOrder || 0),
    });
    setBusy(null);
    setEditingId(null);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Kupon değeri güncellendi");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Sepet Terk Etme (Exit-Intent) Popup Yönetim Kutusu */}
      <div className="rounded-2xl border border-accent/30 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-ink">
                Sepet Terk Etme (Exit-Intent) İndirim Penceresi
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Sepetinde ürün olan müşteriler siteden çıkmaya çalıştığında açılan otomatik indirim penceresini buradan yönetebilirsiniz.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={savingExit}
            onClick={() => handleSaveExitSettings(!exitEnabled, exitCode)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              exitEnabled
                ? "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <Power className="h-3.5 w-3.5" />
            <span>{exitEnabled ? "Pencere Aktif (Açık)" : "Pencere Kapalı"}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-primary/10">
          <label className="text-xs font-medium text-ink">
            Pencerede Gösterilecek Kupon:
          </label>
          <select
            value={exitCode}
            disabled={savingExit}
            onChange={(e) => handleSaveExitSettings(exitEnabled, e.target.value)}
            className="h-9 rounded-xl border border-primary/15 bg-white px-3 text-xs font-semibold text-ink focus:border-accent focus:outline-none"
          >
            {coupons.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.type === "PERCENT" ? `%${c.value} İndirim` : `${c.value} ₺ İndirim`})
                {!c.isActive ? " — [PASİF]" : ""}
              </option>
            ))}
          </select>
          {savingExit && <Loader2 className="h-4 w-4 animate-spin text-accent" />}
        </div>
      </div>

      {/* Mevcut Kuponlar Listesi */}
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-2xs">
        <h2 className="font-serif text-lg font-semibold mb-4">Mevcut Kuponlar</h2>
        <div className="space-y-3">
          {coupons.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">Henüz kupon yok.</p>
          ) : (
            coupons.map((c) => {
              const isEditing = editingId === c.id;
              const isExitCoupon = c.code === exitCode;
              return (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/10 p-3.5 hover:bg-primary/[0.02]"
                >
                  <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 font-price text-base font-extrabold text-accent">
                    {c.type === "PERCENT" ? `%${c.value}` : `${c.value}₺`}
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-sm text-ink">{c.code}</p>
                      {isExitCoupon && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                          Sepet Penceresinde Seçili
                        </span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <label className="flex items-center gap-1">
                          <span>Değer ({c.type === "PERCENT" ? "%" : "₺"}):</span>
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-16 rounded border border-accent px-2 py-1 font-bold"
                          />
                        </label>
                        <label className="flex items-center gap-1">
                          <span>Min. Sepet (₺):</span>
                          <input
                            type="number"
                            value={editMinOrder}
                            onChange={(e) => setEditMinOrder(e.target.value)}
                            className="w-20 rounded border border-accent px-2 py-1 font-bold"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSaveInline(c.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1 text-white font-semibold"
                        >
                          <Check className="h-3.5 w-3.5" /> Kaydet
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted mt-0.5">
                        {c.type === "PERCENT" ? `Yüzde %${c.value} indirim` : `Sabit ${c.value} ₺ indirim`} ·
                        Min. sepet: {c.minOrder} ₺ ·
                        {c.maxUses > 0 ? ` ${c.usedCount}/${c.maxUses} kullanım` : ` ${c.usedCount} kez kullanıldı (sınırsız)`}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setEditingId(null);
                      } else {
                        setEditingId(c.id);
                        setEditValue(String(c.value));
                        setEditMinOrder(String(c.minOrder));
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/15 px-2.5 py-1 text-xs font-medium text-ink hover:border-accent hover:text-accent"
                  >
                    <Pencil className="h-3 w-3" /> Oranı Düzenle
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(c.id, c.isActive)}
                    disabled={busy === c.id}
                    className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${
                      c.isActive
                        ? "bg-emerald-500/15 text-emerald-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                    title={c.isActive ? "Pasifleştir" : "Aktifleştir"}
                  >
                    {c.isActive ? "Aktif" : "Pasif"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(c.id, c.code)}
                    disabled={busy === c.id}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Kuponu sil"
                  >
                    {busy === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
