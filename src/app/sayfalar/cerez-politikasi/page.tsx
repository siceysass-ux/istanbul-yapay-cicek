import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const metadata: Metadata = {
  title: "Çerez (Cookie) Politikası",
  description:
    "cicekyapay.com üzerinde kullanılan zorunlu, analitik ve pazarlama çerezlerinin adları, saklama süreleri ve Consent Mode v2 tercih yönetimi.",
  alternates: { canonical: `${SITE_URL}/sayfalar/cerez-politikasi` },
  openGraph: {
    title: "Çerez (Cookie) Politikası — Çiçek Yapay",
    description:
      "cicekyapay.com üzerinde kullanılan çerezlerin adları, saklama süreleri ve tercih yönetimi.",
    url: `${SITE_URL}/sayfalar/cerez-politikasi`,
  },
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Çerez (Cookie) Politikası" updatedAt="Ekim 2026">
      <h2>1. Çerez Nedir?</h2>
      <p>
        Çerezler ve yerel depolama anahtarları, <strong>cicekyapay.com</strong> web sitemizi
        ziyaret ettiğinizde tarayıcınızda saklanan küçük veri kayıtlarıdır. Alışveriş sepetinizin
        korunması ve çerez onay tercihlerinizin hatırlanması için kullanılır.
      </p>

      <h2>2. Sitemizde Kullanılan Çerezler ve Saklama Süreleri</h2>
      <ul>
        <li>
          <strong>dyc-cart (Zorunlu — Kalıcı Yerel Depolama):</strong> Sepete eklediğiniz ürünleri
          ve kupon kodunu saklar. Siz sepeti temizleyene kadar tarayıcınızda kalır.
        </li>
        <li>
          <strong>dyc-cookie-consent (Zorunlu — 1 Yıl):</strong> Çerez bilgilendirme bandında
          verdiğiniz &ldquo;Kabul Et&rdquo; veya &ldquo;Reddet&rdquo; tercihini saklar.
        </li>
        <li>
          <strong>_ga, _ga_* (Analitik — Google Analytics 4 — 2 Yıl):</strong> Yalnızca çerez
          onayı verdiğinizde ziyaretçi trafiğini anonim olarak ölçümlemek için kullanılır.
        </li>
        <li>
          <strong>_gcl_au (Pazarlama — Google Ads — 90 Gün):</strong> Yalnızca çerez onayı
          verdiğinizde Google Ads (Hesap: 4312107150) reklam dönüşümlerini ölçümlemek için kullanılır.
        </li>
        <li>
          <strong>_fbp (Pazarlama — Meta Pixel — 90 Gün):</strong> Yalnızca çerez onayı
          verdiğinizde Instagram ve Facebook reklam performansını ölçümlemek için kullanılır.
        </li>
      </ul>

      <h2>3. Rıza Yönetimi (Google Consent Mode v2)</h2>
      <p>
        Sitemize ilk girişinizde sunulan çerez bandından <strong>&ldquo;Kabul Et&rdquo;</strong> veya{" "}
        <strong>&ldquo;Reddet&rdquo;</strong> seçimi yapabilirsiniz. &ldquo;Reddet&rdquo; seçeneğini
        tercih etmeniz halinde Google Consent Mode v2 ve Meta Pixel izinleri otomatik olarak{" "}
        <code>denied</code> konumuna çekilir ve reklam/analitik çerezleri çalıştırılmaz.
      </p>

      <h2>4. İletişim</h2>
      <p>
        Çerez politikamız hakkında sorularınız için <strong>info@cicekyapay.com</strong> adresinden
        bizimle iletişime geçebilirsiniz.
      </p>
    </LegalLayout>
  );
}
