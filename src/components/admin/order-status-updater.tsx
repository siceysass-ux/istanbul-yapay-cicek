"use client";

import { useState, useTransition } from "react";
import { Loader2, Truck, Check } from "lucide-react";
import { toast } from "sonner";
import {
  updateOrderStatusAction,
  updateCargoTrackingAction,
} from "@/app/admin/siparisler/actions";

const statusOptions = [
  { value: "PENDING", label: "Beklemede" },
  { value: "PAID", label: "Ödendi" },
  { value: "PROCESSING", label: "Hazırlanıyor" },
  { value: "SHIPPED", label: "Kargoda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal" },
  { value: "REFUNDED", label: "İade" },
];

const cargoProviders = [
  { value: "yurtici", label: "Yurtiçi Kargo" },
  { value: "aras", label: "Aras Kargo" },
  { value: "mng", label: "MNG Kargo" },
  { value: "surat", label: "Sürat Kargo" },
  { value: "ptt", label: "PTT Kargo" },
  { value: "ozel-kurye", label: "İstanbul Özel Kurye" },
];

export function OrderStatusUpdater({
  orderNumber,
  currentStatus,
  currentCargoProvider,
  currentCargoCode,
}: {
  orderNumber: string;
  currentStatus: string;
  currentCargoProvider?: string | null;
  currentCargoCode?: string | null;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [cargoProvider, setCargoProvider] = useState(currentCargoProvider || "yurtici");
  const [cargoCode, setCargoCode] = useState(currentCargoCode || "");
  const [pending, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderNumber, newStatus);
      if (result?.error) {
        toast.error(result.error);
        setStatus(currentStatus);
      } else {
        toast.success("Sipariş durumu güncellendi", { description: newStatus });
      }
    });
  };

  const handleSaveCargo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cargoCode.trim()) {
      toast.error("Lütfen kargo takip numarasını girin.");
      return;
    }
    startTransition(async () => {
      const result = await updateCargoTrackingAction(
        orderNumber,
        cargoProvider,
        cargoCode.trim()
      );
      if (result?.error) {
        toast.error(result.error);
      } else {
        setStatus("SHIPPED");
        toast.success("Kargo takip numarası kaydedildi ve sipariş 'Kargoda' olarak işaretlendi!");
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Durum Seçici */}
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => handleChange(e.target.value)}
          disabled={pending}
          className="h-10 rounded-full border border-primary/15 bg-white px-4 text-xs sm:text-sm font-semibold focus:border-accent focus:outline-none"
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              Durum: {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Hızlı Kargo Takip Kodu Kaydetme */}
      <form
        onSubmit={handleSaveCargo}
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-primary/12 bg-white p-1.5"
      >
        <Truck className="ml-2 h-4 w-4 text-accent shrink-0" />
        <select
          value={cargoProvider}
          onChange={(e) => setCargoProvider(e.target.value)}
          className="h-8 rounded-lg border border-primary/15 bg-cream-dark/40 px-2.5 text-xs font-medium"
        >
          {cargoProviders.map((cp) => (
            <option key={cp.value} value={cp.value}>
              {cp.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={cargoCode}
          onChange={(e) => setCargoCode(e.target.value)}
          placeholder="Kargo takip no..."
          className="h-8 w-36 rounded-lg border border-primary/15 px-2.5 text-xs"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-8 items-center gap-1 rounded-lg bg-accent px-3 text-xs font-semibold text-white hover:bg-[#d9560b]"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          <span>Kargoya Ver</span>
        </button>
      </form>
    </div>
  );
}
