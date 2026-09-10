"use client";

import { motion } from "framer-motion";
import { Star, Quote, BadgeCheck, Calendar, ShoppingBag, MapPin } from "lucide-react";

const testimonials = [
  {
    name: "Ayşe Korkmaz",
    role: "İç Mimar",
    company: "Studio Aura",
    text: "Müşterilerim için tercih ettiğim yapay çiçekler, gerçek dokusuyla herkesi şaşırtıyor. Teslimat hızı ve paketleme kalitesi de kusursuz.",
    rating: 5,
    initial: "A",
    date: "12 Mart 2026",
    location: "İstanbul",
    purchase: "Yapay Gül Demeti + Dikey Bahçe Paneli",
  },
  {
    name: "Mehmet Tunç",
    role: "Otel Müdürü",
    company: "Grand Lotus Hotel",
    text: "Lobi için yaptırdığımız dikey bahçe projesi beklentilerimizin çok ötesinde çıktı. Misafirlerimiz sürekli iltifat ediyor.",
    rating: 5,
    initial: "M",
    date: "28 Şubat 2026",
    location: "Antalya",
    purchase: "Yapay Dikey Bahçe (40m²)",
  },
  {
    name: "Zeynep Aksoy",
    role: "Ev Sahibi",
    text: "Bir yıldır kullandığım gül demeti ilk günkü gibi duruyor. Bakım gerektirmemesi inanılmaz rahat. Kesinlikle tavsiye ediyorum.",
    rating: 5,
    initial: "Z",
    date: "15 Ocak 2026",
    location: "İzmir",
    purchase: "Yapay Gül Demeti 50cm",
  },
  {
    name: "Can Demir",
    role: "Kafe Sahibi",
    company: "Botanik Kafe",
    text: "Kafemizin tüm duvarlarını yosun duvar kaplama ile kaplattık. Müşterilerimiz fotoğraf çekmek için sıraya giriyor. Muhteşem bir atmosfer yarattı.",
    rating: 5,
    initial: "C",
    date: "3 Şubat 2026",
    location: "İstanbul",
    purchase: "Yosun Duvar Kaplama (15m²)",
  },
  {
    name: "Selin Yılmaz",
    role: "Etkinlik Organizatörü",
    text: "Düğün organizasyonları için yapay çiçekler kullanıyoruz. Gerçekçilikleri inanılmaz, misafirler gerçek sanıyor. Tekrar tekrar tercih ediyoruz.",
    rating: 5,
    initial: "S",
    date: "20 Mart 2026",
    location: "Ankara",
    purchase: "Gelin Buketi + Dekoratif Çiçekler",
  },
  {
    name: "Burak Şahin",
    role: "Ofis Müdürü",
    company: "TechCorp",
    text: "Ofisimize yaptırdığımız yapay ağaçlar ve sarmaşıklar, çalışma ortamını tamamen değiştirdi. Bakım gerektirmemesi büyük avantaj.",
    rating: 5,
    initial: "B",
    date: "8 Ocak 2026",
    location: "İstanbul",
    purchase: "Yapay Ağaç (180cm) + Sarmaşık Paneli",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-cream-dark/40 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Başlık — ortalanmış, sade */}
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Müşteri Yorumları
          </h2>
          <p className="mt-2 text-sm text-muted text-pretty">
            Binlerce mutlu müşterimizden bazıları
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-3xl border border-primary/10 bg-white/80 p-8 transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Dekoratif alıntı işareti */}
              <div className="absolute -top-4 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-cream shadow-lg">
                <Quote className="h-5 w-5" />
              </div>

              {/* Doğrulanmış rozet */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  <BadgeCheck className="h-3 w-3" /> Doğrulanmış
                </span>
              </div>

              {/* Yorum */}
              <p className="text-sm leading-relaxed text-ink/80 italic">
                "{t.text}"
              </p>

              {/* Satın alınan ürün */}
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-xs text-muted">
                <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                <span className="truncate">{t.purchase}</span>
              </div>

              {/* Kişi */}
              <div className="mt-5 flex items-center gap-3 border-t border-primary/10 pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light font-serif text-lg font-bold text-cream">
                  {t.initial}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted">
                    {t.role}
                    {t.company && <span className="text-accent"> · {t.company}</span>}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {t.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {t.location}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Güven istatistiği */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 flex flex-col items-center justify-center gap-6 rounded-3xl border border-primary/10 bg-white/60 p-6 sm:flex-row sm:gap-12"
        >
          <div className="text-center">
            <div className="font-serif text-3xl font-bold text-primary">4.9/5</div>
            <div className="mt-1 flex justify-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted">Ortalama puan</p>
          </div>
          <div className="hidden h-12 w-px bg-primary/10 sm:block" />
          <div className="text-center">
            <div className="font-serif text-3xl font-bold text-primary">2.847</div>
            <p className="mt-1 text-xs text-muted">Doğrulanmış yorum</p>
          </div>
          <div className="hidden h-12 w-px bg-primary/10 sm:block" />
          <div className="text-center">
            <div className="font-serif text-3xl font-bold text-primary">%98</div>
            <p className="mt-1 text-xs text-muted">Tekrar tavsiye oranı</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
