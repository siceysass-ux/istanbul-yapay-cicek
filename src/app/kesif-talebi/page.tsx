"use client";

import { useState, useTransition } from "react";
import { Send, Building2, Home, Hotel, Store, Palmtree, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createQuoteRequestAction } from "./actions";

const placeTypes = [
  { value: "ofis", label: "Ofis", icon: Building2 },
  { value: "ev", label: "Ev", icon: Home },
  { value: "otel", label: "Otel", icon: Hotel },
  { value: "kafe", label: "Kafe / Restoran", icon: Store },
  { value: "dis-mekan", label: "Dış Mekan", icon: Palmtree },
];

const steps = [
  { num: 1, title: "Talep", desc: "Formu doldurun" },
  { num: 2, title: "Keşif", desc: "Ücretsiz yerinde keşif" },
  { num: 3, title: "Teklif", desc: "3D görselleştirme + teklif" },
  { num: 4, title: "Uygulama", desc: "Profesyonel montaj" },
];

export default function KesifTalebiPage() {
  const [form, setForm] = useState({
    name: "", company: "", phone: "", email: "", placeType: "", area: "", description: "",
  });
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.set(k, v));

    startTransition(async () => {
      const result = await createQuoteRequestAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Keşif talebiniz alındı!", {
          description: "Ekibimiz 24 saat içinde sizinle iletişime geçecek.",
        });
        setForm({ name: "", company: "", phone: "", email: "", placeType: "", area: "", description: "" });
        setSubmitted(true);
      }
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
          Keşif Talebi
        </h1>
        <p className="mt-2 text-muted">Dikey bahçe ve yeşillendirme projeleri için ücretsiz keşif.</p>
      </div>

      {/* Süreç */}
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.num} className="relative rounded-2xl border border-primary/10 bg-white/60 p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-cream font-serif text-lg">
              {step.num}
            </div>
            <h3 className="font-medium text-sm">{step.title}</h3>
            <p className="text-xs text-muted mt-1">{step.desc}</p>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-2 h-px w-4 bg-primary/20" />
            )}
          </div>
        ))}
      </div>

      {submitted ? (
        <div className="mx-auto max-w-2xl rounded-3xl border border-primary/10 bg-white/60 p-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-semibold">Talebiniz Alındı!</h2>
          <p className="mt-3 text-muted">
            Ekibimiz 24 saat içinde sizinle iletişime geçecek.
          </p>
          <Button className="mt-8" onClick={() => setSubmitted(false)} variant="outline">
            Yeni Talep Gönder
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-primary/10 bg-white/60 p-8">
          {/* Honeypot — gizli spam tuzağı */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Ad Soyad *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Firma</label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Telefon *</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="05XX XXX XX XX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">E-posta *</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>

          {/* Mekan tipi */}
          <div>
            <label className="block text-sm font-medium mb-2">Mekan Tipi</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {placeTypes.map((pt) => (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => setForm({ ...form, placeType: pt.value })}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                    form.placeType === pt.value
                      ? "border-primary bg-primary/5"
                      : "border-primary/15 hover:border-primary/40"
                  }`}
                >
                  <pt.icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium">{pt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Alan (m²)</label>
            <Input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="ör. 50" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Açıklama</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Projeniz hakkında detay verebilirsiniz..."
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Keşif Talebi Gönder
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
