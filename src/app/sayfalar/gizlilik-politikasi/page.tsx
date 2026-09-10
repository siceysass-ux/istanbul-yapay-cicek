import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Gizlilik Politikası" };

export default function GizlilikPage() {
  return (
    <LegalLayout title="Gizlilik Politikası" updatedAt="Eylül 2026">
      <h2>1. Genel</h2>
      <p>
        İstanbul Yapay Çiçek olarak, ziyaretçilerimizin ve müşterilerimizin gizliliğini
        korumayı taahhüt ederiz. Bu politika, web sitemiz üzerinden toplanan
        kişisel verilerin nasıl işlendiğini açıklar.
      </p>

      <h2>2. Toplanan Veriler</h2>
      <ul>
        <li>İletişim bilgileri (ad, e-posta, telefon, adres)</li>
        <li>Sipariş bilgileri (ürün, tutar, ödeme yöntemi)</li>
        <li>Teknik veriler (IP adresi, tarayıcı bilgisi, ziyaret zamanı)</li>
        <li>Çerezler (çerez politikası sayfasına bakınız)</li>
      </ul>

      <h2>3. Verilerin Kullanımı</h2>
      <p>Kişisel verileriniz aşağıdaki amaçlarla işlenir:</p>
      <ul>
        <li>Siparişlerin işlenmesi ve teslimatı</li>
        <li>Müşteri hizmetleri ve iletişim</li>
        <li>Kampanya ve bülten gönderimi (onay vermeniz halinde)</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
      </ul>

      <h2>4. Veri Paylaşımı</h2>
      <p>
        Kişisel verileriniz, sipariş teslimatı için kargo firmaları, ödeme işlemi
        için ödeme sağlayıcılar ve yasal zorunluluklar halinde yetkili kurumlar
        dışında üçüncü taraflarla paylaşılmaz.
      </p>

      <h2>5. KVKK Hakları</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki
        haklara sahipsiniz:
      </p>
      <ul>
        <li>Verilerinizin işlenip işlendiğini öğrenme</li>
        <li>İşlenen verilerinize erişme ve bunları talep etme</li>
        <li>Verilerinizin düzeltilmesini veya silinmesini isteme</li>
        <li>İşlemenin amacıyla sınırlı olarak aktarılmasını talep etme</li>
        <li>Verilerin yanlış işlenmesi halinde düzeltilmesini isteme</li>
      </ul>

      <h2>6. İletişim</h2>
      <p>
        Gizlilik politikası ile ilgili sorularınız için: info@dikeyyapaybahce.com
      </p>
    </LegalLayout>
  );
}
