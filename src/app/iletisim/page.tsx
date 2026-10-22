import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageCircle, Star, ExternalLink } from "lucide-react";
import { ContactForm } from "@/components/home/contact-form";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const metadata: Metadata = {
  title: "İletişim ve Mağaza Adresimiz",
  description:
    "Çiçek Yapay Zeytinburnu / İstanbul mağaza adresi, telefon (0507 884 66 03), WhatsApp destek hattı ve kurumsal teklif iletişim formu.",
  alternates: { canonical: `${SITE_URL}/iletisim` },
  openGraph: {
    title: "İletişim — Çiçek Yapay",
    description:
      "Çiçek Yapay Zeytinburnu / İstanbul mağaza adresi, telefon, WhatsApp hattı ve iletişim formu.",
    url: `${SITE_URL}/iletisim`,
  },
};

export default function IletisimPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">İletişim</h1>
        <p className="mt-2 text-sm text-muted">
          Ürünlerimiz, sipariş süreciniz veya kurumsal/toplu alım talepleriniz için bizimle iletişime geçebilirsiniz.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Bilgi */}
        <div className="space-y-4">
          {/* Google Yorumlar — belirgin kart */}
          <a
            href="https://share.google/ZQqzGYtPI1D3XVqLp"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-5 transition-all hover:border-accent/40 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-primary/10">
              <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-base font-semibold">Google İşletme Yorumları</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-ink">4.9</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <p className="mt-0.5 text-xs text-muted">Gerçek müşteri değerlendirmelerimizi okuyun</p>
            </div>
            <ExternalLink className="h-5 w-5 text-muted transition-colors group-hover:text-accent" />
          </a>

          {[
            { icon: Phone, title: "Telefon", value: "0(507) 884 66 03", sub: "Pazartesi - Cumartesi 09:00 - 18:00", href: "tel:+905078846603" },
            { icon: MessageCircle, title: "WhatsApp Destek", value: "0(507) 884 66 03", sub: "Hızlı yanıt için tıklayın", href: "https://wa.me/905078846603?text=Merhaba,%20%C3%BCr%C3%BCnleriniz%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." },
            { icon: Mail, title: "E-posta", value: "info@cicekyapay.com", sub: "24 saat içinde yanıt", href: "mailto:info@cicekyapay.com" },
            { icon: MapPin, title: "Atölye ve Mağaza Adresi", value: "Nuripaşa Mah. Merve Cad. No:73/A", sub: "34025 Zeytinburnu / İstanbul" },
            { icon: Clock, title: "Çalışma Saatleri", value: "09:00 - 18:00", sub: "Pazartesi - Cumartesi" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-2xs">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-ink">{item.title}</h3>
                {item.href ? (
                  <a href={item.href} className="text-accent font-semibold hover:underline">{item.value}</a>
                ) : (
                  <p className="text-ink font-semibold">{item.value}</p>
                )}
                <p className="text-sm text-muted">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <ContactForm />
      </div>

      {/* Google Maps — konum */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-primary/10">
        <iframe
          src="https://www.google.com/maps?q=Nuripa%C5%9Fa+Mah.+Merve+Cad.+No:73/A+Zeytinburnu+%C4%B0stanbul&output=embed"
          title="Çiçek Yapay Konum"
          width="100%"
          height="360"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full"
          style={{ border: 0 }}
          allowFullScreen
        />
      </div>
    </div>
  );
}
