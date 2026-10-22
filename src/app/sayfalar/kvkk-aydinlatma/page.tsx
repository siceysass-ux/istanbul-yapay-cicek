import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında Çiçek Yapay veri sorumlusu kimliği, işlenen kişisel veriler ve haklarınız.",
  alternates: { canonical: `${SITE_URL}/sayfalar/kvkk-aydinlatma` },
  openGraph: {
    title: "KVKK Aydınlatma Metni — Çiçek Yapay",
    description:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında Çiçek Yapay aydınlatma metni.",
    url: `${SITE_URL}/sayfalar/kvkk-aydinlatma`,
  },
};

export default function KvkkPage() {
  return (
    <LegalLayout title="KVKK Aydınlatma Metni" updatedAt="Ekim 2026">
      <h2>1. Veri Sorumlusunun Kimliği</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca kişisel
        verileriniz, veri sorumlusu sıfatıyla aşağıda bilgileri bulunan işletmemiz tarafından
        işlenmektedir:
      </p>
      <ul>
        <li><strong>Veri Sorumlusu Unvanı:</strong> Çiçek Yapay Botanik ve Dekorasyon</li>
        <li><strong>Adres:</strong> Nuripaşa Mah. Merve Cad. No:73/A, 34025 Zeytinburnu / İstanbul</li>
        <li><strong>Telefon:</strong> 0(507) 884 66 03</li>
        <li><strong>E-posta:</strong> info@cicekyapay.com</li>
      </ul>

      <h2>2. İşlenen Kişisel Verileriniz</h2>
      <ul>
        <li><strong>Kimlik ve Fatura Bilgileri:</strong> Ad, soyad, TCKN (bireysel fatura için), firma unvanı, vergi dairesi ve VKN (kurumsal fatura için).</li>
        <li><strong>İletişim Bilgileri:</strong> Telefon numarası, e-posta adresi, teslimat ve fatura adresi (il/ilçe).</li>
        <li><strong>Müşteri İşlem Bilgileri:</strong> Sipariş numarası, sepet içeriği, sipariş tutarı, ödeme yöntemi ve talep/şikayet kayıtları.</li>
        <li><strong>İşlem Güvenliği ve Pazarlama Verileri:</strong> IP adresi, çerez tercih kaydı, açık rıza verilmesi halinde reklam ve dönüşüm ölçüm verileri.</li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepleri</h2>
      <ul>
        <li>Mesafeli satış sözleşmesinin kurulması ve ifası (KVKK m. 5/2-c),</li>
        <li>E-fatura/e-arşiv fatura düzenlenmesi ve vergi mevzuatı yükümlülüklerinin yerine getirilmesi (KVKK m. 5/2-ç),</li>
        <li>Siparişlerin kargo ile teslimi, müşteri destek süreçlerinin yürütülmesi (KVKK m. 5/2-f),</li>
        <li>Açık rızanızın bulunması halinde dijital pazarlama ve reklam performans analizi (KVKK m. 5/1).</li>
      </ul>

      <h2>4. Kişisel Verilerin Aktarıldığı Taraflar</h2>
      <p>Kişisel verileriniz, yukarıdaki amaçlarla sınırlı olmak üzere:</p>
      <ul>
        <li>Ödeme tahsilatı için <strong>iyzico Ödeme Hizmetleri A.Ş.</strong>&apos;ye,</li>
        <li>Ürün teslimatı için anlaşmalı kargo şirketlerine (<strong>Yurtiçi Kargo, Aras Kargo, MNG Kargo</strong>),</li>
        <li>E-posta/SMS bilgilendirmeleri için <strong>Resend</strong> ve <strong>Netgsm</strong> altyapısına,</li>
        <li>Sunucu barındırma hizmeti için <strong>Hostinger International Ltd.</strong>&apos;ye,</li>
        <li>Çerez onayınız (Kabul Et) bulunması halinde reklam dönüşüm ölçümü amacıyla <strong>Google Ireland Limited (Google Ads / GA4)</strong> ve <strong>Meta Platforms Ireland Limited (Meta Pixel)</strong> sistemlerine aktarılabilmektedir.</li>
      </ul>

      <h2>5. KVKK Madde 11 Kapsamındaki Haklarınız ve Başvuru</h2>
      <p>
        KVKK&apos;nın 11. maddesi uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme,
        düzeltilmesini veya silinmesini talep etme ve zarara uğramanız halinde tazminat isteme
        haklarına sahipsiniz. Taleplerinizi yazılı olarak{" "}
        <em>Nuripaşa Mah. Merve Cad. No:73/A, Zeytinburnu / İstanbul</em> adresimize elden/noter
        kanalıyla veya <strong>info@cicekyapay.com</strong> e-posta adresimize iletebilirsiniz.
      </p>
    </LegalLayout>
  );
}
