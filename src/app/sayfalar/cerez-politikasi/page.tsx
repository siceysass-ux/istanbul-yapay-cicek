import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Çerez Politikası" };

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Çerez Politikası" updatedAt="Eylül 2026">
      <h2>1. Çerez Nedir?</h2>
      <p>
        Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük
        metin dosyalarıdır. Bu dosyalar sitenin daha iyi çalışmasını sağlar.
      </p>

      <h2>2. Kullandığımız Çerezler</h2>
      <ul>
        <li><strong>Zorunlu:</strong> Sepet, oturum, güvenlik (kapatılamaz)</li>
        <li><strong>Performans:</strong> Ziyaret analizi, sayfa görüntüleme</li>
        <li><strong>Fonksiyonel:</strong> Dil tercihleri, favoriler</li>
        <li><strong>Pazarlama:</strong> Reklam kişiselleştirme (onay ile)</li>
      </ul>

      <h2>3. Çerez Yönetimi</h2>
      <p>
        Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz.
        Zorunlu çerezler hariç, diğer çerezler için onayınız alınır.
      </p>

      <h2>4. Üçüncü Taraf Çerezleri</h2>
      <p>
        Analitik ve pazarlama amaçlı olarak üçüncü taraf hizmet sağlayıcıların
        çerezleri kullanılabilir. Bu çerezler kendi gizlilik politikalarına tabidir.
      </p>

      <h2>5. İletişim</h2>
      <p>
        Çerez politikası ile ilgili sorularınız: info@dikeyyapaybahce.com
      </p>
    </LegalLayout>
  );
}
