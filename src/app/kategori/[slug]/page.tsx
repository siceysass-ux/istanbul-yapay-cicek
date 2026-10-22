import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import { ProductCard } from "@/components/product/product-card";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const revalidate = 300;

const CATEGORY_SEO: Record<
  string,
  {
    metaDesc: string;
    introTitle: string;
    paragraphs: string[];
    faqs: { q: string; a: string }[];
  }
> = {
  "yapay-agac": {
    metaDesc:
      "Gerçek doğal ahşap gövdeli yapay zeytin ağacı, bambu, benjamin, monstera ve starliçe modelleri. Saksılı tam boy, bakım gerektirmeyen 1. sınıf yapay ağaçlar.",
    introTitle: "Doğal Ahşap Gövdeli Yapay Ağaç Koleksiyonu",
    paragraphs: [
      "Çiçek Yapay atölyesinde hazırlanan yapay ağaç modelleri; fırınlanmış gerçek doğal ağaç gövdeleri ve ıslak dokulu (real-touch) birinci sınıf yaprak teknolojisiyle üretilir. Zeytin ağacından gerçek kamış gövdeli bambuya, alacalı Ficus Benjamin'den tropikal Starliçe ve Monstera modellerine kadar tüm ağaçlarımız kendi saksısı ve doğal yosun/taş taban detayıyla kullanıma hazır olarak teslim edilir.",
      "Güneş ışığı, sulama, budama veya ilaçlama gerektirmeyen yapay ağaçlarımız; salon, antre ve kış bahçelerinin yanı sıra otel lobileri, yönetici ofisleri, restoranlar, klinikler ve mağaza vitrinlerinde dört mevsim ilk günkü formunu korur.",
    ],
    faqs: [
      {
        q: "Yapay ağaçların gövdesi gerçek ahşap mı?",
        a: "Evet. Zeytin, benjamin, söğüt ve araokarya gibi modellerimizde fırınlanmış gerçek doğal ahşap gövdeler; bambu modellerimizde ise gerçek doğal bambu kamışları kullanılmaktadır.",
      },
      {
        q: "Mekanım için hangi boy yapay ağacı seçmeliyim?",
        a: "Standart daire ve ofis tavan yüksekliği (260–280 cm) için 150 cm ile 185 cm arasındaki modellerimiz en dengeli görünümü sağlar. Konsol yanı veya dar köşeler için 120–150 cm modeller tercih edilebilir.",
      },
      {
        q: "Yapay ağaçların temizliği ve bakımı nasıl yapılır?",
        a: "Sulama veya gübreleme gerektirmez. Yaprak yüzeyinde birikebilecek tozları ayda bir kez hafif nemli mikrofiber bezle veya soğuk fön havasıyla kolayca temizleyebilirsiniz.",
      },
      {
        q: "Ürünler görseldeki saksısıyla birlikte mi gönderiliyor?",
        a: "Evet, tüm ürünlerimiz ürün fotoğrafında gördüğünüz saksısı ve tabanındaki doğal yosun veya dekoratif çakıl taşı dolgusuyla birlikte tek parça halinde gönderilir.",
      },
      {
        q: "Otel, ofis ve kafe projeleri için kurumsal fatura kesiliyor mu?",
        a: "Evet, tüm siparişlerimizde bireysel veya kurumsal e-fatura düzenlenir. Çoklu adetli kurumsal alımlar için WhatsApp hattımızdan proje teklifi alabilirsiniz.",
      },
    ],
  },
  "yapay-cicek": {
    metaDesc:
      "Doğal ahşap gövdeli yapay bahar dalı (sakura), sarkık begonvil, beyaz salkım (wisteria) ve çiçekli ağaç modelleri. Solmayan ipek dokulu dekoratif çiçekler.",
    introTitle: "İpek Dokulu Çiçekli Yapay Ağaçlar ve Bahar Dalları",
    paragraphs: [
      "Yapay çiçek ve çiçekli ağaç koleksiyonumuz; pudra pembe ve beyaz Sakura (kiraz çiçeği) ağaçları, fuşya ve kırmızı sarkık begonviller, beyaz salkım (Wisteria) ağaçları ve şeftali çiçeği modellerinden oluşur. Gerçek ahşap gövde üzerine el işçiliğiyle uygulanan yoğun çiçek dalları mekanlara ferah ve prestijli bir atmosfer kazandırır.",
      "Özellikle kafe, restoran, güzellik merkezi, butik, düğün ve etkinlik alanları ile salon dekorasyonunda tercih edilen çiçekli ağaçlarımız mevsimden bağımsız olarak yıl boyu çiçek açmış görünümünü korur.",
    ],
    faqs: [
      {
        q: "Yapay çiçekli ağaçların yaprak ve çiçekleri dökülür mü?",
        a: "Hayır. İpek dokulu kumaş çiçekler ve yapraklar yüksek mukavemetli gövde dallarına sabitlenmiştir; iç mekan kullanımında dökülme veya solma yapmaz.",
      },
      {
        q: "Dallarını teslim aldıktan sonra şekillendirebilir miyiz?",
        a: "Evet, kargo sürecinde zarar görmemesi için toplanarak paketlenen dalların içindeki çelik tel yapısı sayesinde dalları dilediğiniz genişlikte açıp şekillendirebilirsiniz.",
      },
      {
        q: "Hangi mekanlarda kullanıma uygundur?",
        a: "Ev salonları, restoran ve kafe girişleri, otel lobileri, klinik bekleme salonları, mağaza vitrinleri ve fotoğraf çekim alanları için idealdir.",
      },
      {
        q: "Kargo süresi ve paketleme nasıldır?",
        a: "Siparişleriniz darbeye dayanıklı özel uzun koli içerisinde 1-3 iş günü içinde kargoya verilir. 2.000₺ üzeri siparişlerde kargo ücretsizdir.",
      },
    ],
  },
  saksi: {
    metaDesc:
      "Tasarım saksılı yapay bitkiler, kıvrımlı çam ve sedir bonsai ağaçları, geometrik origami ve taş dokulu saksıda şeflera ve philodendron modelleri.",
    introTitle: "Tasarım Saksılı Yapay Bitkiler ve Bonsai Koleksiyonu",
    paragraphs: [
      "Saksılı bitkiler ve bonsai koleksiyonumuz; beyaz geometrik origami saksılar, uzun konik antrasit taş dokulu saksılar, petek dokulu küre saksılar ve oluklu silindir saksılar içinde sunulan özel tasarım modellerden oluşur. Kıvrımlı gövdeli Japon çamı ve sedir bonsai ağaçları ile Şeflera, Monstera ve Philodendron Selloum bitkileri modern mimari mekanlar için tasarlanmıştır.",
      "Ekstra saksı arayışına gerek kalmadan, tabanındaki beyaz dolomit taşları veya doğal yosun kaplamasıyla doğrudan salon, makam odası, toplantı salonu veya antreye yerleştirilmeye hazırdır.",
    ],
    faqs: [
      {
        q: "Bonsai ve saksılı bitkiler dış saksısıyla birlikte mi gelir?",
        a: "Evet, bu kategorideki tüm ürünler görselde yer alan özel tasarım saksısı (origami, taş dokulu, küre veya oluklu saksı) ile birlikte gönderilir.",
      },
      {
        q: "Yönetici ofisi ve makam odası için hangi modelleri önerirsiniz?",
        a: "Gri asimetrik taş saksıda kıvrımlı çam bonsai, beyaz küre saksıda bordo çam bonsai ve uzun antrasit saksıda ardıç bonsai modellerimiz kurumsal ofislerde en çok tercih edilen ürünlerimizdir.",
      },
      {
        q: "Saksılar devrilmeye karşı dengeli midir?",
        a: "Evet, tüm saksılı ürünlerimizde bitki boyuna ve ağırlık merkezine uygun taban ağırlığı ve sabitleme dolgusu kullanılmaktadır.",
      },
      {
        q: "İade ve değişim koşulları nelerdir?",
        a: "Ürünü teslim aldığınız tarihten itibaren 14 gün içinde kullanılmamış ve orijinal ambalajında olmak kaydıyla iade veya değişim hakkınızı kullanabilirsiniz.",
      },
    ],
  },
  "dev-cicekler": {
    metaDesc:
      "Dev ayaklı dekoratif şakayık (peony), gül, kamelya, lotus ve gelincik çiçekleri. Vitrin, düğün, organizasyon ve sahne dekorasyonu için 165-175 cm dev çiçekler.",
    introTitle: "Dev Ayaklı Dekoratif Vitrin ve Organizasyon Çiçekleri",
    paragraphs: [
      "165 cm ile 175 cm yüksekliğe sahip dev ayaklı dekoratif çiçek koleksiyonumuz; katmerli pudra pembe şakayık (Peony), somon pembe gül ve kamelya, altın damarlı kırmızı gelincik ve altın uçlu krem lotus modellerinden oluşur. Bağımsız durabilen dengeli metal kaidesi ve şekillendirilebilir kıvrımlı gövdesiyle kurulum gerektirmeden her zeminde güvenle kullanılır.",
      "Mağaza vitrin tasarımları, düğün ve nişan organizasyonları, otel lobileri, etkinlik sahneleri, güzellik merkezleri ve fotoğraf platolarında güçlü bir görsel odak noktası oluşturur.",
    ],
    faqs: [
      {
        q: "Dev ayaklı çiçekler kendi başına ayakta durabiliyor mu?",
        a: "Evet, her ürünün altında dairesel dengeli metal taban kaidesi bulunur; duvara sabitlemeye gerek kalmadan düz zeminde dengeli şekilde durur.",
      },
      {
        q: "Gövde yüksekliği ve eğimi ayarlanabilir mi?",
        a: "Kıvrımlı gövde yapısı sayesinde çiçeğin bakış açısını ve duruş formunu mekanınıza göre hafifçe yönlendirebilirsiniz.",
      },
      {
        q: "Organizasyon ve vitrin kullanımları için toplu sipariş verebilir miyiz?",
        a: "Evet, vitrin ve organizasyon firmaları için çoklu adetlerde kurumsal faturalı satışımız ve toplu alım tekliflerimiz mevcuttur.",
      },
      {
        q: "Teslimat süresi kaç gündür?",
        a: "Stoktaki dev çiçek modellerimiz 1-3 iş günü içinde korumalı koliyle kargoya teslim edilir; İstanbul içi 1-3, diğer iller 2-5 iş gününde ulaştırılır.",
      },
    ],
  },
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  // P1-3: Olmayan kategoride gerçek HTTP 404 döndür
  if (!category) {
    notFound();
  }

  const pageNum = Number(query.page ?? "1");
  const isPaginated = Number.isInteger(pageNum) && pageNum > 1;
  // P1-1: Her kategori sayfası (ve ?page=2) kendi URL'sine canonical verir
  const canonicalUrl = isPaginated
    ? `${SITE_URL}/kategori/${category.slug}?page=${pageNum}`
    : `${SITE_URL}/kategori/${category.slug}`;

  const seoInfo = CATEGORY_SEO[category.slug];
  const description =
    seoInfo?.metaDesc ??
    `${category.name} koleksiyonundaki doğal gövdeli yapay ağaç, saksılı bitki ve dekoratif yapay çiçek modelleri. 2.000₺ üzeri ücretsiz kargo.`;
  const pageTitle = isPaginated
    ? `${category.name} (Sayfa ${pageNum})`
    : `${category.name} Modelleri ve Fiyatları`;

  return {
    title: pageTitle,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${pageTitle} — Çiçek Yapay`,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} — Çiçek Yapay`,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const requestedPage = Number(query.page ?? "1");
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const categoryIds = [category.id, ...category.children.map((child) => child.id)];
  const { products, total } = await getProductsByCategory(categoryIds, page);
  const totalPages = Math.ceil(total / 12);
  const seoInfo = CATEGORY_SEO[category.slug];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Anasayfa", url: SITE_URL },
          { name: category.name, url: `${SITE_URL}/kategori/${category.slug}` },
        ]}
      />
      {seoInfo && <FaqJsonLd faqs={seoInfo.faqs} />}

      {/* Kompakt Üst Başlık & Breadcrumb */}
      <div className="mb-6 flex flex-col gap-3 border-b border-primary/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="mb-1.5 flex items-center gap-1 text-xs text-muted">
            <Link href="/" className="hover:text-accent transition-colors">Anasayfa</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-ink font-medium">{category.name}</span>
          </nav>
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
              {category.name}
            </h1>
            <span className="rounded-full bg-primary/8 px-3 py-0.5 text-xs font-medium text-ink">
              {total} ürün
            </span>
          </div>
        </div>

        {/* Hızlı kategori geçiş hapları */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: "Yapay Ağaçlar", slug: "yapay-agac" },
            { label: "Yapay Çiçekler", slug: "yapay-cicek" },
            { label: "Saksılı Bitkiler", slug: "saksi" },
            { label: "Dev Çiçekler", slug: "dev-cicekler" },
          ].map((cat) => {
            const isCurrent = cat.slug === slug;
            return (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-accent text-white shadow-xs"
                    : "border border-primary/15 bg-white text-ink/80 hover:border-accent hover:text-accent"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Ürünler — Tam genişlik 4 sütun vitrin */}
      <div>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-primary/20 py-20 text-center">
            <p className="font-serif text-xl">Bu kategoride ürün bulunamadı</p>
            <p className="mt-2 text-sm text-muted">Yakında yeni ürünler eklenecek</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} imagePriority={i < 8} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Ürün sayfaları">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={pageNumber === 1 ? `/kategori/${slug}` : `/kategori/${slug}?page=${pageNumber}`}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors ${
                      pageNumber === page
                        ? "border-accent bg-accent text-white"
                        : "border-primary/15 bg-white hover:border-accent hover:text-accent"
                    }`}
                    aria-current={pageNumber === page ? "page" : undefined}
                  >
                    {pageNumber}
                  </Link>
                ))}
              </nav>
            )}
          </>
        )}
      </div>

      {/* P3-4: Kategori Rehber İçeriği & Sıkça Sorulan Sorular (GEO/AEO & SEO Bölümü) */}
      {seoInfo && (
        <section className="mt-16 space-y-10 border-t border-primary/10 pt-12">
          <div className="max-w-4xl space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              {seoInfo.introTitle}
            </h2>
            {seoInfo.paragraphs.map((p, idx) => (
              <p key={idx} className="text-sm leading-relaxed text-ink/75">
                {p}
              </p>
            ))}
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-ink mb-4">
              {category.name} Hakkında Sıkça Sorulan Sorular
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {seoInfo.faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-primary/10 bg-cream-dark/50 p-5"
                >
                  <h3 className="font-serif text-base font-semibold text-ink">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink/75">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
