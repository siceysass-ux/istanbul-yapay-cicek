import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const metadata: Metadata = {
  title: "İade ve Değişim Koşulları",
  description:
    "Çiçek Yapay 14 gün iade ve değişim koşulları, iade adresi, kargo süreci ve kredi kartı / kapıda ödeme geri ödeme prosedürleri.",
  alternates: { canonical: `${SITE_URL}/sayfalar/iade-kosullari` },
  openGraph: {
    title: "İade ve Değişim Koşulları — Çiçek Yapay",
    description:
      "Çiçek Yapay 14 gün iade ve değişim koşulları, iade adresi ve geri ödeme prosedürleri.",
    url: `${SITE_URL}/sayfalar/iade-kosullari`,
  },
};

export default function IadeKosullariPage() {
  return (
    <LegalLayout title="İade ve Değişim Koşulları" updatedAt="Ekim 2026">
      <h2>1. 14 Gün Cayma ve İade Hakkı</h2>
      <p>
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
        kapsamında, satın aldığınız ürünü teslim aldığınız tarihten itibaren{" "}
        <strong>14 gün içinde</strong> cayma ve iade hakkınızı kullanabilirsiniz.
      </p>

      <h2>2. İade Kabul Şartları</h2>
      <ul>
        <li>İade edilecek ürünün kullanılmamış, dış mekanda yıpranmamış ve tekrar satılabilir özelliğini kaybetmemiş olması gerekir.</li>
        <li>Ürün, saksısı, koruyucu ambalajı ve faturası (kurumsal alımlarda iade faturası) ile birlikte eksiksiz gönderilmelidir.</li>
        <li>Müşterinin özel ölçü veya mekana özel üretim talebiyle hazırlanan projeli ürünlerde cayma hakkı kapsamı dışındadır.</li>
      </ul>

      <h2>3. İade Adresi ve Başvuru Süreci</h2>
      <ul>
        <li>
          <strong>Başvuru:</strong> İade talebinizi sipariş numaranızla birlikte{" "}
          <strong>info@cicekyapay.com</strong> e-posta adresine veya{" "}
          <strong>0(507) 884 66 03</strong> WhatsApp destek hattımıza iletebilirsiniz.
        </li>
        <li>
          <strong>İade Gönderim Adresi:</strong>{" "}
          <em>Çiçek Yapay Botanik ve Dekorasyon — Nuripaşa Mah. Merve Cad. No:73/A, 34025 Zeytinburnu / İstanbul</em>
        </li>
      </ul>

      <h2>4. Geri Ödeme Süreci (Kredi Kartı ve Kapıda Ödeme)</h2>
      <ul>
        <li>
          <strong>Kredi / Banka Kartı ile Ödemeler:</strong> Ürün iade adresimize ulaşıp kontrol
          edildikten sonra en geç <strong>7 iş günü</strong> içinde iade tutarı iyzico üzerinden
          ödemeyi yaptığınız karta iade edilir. Banka süreçlerine bağlı olarak ekstrenize yansıması
          2-5 iş günü sürebilir.
        </li>
        <li>
          <strong>Kapıda Ödeme ile Alınan Siparişler:</strong> Kapıda nakit ödeme ile teslim alınan
          siparişlerin iadesinde, sipariş sahibi Alıcı&apos;nın yazılı olarak bildireceği kendi adına
          kayıtlı <strong>TR IBAN</strong> hesabına ürün kabulünden itibaren en geç{" "}
          <strong>7 iş günü</strong> içinde Havale/EFT yoluyla geri ödeme yapılır.
        </li>
      </ul>

      <h2>5. Kargo Ücreti ve Hasarlı Teslimat</h2>
      <p>
        Keyfi cayma hakkı kullanımlarında iade kargo gönderim bedeli Alıcı&apos;ya aittir. Ayıplı,
        kusurlu veya kargoda hasar görmüş ürünlerde ise (teslimattan itibaren 3 iş günü içinde
        fotoğrafla bildirilmesi kaydıyla) gidiş-dönüş kargo ücreti tamamen Satıcı tarafından
        karşılanır ve ücretsiz yeni ürün gönderimi veya tam ücret iadesi yapılır.
      </p>
    </LegalLayout>
  );
}
