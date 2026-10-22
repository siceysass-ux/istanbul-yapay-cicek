"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createContactMessageAction } from "@/app/iletisim/actions";
import { trackLeadForm } from "@/lib/analytics";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kvkkAccepted) {
      toast.error("Lütfen KVKK Aydınlatma Metni onay kutusunu işaretleyin.");
      return;
    }
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.set(k, v));

    startTransition(async () => {
      const result = await createContactMessageAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        trackLeadForm("iletisim");
        toast.success("Mesajınız alındı!", {
          description: "En kısa sürede sizinle iletişime geçeceğiz.",
        });
        setForm({ name: "", phone: "", email: "", message: "" });
        setKvkkAccepted(false);
        setSubmitted(true);
      }
    });
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-primary/10 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </div>
        <h2 className="font-serif text-xl font-semibold">Mesajınız Alındı</h2>
        <p className="mt-2 text-sm text-muted">24 saat içinde yanıt vereceğiz.</p>
        <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>
          Yeni Mesaj Gönder
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-primary/10 bg-white p-8 shadow-xs">
      <h2 className="font-serif text-xl font-semibold">Mesaj Gönder</h2>

      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div>
        <label className="block text-sm font-medium mb-1.5">Ad Soyad *</label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Adınız Soyadınız" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Telefon *</label>
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="05XX XXX XX XX" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">E-posta</label>
        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ornek@eposta.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Mesaj *</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          required
          className="w-full rounded-2xl border border-primary/15 bg-white px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          placeholder="Ürün, proje veya kurumsal teklif talebinizi yazabilirsiniz..."
        />
      </div>

      {/* P1-18: KVKK Aydınlatma Onay Kutusu */}
      <label className="flex items-start gap-2.5 text-xs text-ink/80 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={kvkkAccepted}
          onChange={(e) => setKvkkAccepted(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 rounded border-primary/30 text-accent focus:ring-accent"
        />
        <span>
          Kişisel verilerimin talebimin yanıtlanması amacıyla işlenmesine ilişkin{" "}
          <Link href="/sayfalar/kvkk-aydinlatma" target="_blank" className="font-semibold text-accent hover:underline">
            KVKK Aydınlatma Metni
          </Link>
          &apos;ni okudum ve onaylıyorum. *
        </span>
      </label>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Gönder
          </>
        )}
      </Button>
    </form>
  );
}
