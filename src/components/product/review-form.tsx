"use client";

import { useState } from "react";
import { Star, Loader2, Check, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) {
      toast.error("Lütfen adınızı ve yorumunuzu girin.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name,
          email,
          title,
          body,
          rating,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      toast.success("Yorumunuz alındı! Onaylandıktan sonra yayınlanacaktır.");
      setName(""); setEmail(""); setTitle(""); setBody(""); setRating(5);
    } catch {
      toast.error("Yorum gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-cream">
          <Check className="h-6 w-6" />
        </div>
        <h4 className="font-serif text-lg font-semibold">Teşekkürler!</h4>
        <p className="mt-1 text-sm text-muted">
          Yorumunuz alındı. Editör onayından sonra yayınlanacaktır.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Başka yorum yaz
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-primary/10 bg-white/60 p-6">
      <h4 className="font-serif text-lg font-semibold mb-1">Yorum Yaz</h4>
      <p className="text-xs text-muted mb-4 flex items-center gap-1">
        <BadgeCheck className="h-3.5 w-3.5 text-primary" />
        Yorumunuz editör onayından sonra yayınlanır
      </p>

      {/* Yıldız seçimi */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5">Puanınız</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              className="rounded p-0.5 transition-transform hover:scale-110"
              aria-label={`${s} yıldız`}
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  s <= (hover || rating)
                    ? "fill-accent text-accent"
                    : "fill-primary/10 text-primary/10"
                )}
              />
            </button>
          ))}
          <span className="ml-2 self-center text-sm font-medium">
            {rating}/5
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1.5">Adınız *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ad Soyad"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">E-posta (gizli)</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@mail.com"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium mb-1.5">Başlık</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Kısa özet"
        />
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium mb-1.5">Yorumunuz *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ürün hakkında deneyiminizi paylaşın..."
          rows={4}
          required
          className="w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <Button type="submit" disabled={submitting} className="mt-4 w-full">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor...
          </>
        ) : (
          "Yorumu Gönder"
        )}
      </Button>
    </form>
  );
}
