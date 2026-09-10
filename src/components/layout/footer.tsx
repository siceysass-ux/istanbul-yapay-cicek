import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  Truck,
  RotateCcw,
  CreditCard,
  HandCoins,
  MessageCircle,
} from "lucide-react";

const year = new Date().getFullYear();

const trustItems = [
  { icon: Truck, title: "Ücretsiz Kargo", desc: "2000₺ üzeri" },
  { icon: RotateCcw, title: "14 Gün İade", desc: "Koşulsuz iade" },
  { icon: CreditCard, title: "3 Taksit", desc: "Kredi kartına" },
  { icon: HandCoins, title: "Kapıda Ödeme", desc: "İstanbul içi" },
];

const linkGroups = [
  {
    title: "Kategoriler",
    links: [
      { label: "Yapay Çiçekler", href: "/kategori/yapay-cicek" },
      { label: "Yapay Ağaçlar", href: "/kategori/yapay-agac" },
      { label: "Demet Çiçekler", href: "/kategori/demet-cicek" },
      { label: "Gelin Buketi", href: "/kategori/gelin-buketi" },
      { label: "Dikey Bahçe", href: "/kategori/dikey-bahce" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Projelerimiz", href: "/projeler" },
      { label: "Galeri", href: "/galeri" },
      { label: "İletişim", href: "/iletisim" },
      { label: "Keşif Talebi", href: "/kesif-talebi" },
    ],
  },
  {
    title: "Uygulamalar",
    links: [
      { label: "Yapay Dikey Bahçe", href: "/uygulamalar/yapay-dikey-bahce" },
      { label: "Yosun Duvar", href: "/uygulamalar/yosun-duvar" },
      { label: "Büyük Yapay Ağaç", href: "/uygulamalar/buyuk-yapay-agac" },
      { label: "Yeşil Duvar Panelleri", href: "/uygulamalar/yapay-yesil-duvar-panelleri" },
      { label: "Yapay Çit Sistemleri", href: "/uygulamalar/yapay-cit-sistemleri" },
      { label: "Bölücü Paneller", href: "/uygulamalar/yapay-bolucu-paneller" },
      { label: "Akustik Yosun Paneller", href: "/uygulamalar/akustik-yosun-paneller" },
      { label: "Yosun Tablolar", href: "/uygulamalar/yosun-tablolar" },
      { label: "Yapay Bambu", href: "/uygulamalar/yapay-bambu-dekorasyonu" },
    ],
  },
  {
    title: "Müşteri Hizmetleri",
    links: [
      { label: "Mesafeli Satış Sözleşmesi", href: "/sayfalar/mesafeli-satis-sozlesmesi" },
      { label: "Gizlilik Politikası", href: "/sayfalar/gizlilik-politikasi" },
      { label: "İade Koşulları", href: "/sayfalar/iade-kosullari" },
      { label: "KVKK Aydınlatma", href: "/sayfalar/kvkk-aydinlatma" },
      { label: "Çerez Politikası", href: "/sayfalar/cerez-politikasi" },
    ],
  },
];

const socials = [
  { Icon: Instagram, href: "https://instagram.com/dikeyyapaybahce", label: "Instagram" },
  { Icon: Facebook, href: "https://facebook.com/dikeyyapaybahce", label: "Facebook" },
  { Icon: Youtube, href: "https://youtube.com/@dikeyyapaybahce", label: "YouTube" },
];

const contactItems = [
  { icon: Phone, label: "Telefon", value: "0(507) 884 66 03", href: "tel:+905078846603" },
  { icon: MessageCircle, label: "WhatsApp", value: "0(507) 884 66 03", href: "https://wa.me/905078846603" },
  { icon: Mail, label: "E-posta", value: "info@dikeyyapaybahce.com", href: "mailto:info@dikeyyapaybahce.com" },
  { icon: MapPin, label: "Adres", value: "Nuripaşa Mah. Merve Cad. No:73/A, Zeytinburnu / İstanbul" },
  { icon: Clock, label: "Çalışma Saatleri", value: "Pzt - Cmt, 09:00 - 18:00" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-cream/80 pb-20 lg:pb-0">
      {/* Güvence şeridi */}
      <div className="border-b border-cream/10 bg-ink-light/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:gap-6 lg:px-8">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 sm:h-12 sm:w-12">
                <item.icon className="h-5 w-5 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-cream">{item.title}</div>
                <div className="truncate text-xs text-cream/50">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ana içerik */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {/* Marka + sosyal */}
        <div className="mb-10 flex flex-col items-start gap-4 border-b border-cream/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Ana sayfa">
              <Image
                src="/logo.webp"
                alt="İstanbul Yapay Çiçek"
                width={480}
                height={207}
                className="h-16 w-auto"
              />
            </Link>
            <div className="hidden h-8 w-px bg-cream/10 sm:block" />
            <p className="hidden max-w-xs text-xs leading-relaxed text-cream/50 sm:block">
              Bakım gerektirmeyen premium yapay çiçek, ağaç ve dikey bahçe ürünleri.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/5 ring-1 ring-cream/10 transition-all hover:scale-110 hover:bg-accent hover:text-ink"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            {/* Google Yorumlar */}
            <a
              href="https://share.google/ZQqzGYtPI1D3XVqLp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-cream/5 px-3 py-2 ring-1 ring-cream/10 transition-all hover:bg-cream/10"
              aria-label="Google Yorumlar"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-xs font-medium text-cream">4.9</span>
              <Star className="h-3 w-3 fill-accent text-accent" />
            </a>
          </div>
        </div>

        {/* Link grupları */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/60 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* İletişim */}
        <div className="mt-10 grid gap-3 border-t border-cream/10 pt-8 sm:grid-cols-2 lg:grid-cols-5">
          {contactItems.map((item) => {
            const inner = (
              <div className="flex items-start gap-2.5 text-cream/60 transition-colors hover:text-cream">
                <item.icon className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-cream/40">{item.label}</div>
                  <div className="truncate text-xs">{item.value}</div>
                </div>
              </div>
            );
            return item.href ? (
              <a key={item.label} href={item.href} className="block">{inner}</a>
            ) : (
              <div key={item.label}>{inner}</div>
            );
          })}
        </div>

        {/* Google Maps — konum */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-cream/10">
          <iframe
            src="https://www.google.com/maps?q=Nuripa%C5%9Fa+Mah.+Merve+Cad.+No:73/A+Zeytinburnu+%C4%B0stanbul&output=embed"
            title="İstanbul Yapay Çiçek Konum"
            width="100%"
            height="240"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full grayscale-[40%] contrast-110"
            style={{ border: 0 }}
            allowFullScreen
          />
        </div>
      </div>

      {/* Alt bant */}
      <div className="border-t border-cream/10 bg-ink-light/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-cream/40 sm:flex-row lg:px-8">
          <p>© {year} İstanbul Yapay Çiçek. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["VISA", "MASTERCARD", "TROY", "KAPIDA ÖDE"].map((p) => (
              <span
                key={p}
                className="rounded-md bg-cream/5 px-2.5 py-1 text-[10px] font-semibold tracking-wider ring-1 ring-cream/10"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
