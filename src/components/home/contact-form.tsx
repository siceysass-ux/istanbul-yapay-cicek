"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createContactMessageAction } from "@/app/iletisim/actions";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.set(k, v));

    startTransition(async () => {
      const result = await createContactMessageAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Mesajınız alındı!", {
          description: "24 saat içinde yanıt vereceğiz.",
        });
        setForm({ name: "", phone: "", email: "", message: "" });
        setSubmitted(true);
      }
    });
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-primary/10 bg-white/60 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-primary/10 bg-white/60 p-8">
      <h2 className="font-serif text-xl font-semibold">Mesaj Gönder</h2>

      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div>
        <label className="block text-sm font-medium mb-1.5">Ad Soyad *</label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Adınız" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Telefon</label>
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05XX XXX XX XX" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">E-posta</label>
        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e-posta@ornek.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Mesaj *</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
          required
          className="w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Mesajınız..."
        />
      </div>
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
