import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "KVKK Aydınlatma Metni" };

export default function KvkkPage() {
  return (
    <LegalLayout title="KVKK Aydınlatma Metni" updatedAt="Eylül 2026">
      <h2>1. Veri Sorumlusu</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında,
        kişisel verileriniz aşağıda belirtilen kapsamda işlenmektedir.
      </p>
      <ul>
        <li><strong>Veri Sorumlusu:</strong> İstanbul Yapay Çiçek</li>
        <li><strong>Adres:</strong> Nuripaşa Mah. Merve Cad. No:73/A, Zeytinburnu / İstanbul</li>
        <li><strong>İletişim:</strong> info@dikeyyapaybahce.com · 0(507) 884 66 03</li>
      </ul>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li>Kimlik bilgileri (ad, soyad)</li>
        <li>İletişim bilgileri (e-posta, telefon, adres)</li>
        <li>Finansal bilgiler (sipariş tutarı, ödeme yöntemi)</li>
        <li>Tercih ve işlem geçmişi (siparişler, favoriler, ziyaret)</li>
      </ul>

      <h2>3. İşleme Amaçları</h2>
      <ul>
        <li>Üyelik ve sipariş süreçlerinin yürütülmesi</li>
        <li>Ürün teslimatı ve kargo takibi</li>
        <li>Müşteri hizmetleri ve şikayet yönetimi</li>
        <li>Kampanya ve bülten (açık rıza alınması halinde)</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
      </ul>

      <h2>4. Verilerin Aktarımı</h2>
      <p>
        Kişisel verileriniz; kargo firmaları, ödeme sağlayıcılar, hosting ve
        yazılım hizmeti aldığımız tedarikçiler ile yasal zorunluluk halinde
        yetkili kamu kurumları ile paylaşılabilir.
      </p>

      <h2>5. Veri Saklama Süresi</h2>
      <p>
        Kişisel verileriniz, ilgili yasal süreler ve işleme amacının gerektirdiği
        süre boyunca saklanır. Süre bitiminde güvenli şekilde imha edilir.
      </p>

      <h2>6. Haklarınız</h2>
      <p>KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
      <ul>
        <li>Verilerinizin işlenip işlendiğini öğrenme</li>
        <li>İşlenen verilerinize erişme</li>
        <li>Verilerinizin silinmesini veya düzeltilmesini isteme</li>
        <li>İşlenen verilerin aktarılmasını talep etme</li>
        <li>İşlemenin münhasır otomatik sistemlerle yapılmasına itiraz etme</li>
      </ul>
      <p>
        Haklarınızı kullanmak için info@dikeyyapaybahce.com adresine başvurabilirsiniz.
      </p>
    </LegalLayout>
  );
}
