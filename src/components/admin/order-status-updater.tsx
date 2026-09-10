"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatusAction } from "@/app/admin/siparisler/actions";

const statusOptions = [
  { value: "PENDING", label: "Beklemede" },
  { value: "PAID", label: "Ödendi" },
  { value: "PROCESSING", label: "Hazırlanıyor" },
  { value: "SHIPPED", label: "Kargoda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal" },
  { value: "REFUNDED", label: "İade" },
];

export function OrderStatusUpdater({
  orderNumber,
  currentStatus,
}: {
  orderNumber: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
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

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={pending}
        className="h-10 rounded-full border border-primary/15 bg-white/60 px-4 text-sm font-medium focus:border-primary focus:outline-none"
      >
        {statusOptions.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      {pending && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
    </div>
  );
}
