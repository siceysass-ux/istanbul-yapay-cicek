import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CustomerSegments } from "@/components/shared/application-areas";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Building2 } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const metadata: Metadata = {
  title: "Hakkımızda — 2019'dan Beri Yapay Ağaç ve Bitki Atölyesi",
  description:
    "2019 yılından bu yana Zeytinburnu / İstanbul atölyemizde doğal gövdeli yapay ağaç, bonsai, saksılı bitki üretimi ve kurumsal dikey bahçe projeleri gerçekleştiriyoruz.",
  alternates: { canonical: `${SITE_URL}/hakkimizda` },
  openGraph: {
    title: "Hakkımızda — Çiçek Yapay",
    description:
      "2019'dan bu yana doğal gövdeli yapay ağaç, saksılı bitki üretimi ve kurumsal dikey bahçe çözümleri.",
    url: `${SITE_URL}/hakkimizda`,
  },
};

const references = [
  "Ağaoğlu Terrace — İstanbul",
  "Colombia Coffee — İstanbul",
  "Contemporary Modern Art Museum — İstanbul",
  "Romatem Move — İstanbul",
  "Dilek Pastanesi — İstanbul",
  "Best Hotel — İstanbul",
  "MOOM Lounge — İstanbul",
  "Saray İnşaat — İstanbul",
];

export default function HakkimizdaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="inline-block rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            2019&apos;dan Beri İstanbul Zeytinburnu Atölyemizdeyiz
          </span>
          <h1 className="font-serif text-3xl font-semibold sm:text-4xl text-ink">
            Çiçek Yapay Botanik ve Dekorasyon
          </h1>
          <div className="space-y-4 text-ink/80 leading-relaxed text-sm sm:text-base">
            <p>
              <strong>2019 yılında</strong> İstanbul Zeytinburnu&apos;ndaki üretim ve tasarım
              atölyemizde faaliyetlerine başlayan <strong>Çiçek Yapay</strong>, gerçek doğal
              ağaç gövdeleri ve birinci sınıf ıslak dokulu (real-touch) yaprak/çiçek
              materyallerini bir araya getirerek uzun ömürlü iç ve dış mekan bitkileri üretmektedir.
            </p>
            <p>
              Perakende koleksiyonumuzda yer alan doğal ahşap gövdeli zeytin ağaçları, gerçek
              bambu kamışlı ağaçlar, kıvrımlı çam/sedir bonsai modelleri ve dev ayaklı vitrin
              çiçeklerinin tamamı kendi atölyemizde el işçiliğiyle hazırlanmakta ve saksılı tam
              boy olarak Türkiye&apos;nin 81 iline gönderilmektedir.
            </p>
            <p>
              Yüksek metrajlı kurumsal dikey bahçe, yosun duvar ve mimari peyzaj uygulamalarımızı
              ise kardeş markamız{" "}
              <a
                href="https://dikeyyapaybahce.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                dikeyyapaybahce.com
              </a>{" "}
              çatısı altında otel, ofis, restoran, hastane ve AVM projeleri için anahtar teslim
              olarak yürütüyoruz.
            </p>
          </div>
        </div>

        {/* Atölye & Ürün Görsel Vitrini */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <div className="relative aspect-[3/5] overflow-hidden rounded-2xl border border-primary/10 bg-cream-dark">
            <Image
              src="/products/dogal-ahsap-govdeli-meyveli-yapay-zeytin-agaci-185-cm/1.jpg"
              alt="Doğal Ahşap Gövdeli Yapay Zeytin Ağacı Atölye Üretimi"
              fill
              sizes="(max-width: 1024px) 50vw, 240px"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[3/5] overflow-hidden rounded-2xl border border-primary/10 bg-cream-dark mt-6">
            <Image
              src="/products/gri-tas-saksida-kivrimli-govdeli-yapay-cam-bonsai-agaci-155-cm/1.jpg"
              alt="Gri Taş Saksıda Kıvrımlı Yapay Çam Bonsai Atölye Üretimi"
              fill
              sizes="(max-width: 1024px) 50vw, 240px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Gerçek Kurumsal Referanslarımız */}
      <div className="mt-12 rounded-3xl border border-primary/10 bg-cream-dark/60 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-xl font-semibold text-ink">
            Tamamladığımız Seçili Kurumsal Referanslar
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {references.map((ref) => (
            <div
              key={ref}
              className="flex items-center gap-2 rounded-xl border border-primary/10 bg-white px-3.5 py-2.5 text-xs font-medium text-ink"
            >
              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
              <span>{ref}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Şirket İletişim Bilgileri */}
      <div className="mt-10 rounded-3xl border border-primary/10 bg-white p-6 sm:p-8 shadow-2xs">
        <h2 className="font-serif text-xl font-semibold mb-4">İşletme ve Atölye Bilgileri</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium">Telefon ve WhatsApp</div>
              <a href="tel:+905078846603" className="text-sm text-muted hover:text-accent">0(507) 884 66 03</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium">E-posta</div>
              <a href="mailto:info@cicekyapay.com" className="text-sm text-muted hover:text-accent">info@cicekyapay.com</a>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:col-span-2">
            <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium">Atölye ve Mağaza Adresi</div>
              <p className="text-sm text-muted">Nuripaşa Mah. Merve Cad. No:73/A, 34025 Zeytinburnu / İstanbul</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium">Çalışma Saatleri</div>
              <p className="text-sm text-muted">Pazartesi - Cumartesi, 09:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/kategori/yapay-agac"
          className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-[#d9560b] transition-colors"
        >
          Koleksiyonu İncele
        </Link>
        <a
          href="https://dikeyyapaybahce.com/projeler"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border border-primary/25 px-6 py-3 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
        >
          Kurumsal Dikey Bahçe Projeleri (dikeyyapaybahce.com)
        </a>
      </div>

      <CustomerSegments />
    </div>
  );
}
