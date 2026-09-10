import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Mesafeli Satış Sözleşmesi" };

export default function MesafeliSatisPage() {
  return (
    <LegalLayout title="Mesafeli Satış Sözleşmesi" updatedAt="Eylül 2026">
      <h2>1. Taraflar</h2>
      <p>
        İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), aşağıda bilgileri yer alan
        Satıcı ile alışveriş sırasında bilgileri alınan Alıcı arasında akdedilmiştir.
      </p>
      <ul>
        <li><strong>Satıcı:</strong> İstanbul Yapay Çiçek</li>
        <li><strong>Adres:</strong> Nuripaşa Mah. Merve Cad. No:73/A, Zeytinburnu / İstanbul</li>
        <li><strong>Telefon:</strong> 0(507) 884 66 03</li>
        <li><strong>E-posta:</strong> info@dikeyyapaybahce.com</li>
      </ul>

      <h2>2. Konu</h2>
      <p>
        Sözleşme, Satıcı'nın web sitesi üzerinden sunduğu yapay çiçek, yapay ağaç,
        dikey bahçe ve ilgili ürünlerin Alıcı tarafından satın alınmasına ilişkin
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği kapsamındaki hak ve yükümlülükleri düzenler.
      </p>

      <h2>3. Genel Hükümler</h2>
      <ul>
        <li>Alıcı, siparişini web sitesi üzerinden elektronik ortamda verir.</li>
        <li>Satıcı, sipariş onayını elektronik posta ile iletir.</li>
        <li>Ürünler, ödemenin alınmasından sonra 1-3 iş günü içinde kargoya verilir.</li>
        <li>Teslimat süresi İstanbul içi 1-3 iş günü, diğer iller 2-5 iş günüdür.</li>
        <li>Kargo ücreti Alıcı'ya aittir. 2.000₺ ve üzeri siparişlerde kargo ücretsizdir.</li>
      </ul>

      <h2>4. Ödeme</h2>
      <p>
        Ödeme; kredi kartı veya kapıda ödeme yöntemleri ile yapılabilir. Kredi kartı
        ile yapılan ödemelerde kart bilgileri sitemizde saklanmaz, ödeme sağlayıcı
        üzerinden güvenli şekilde işlenir.
      </p>

      <h2>5. Cayma Hakkı</h2>
      <p>
        Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde herhangi bir
        sebep belirtmeksizin cayma hakkını kullanabilir. Cayma hakkının kullanımı
        için ürünün kullanılmamış, orijinal paketinde ve iade edilebilir durumda
        olması gereklidir.
      </p>

      <h2>6. Garanti</h2>
      <p>
        Ürünlerimiz 1. kalite malzemeden üretilmiştir. Üretim hatalarına karşı
        2 yıl garanti süresi uygulanır. Kullanım hatasından kaynaklanan hasarlar
        garanti kapsamı dışındadır.
      </p>

      <h2>7. Uyuşmazlık Çözümü</h2>
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda İstanbul Tüketici Hakem Heyeti ve
        İstanbul Mahkemeleri yetkilidir.
      </p>
    </LegalLayout>
  );
}
