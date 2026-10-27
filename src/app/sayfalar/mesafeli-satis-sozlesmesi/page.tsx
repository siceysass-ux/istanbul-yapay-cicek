import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "Çiçek Yapay üzerinden yapılan alışverişlere ilişkin 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamındaki Mesafeli Satış Sözleşmesi hükümleri.",
  alternates: { canonical: `${SITE_URL}/sayfalar/mesafeli-satis-sozlesmesi` },
  openGraph: {
    title: "Mesafeli Satış Sözleşmesi — Çiçek Yapay",
    description:
      "Çiçek Yapay üzerinden yapılan alışverişlere ilişkin Mesafeli Satış Sözleşmesi hükümleri.",
    url: `${SITE_URL}/sayfalar/mesafeli-satis-sozlesmesi`,
  },
};

export default function MesafeliSatisPage() {
  return (
    <LegalLayout title="Mesafeli Satış Sözleşmesi" updatedAt="Ekim 2026">
      <h2>1. Taraflar</h2>
      <p>
        İşbu Mesafeli Satış Sözleşmesi (&ldquo;Sözleşme&rdquo;), aşağıda bilgileri yer alan
        Satıcı ile <strong>cicekyapay.com</strong> web sitesi üzerinden sipariş veren Alıcı
        arasında elektronik ortamda akdedilmiştir.
      </p>
      <ul>
        <li><strong>Satıcı Ticari Unvanı / İşletme Adı:</strong> Çiçek Yapay Botanik ve Dekorasyon</li>
        <li><strong>Merkez ve İade Adresi:</strong> Nuripaşa Mah. Merve Cad. No:73/A, 34025 Zeytinburnu / İstanbul</li>
        <li><strong>Telefon / WhatsApp:</strong> 0(507) 884 66 03</li>
        <li><strong>E-posta:</strong> info@cicekyapay.com</li>
      </ul>

      <h2>2. Konu</h2>
      <p>
        Sözleşme, Satıcı&apos;nın <strong>cicekyapay.com</strong> web sitesi üzerinden sunduğu yapay çiçek,
        yapay ağaç, saksılı bitki ve ilgili dekorasyon ürünlerinin Alıcı tarafından satın alınmasına
        ilişkin 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
        kapsamındaki hak ve yükümlülükleri düzenler.
      </p>

      <h2>3. Teslimat ve Kargo Hükümleri</h2>
      <ul>
        <li>Alıcı, siparişini web sitesi üzerinden elektronik ortamda onaylar.</li>
        <li>Satıcı, sipariş onayını Alıcı&apos;nın bildirdiği e-posta ve/veya SMS adresine iletir.</li>
        <li>Ürünler, ödemenin onaylanmasından itibaren 1-3 iş günü içinde anlaşmalı kargo firmasına teslim edilir.</li>
        <li>Teslimat süresi İstanbul içi 1-3 iş günü, Türkiye genelindeki diğer iller için 2-5 iş günüdür.</li>
        <li>Tüm ürün ve siparişlerde Türkiye geneli standart kargo ücretsizdir.</li>
      </ul>

      <h2>4. Ödeme ve Taksit Koşulları</h2>
      <ul>
        <li>
          <strong>Kredi / Banka Kartı (iyzico 3D Secure Güvencesi):</strong> Ödemeler 256-bit SSL şifreli iyzico
          altyapısı üzerinden tek çekim veya anlaşmalı banka kredi kartlarına 12 taksite kadar
          yapılabilir. Kart bilgileri sitemizde saklanmaz.
        </li>
        <li>
          <strong>Fatura:</strong> Alıcı&apos;nın ödeme adımında seçtiği fatura tipine göre Bireysel (TCKN)
          veya Kurumsal (Firma Unvanı, Vergi Dairesi ve VKN) e-fatura/e-arşiv fatura düzenlenir.
        </li>
      </ul>

      <h2>5. Cayma Hakkı (14 Gün İade Hakkı)</h2>
      <p>
        Alıcı, ürünü teslim aldığı tarihten itibaren <strong>14 gün içinde</strong> herhangi bir gerekçe
        göstermeksizin cayma hakkını kullanabilir. Cayma hakkının kullanılması için ürünün kullanılmamış,
        deforme olmamış, orijinal ambalajında ve faturasıyla birlikte Satıcı&apos;nın merkez iade adresine
        (<em>Nuripaşa Mah. Merve Cad. No:73/A, Zeytinburnu / İstanbul</em>) gönderilmesi gerekmektedir.
        Alıcı&apos;nın özel ölçü veya kişiselleştirme talebiyle özel üretilen ürünlerde cayma hakkı kullanılamaz.
      </p>

      <h2>6. Garanti ve Sorumluluk</h2>
      <p>
        Ürünlerimiz 1. sınıf malzemeden üretilmiştir. Üretim ve kargo kaynaklı hasarlara karşı teslimattan
        itibaren 3 iş günü içinde bildirim yapılması halinde ücretsiz değişim veya tam iade sağlanır.
      </p>

      <h2>7. Uyuşmazlık Çözümü</h2>
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda Ticaret Bakanlığı&apos;nca ilan edilen parasal sınırlar
        dahilinde Alıcı&apos;nın yerleşim yerindeki veya İstanbul (Bakırköy) Tüketici Hakem Heyetleri ve
        Tüketici Mahkemeleri yetkilidir.
      </p>
    </LegalLayout>
  );
}
