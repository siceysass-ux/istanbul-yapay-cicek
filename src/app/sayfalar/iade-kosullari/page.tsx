import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "İade Koşulları" };

export default function IadeKosullariPage() {
  return (
    <LegalLayout title="İade Koşulları" updatedAt="Eylül 2026">
      <h2>1. Cayma Hakkı</h2>
      <p>
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği kapsamında, ürünü teslim aldığınız tarihten itibaren
        <strong> 14 gün içinde</strong> koşulsuz olarak cayma hakkınızı
        kullanabilirsiniz.
      </p>

      <h2>2. İade Şartları</h2>
      <ul>
        <li>Ürün kullanılmamış, denenmemiş ve orijinal paketinde olmalıdır.</li>
        <li>Ürün faturası ile birlikte iade edilmelidir.</li>
        <li>Özel sipariş ve kişiye özel ürünlerde cayma hakkı kullanılamaz.</li>
        <li>Hijyenik ürünler (kesilmiş, açılmış) iade edilemez.</li>
      </ul>

      <h2>3. İade Süreci</h2>
      <ul>
        <li>İade talebi için info@dikeyyapaybahce.com adresine e-posta gönderin.</li>
        <li>Talebiniz onaylandıktan sonra iade adresi iletilecektir.</li>
        <li>Ürün bize ulaştıktan sonra 7 iş günü içinde iade işlemi tamamlanır.</li>
        <li>İade tutarı, ödemenin yapıldığı yönteme geri ödenir.</li>
      </ul>

      <h2>4. Kargo Ücreti</h2>
      <p>
        Cayma hakkı kapsamındaki iadelerde iade kargo ücreti Alıcı'ya aittir.
        Hatalı veya hasarlı ürün gönderiminde kargo ücreti Satıcı'ya aittir.
      </p>

      <h2>5. Hasarlı/Yanlış Ürün</h2>
      <p>
        Hasarlı veya yanlış ürün teslim alırsanız, teslimattan itibaren 3 gün
        içinde bize bildirin. Kargo firması ile süreci biz yönetiriz ve ücretsiz
        değiştirme sağlarız.
      </p>

      <h2>6. İletişim</h2>
      <p>
        İade talepleri için: info@dikeyyapaybahce.com · 0(507) 884 66 03
      </p>
    </LegalLayout>
  );
}
