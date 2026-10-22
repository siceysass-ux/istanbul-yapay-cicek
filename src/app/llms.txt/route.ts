import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const revalidate = 3600;

export async function GET() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const lines: string[] = [
    "# Çiçek Yapay (cicekyapay.com)",
    "",
    "> Çiçek Yapay Botanik ve Dekorasyon: 2019 yılından bu yana İstanbul Zeytinburnu atölyesinde gerçek doğal ahşap gövdeli yapay ağaç, tasarım saksılı bitki, kıvrımlı bonsai ve dev ayaklı vitrin çiçekleri üreten Türkiye geneli e-ticaret markası.",
    "",
    "## İşletme ve İletişim Bilgileri",
    "- **Ticari Unvan / İşletme:** Çiçek Yapay Botanik ve Dekorasyon",
    "- **Web Sitesi:** https://cicekyapay.com",
    "- **Kurumsal Dikey Bahçe Proje Sitesi:** https://dikeyyapaybahce.com",
    "- **Atölye ve Mağaza Adresi:** Nuripaşa Mah. Merve Cad. No:73/A, 34025 Zeytinburnu / İstanbul",
    "- **Telefon / WhatsApp:** +90 507 884 66 03",
    "- **E-posta:** info@cicekyapay.com",
    "- **Çalışma Saatleri:** Pazartesi – Cumartesi 09:00 – 18:00",
    "- **Kargo ve Teslimat:** 2.000 TL ve üzeri ücretsiz kargo; İstanbul içi 1-3 iş günü, Türkiye geneli 2-5 iş günü teslimat.",
    "- **Ödeme Seçenekleri:** iyzico güvencesiyle Kredi Kartı (Tek Çekim / 3 Taksit) ve İstanbul içi Kapıda Nakit Ödeme.",
    "- **İade Politikası:** Teslimattan itibaren 14 gün içinde kullanılmamış ve orijinal ambalajında iade hakkı.",
    "",
    "## Ana Kategoriler",
    ...categories.map((c) => `- [${c.name}](${SITE_URL}/kategori/${c.slug})`),
    "",
    "## Kurumsal ve Yasal Sayfalar",
    `- [Hakkımızda](${SITE_URL}/hakkimizda)`,
    `- [İletişim](${SITE_URL}/iletisim)`,
    `- [Mesafeli Satış Sözleşmesi](${SITE_URL}/sayfalar/mesafeli-satis-sozlesmesi)`,
    `- [İade ve Değişim Koşulları](${SITE_URL}/sayfalar/iade-kosullari)`,
    `- [KVKK Aydınlatma Metni](${SITE_URL}/sayfalar/kvkk-aydinlatma)`,
    `- [Gizlilik Politikası](${SITE_URL}/sayfalar/gizlilik-politikasi)`,
    `- [Çerez Politikası](${SITE_URL}/sayfalar/cerez-politikasi)`,
    `- [Google Merchant Ürün Feed (XML)](${SITE_URL}/feed/google.xml)`,
    "",
    `## Ürün Kataloğu (${products.length} Aktif Stüdyo Ürünü)`,
    ...products.map(
      (p) =>
        `- [${p.name}](${SITE_URL}/urun/${p.slug}) — ${(p.discountPrice ?? p.basePrice).toLocaleString("tr-TR")} TL (${p.category.name}, SKU: ${p.sku}): ${p.shortDesc}`
    ),
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
