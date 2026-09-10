"use client";

import { useState, useTransition } from "react";
import { Check, X, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { approveReviewAction, rejectReviewAction, deleteReviewAction } from "@/app/admin/yorumlar/actions";

export function ReviewActions({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const run = async (fn: (id: string) => Promise<{ error?: string }>, label: string) => {
    setBusy(true);
    startTransition(async () => {
      const result = await fn(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(label);
        window.location.reload();
      }
      setBusy(false);
    });
  };

  return (
    <div className="flex items-center gap-2">
      {status !== "APPROVED" && (
        <button
          onClick={() => run(approveReviewAction, "Yorum onaylandı")}
          disabled={pending}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
          title="Onayla"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </button>
      )}
      {status !== "REJECTED" && (
        <button
          onClick={() => run(rejectReviewAction, "Yorum reddedildi")}
          disabled={pending}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent hover:bg-accent/30"
          title="Reddet"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={() => run(deleteReviewAction, "Yorum silindi")}
        disabled={pending}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
        title="Sil"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
