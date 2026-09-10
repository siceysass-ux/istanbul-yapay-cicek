"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProductAction } from "@/app/admin/urunler/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteProductAction(id);
    if (result?.error) {
      toast.error(result.error);
      setDeleting(false);
      setConfirming(false);
    } else {
      toast.success("Ürün silindi", { description: name });
    }
  };

  if (confirming) {
    return (
      <span className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-600 hover:underline text-xs font-medium"
        >
          {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Onayla"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-muted hover:underline text-xs"
        >
          Vazgeç
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-red-500 hover:text-red-700 text-xs font-medium"
    >
      <Trash2 className="h-3 w-3" />
    </button>
  );
}
