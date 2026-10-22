"use client";

import { Star, ExternalLink, Building2, CheckCircle2 } from "lucide-react";

const realReferences = [
  { name: "Ağaoğlu Terrace", location: "İstanbul", work: "İç Mekan Dikey Bahçe ve Yapay Ağaç Uygulaması" },
  { name: "Colombia Coffee", location: "İstanbul", work: "Yosun Duvar ve Yapay Bitki Tasarımı" },
  { name: "Contemporary Modern Art Museum", location: "İstanbul", work: "Dekoratif Yapay Ağaç ve Peyzaj Uygulaması" },
  { name: "Romatem Move", location: "İstanbul", work: "Kurumsal Alan Biyofilik Yeşillendirme Projesi" },
  { name: "Dilek Pastanesi", location: "İstanbul", work: "Mekan İçi Yapay Çiçek ve Dikey Bahçe Tasarımı" },
  { name: "Best Hotel", location: "İstanbul", work: "Otel Lobisi Yapay Ağaç ve Dikey Bahçe Dekorasyonu" },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-cream-dark/60 py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Google İşletme Yorumları ve Referanslarımız
            </h2>
            <p className="mt-2 text-sm text-muted">
              Zeytinburnu / İstanbul mağazamızın gerçek Google İşletme değerlendirmeleri ve tamamladığımız kurumsal projeler
            </p>
          </div>

          <a
            href="https://share.google/ZQqzGYtPI1D3XVqLp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl border border-primary/15 bg-white px-5 py-3 shadow-sm transition-all hover:border-accent hover:shadow-md"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-bold text-ink">4.9</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
            </div>
            <span className="text-xs font-semibold text-ink">
              Google Yorumlarını İncele
            </span>
            <ExternalLink className="h-4 w-4 text-accent" />
          </a>
        </div>

        {/* Gerçek Kurumsal Referanslar */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {realReferences.map((ref) => (
            <div
              key={ref.name}
              className="flex items-start gap-3.5 rounded-2xl border border-primary/10 bg-white p-5 shadow-2xs"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-base font-semibold text-ink">{ref.name}</h3>
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                </div>
                <p className="mt-1 text-xs text-ink/75">{ref.work}</p>
                <p className="mt-1 text-[11px] text-muted">{ref.location} · Tamamlanan Proje</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
