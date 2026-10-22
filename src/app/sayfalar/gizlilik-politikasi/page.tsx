import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const metadata: Metadata = {
  title: "Gizlilik ve Güvenlik Politikası",
  description:
    "Çiçek Yapay müşteri gizliliği, 256-bit SSL ödeme güvenliği, kişisel verilerin korunması ve bilgi güvenliği politikası.",
  alternates: { canonical: `${SITE_URL}/sayfalar/gizlilik-politikasi` },
  openGraph: {
    title: "Gizlilik ve Güvenlik Politikası — Çiçek Yapay",
    description:
      "Çiçek Yapay müşteri gizliliği, 256-bit SSL ödeme güvenliği ve bilgi güvenliği politikası.",
    url: `${SITE_URL}/sayfalar/gizlilik-politikasi`,
  },
};

export default function GizlilikPage() {
  return (
    <LegalLayout title="Gizlilik ve Güvenlik Politikası" updatedAt="Ekim 2026">
      <h2>1. Genel İlkeler ve İşletme Bilgileri</h2>
      <p>
        <strong>Çiçek Yapay Botanik ve Dekorasyon</strong> (<em>Nuripaşa Mah. Merve Cad. No:73/A,
        34025 Zeytinburnu / İstanbul</em>) olarak, <strong>cicekyapay.com</strong> ziyaretçilerimizin ve
        müşterilerimizin bilgi güvenliğini ve gizliliğini en üst düzeyde korumayı taahhüt ederiz.
      </p>

      <h2>2. Ödeme ve Kredi Kartı Güvenliği</h2>
      <p>
        Web sitemizde gerçekleştirilen tüm kredi kartı işlemleri 256-bit SSL sertifikası ile
        şifrelenir ve BDDK lisanslı ödeme kuruluşu <strong>iyzico</strong> altyapısı üzerinden
        doğrudan banka sistemlerine iletilir. Kredi kartı numaranız, son kullanma tarihiniz veya
        CVV kodunuz hiçbir şekilde sitemizde görüntülenmez ve kaydedilmez.
      </p>

      <h2>3. Toplanan Bilgiler ve Kullanım Amacı</h2>
      <ul>
        <li>Sipariş teslimatı ve faturalandırma için ad, soyad, adres, telefon, e-posta ve fatura vergi bilgileri,</li>
        <li>Site güvenliği ve performans iyileştirmesi için anonim erişim kayıtları,</li>
        <li>Çerez tercihleriniz doğrultusunda alışveriş sepeti ve reklam dönüşüm verileri.</li>
      </ul>

      <h2>4. Üçüncü Taraflarla Paylaşım Sınırları</h2>
      <p>
        Müşteri bilgileriniz; siparişin ulaştırılması amacıyla kargo firmaları, ödemenin
        alınması amacıyla ödeme kuruluşu ve yasal zorunluluklar çerçevesinde yetkili resmi
        merciler dışında üçüncü kişilere satılmaz veya kiralanmaz.
      </p>

      <h2>5. İletişim</h2>
      <p>
        Gizlilik politikamızla ilgili her türlü soru ve talebiniz için{" "}
        <strong>info@cicekyapay.com</strong> e-posta adresimizden veya{" "}
        <strong>0(507) 884 66 03</strong> numaralı telefonumuzdan bize ulaşabilirsiniz.
      </p>
    </LegalLayout>
  );
}
