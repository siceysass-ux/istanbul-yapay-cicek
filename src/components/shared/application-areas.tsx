import Link from "next/link";

const applicationAreas = [
  { num: "1", title: "Yaşam Alanları" },
  { num: "2", title: "Düğün Mekanları" },
  { num: "3", title: "Etkinlik Salonları" },
  { num: "4", title: "Ofis ve Toplantı Alanları" },
];

const customerSegments = [
  "Kamu Kurum ve Kuruluşları",
  "Kurumsal Firmalar",
  "Mimarlar",
  "İnşaat Firmaları",
  "İç Mekan Tasarımcıları",
  "Proje Yöneticileri",
  "Peyzaj Mimarları",
];

export function ApplicationAreas() {
  return (
    <section className="bg-cream-dark/40 px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-2xl font-semibold mb-2">Uygulamalarımız nereler için uygundur?</h2>
        <p className="text-muted mb-8">Detayları öğrenmek için bizimle iletişime geçebilirsiniz.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {applicationAreas.map((area) => (
            <div key={area.num} className="rounded-2xl border border-primary/10 bg-white/60 p-6 text-center">
              <span className="font-serif text-3xl font-semibold text-primary/30">{area.num}</span>
              <h3 className="mt-2 font-medium">{area.title}</h3>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/iletisim" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-cream hover:bg-primary-dark transition-colors">
            İletişim
          </Link>
          <Link href="/kesif-talebi" className="rounded-full border border-primary/20 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
            Teklif Al
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CustomerSegments() {
  return (
    <section className="px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="font-serif text-2xl font-semibold mb-8">Birlikte Çalıştığımız Müşteriler</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {customerSegments.map((seg) => (
            <span key={seg} className="rounded-full border border-primary/15 bg-white/60 px-5 py-2.5 text-sm text-ink/80">
              {seg}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
