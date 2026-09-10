# 🌿 DİKEY YAPAY ÇİÇEK — E-TİCARET PLATFORMU
## Detaylı Teknik & Tasarım Planı (2026 Modern Stack)

> Sürüm: 1.0 · Tarih: 2026-09-02
> Hedef: Rakip sitelerden (`yapaycicekdeposu.com`, `yapaycicekal.com`) **teknolojik olarak üstün**, görsel olarak **şaşırtıcı, ahenkli ve akıcı** bir premium yapay çiçek / dikey bahçe e-ticaret deneyimi.

---

## 1. RAKİP ANALİZİ

### 1.1 yapaycicekdeposu.com
| Özellik | Durum |
|---|---|
| Teknoloji | Klasik PHP tabanlı hazır e-ticaret altyapısı (muhtemelen Opencart/İdeasoft) |
| Ürün sayısı | ~1507 ürün |
| Kategoriler | Yapay Çiçekler, Yapay Ağaçlar, Demet Çiçekler, Gelin Buketi, Yapay Bitkiler, Sarmaşıklar, Kuru Çiçek, Saksı |
| Tasarım | Geleneksel, çok kategori, yoğun menü, mobil deneyim zayıf |
| Filtreleme | Marka, model, varyant, fiyat, stok, indirim, yeni |
| Eksiklikler | Görsel hikaye anlatımı yok, animasyon yok, modern mikro-etkileşim yok, yavaş, SEO zayıf |

### 1.2 yapaycicekal.com
| Özellik | Durum |
|---|---|
| Teknoloji | Shopify benzeri modern SaaS e-ticaret |
| Odak | Yapay ağaç, dikey bahçe, **projeler & referanslar** (B2B ağırlıklı) |
| Kategoriler | Yapay Ağaç, Yapay Çiçekler, Sarmaşık, Duvar Panelleri, Tag Çiçeği, Güller, Yapraklar, Saksı |
| Güçlü yönler | Proje/referans vurgusu, "Dikey Bahçe" konsepti, varyant (renk/beden) sistemi, taksit, hızlı bakış |
| Eksiklikler | 3D/AR yok, kişiselleştirme yok, görsel şölen sınırlı, içerik hızı düşük |

### 1.3 BİZİM FARKIMIZ (USP)
- 🎬 **Sinematik hero** + scroll-driven storytelling (GSAP ScrollTrigger)
- 🪄 **3D ürün önizleme** (React Three Fiber) — çiçekleri 360° döndürme
- 🕶️ **AR deneyim** (WebXR / model-viewer) — çiçeği odanda gör
- 🎨 **AI renk & mekan önerisi** — "Mekanına uygun çiçek" sihirbazı
- 🌊 **Akışkan mikro-etkileşimler** (Framer Motion + Lenis smooth scroll)
- 📱 **Mobil-first premium** deneyim
- ⚡ **Edge-rendered** (Next.js 15 App Router + Turbopack)
- 🔍 **AI destekli arama** (semantik, görsel arama)

---

## 2. TEKNOLOJİ STACK'İ (2026 GÜNCEL)

### 2.1 Frontend
| Katman | Teknoloji | Neden |
|---|---|---|
| Framework | **Next.js 15** (App Router, RSC, Turbopack) | Edge rendering, SEO, dosya-tabanlı routing |
| Dil | **TypeScript 5.7** | Tip güvenliği |
| Stil | **Tailwind CSS v4** + **CSS Modules** (karmaşık animasyonlar için) | Atomic CSS, hızlı |
| UI Kit | **shadcn/ui** (Radix tabanlı) + **Ark UI** (state machine) | Erişilebilir, headless |
| Animasyon | **Framer Motion 12** + **GSAP 3.13** (ScrollTrigger) + **Lenis** (smooth scroll) | Sinematik akış |
| 3D / AR | **React Three Fiber 9** + **@react-three/drei** + **@google/model-viewer** | 3D ürün & AR |
| Form & Validasyon | **React Hook Form** + **Zod 4** | Tip-güvenli şemalar |
| Veri çekme | **TanStack Query 5** + **Server Actions** | Cache, optimistic UI |
| State | **Zustand 5** (sepet, UI) + **Jotai** (atomik) | Hafif, ölçekbilir |
| İkon | **Lucide React** + **Iconify** | Geniş set |
| Bildirim | **Sonner** (toast) | Modern |

### 2.2 Backend & Veri
| Katman | Teknoloji | Neden |
|---|---|---|
| API | **Next.js Route Handlers** + **Server Actions** | Tek kod tabanı |
| Veritabanı | **PostgreSQL 17** (Neon / Supabase) | İlişkisel, JSONB, full-text |
| ORM | **Prisma 6** | Tip-güvenli, migrate |
| Auth | **Auth.js (NextAuth) 5** + **Passkey/WebAuthn** | Şifresiz giriş |
| Ödeme | **Iyzico** (TR) + **Stripe** (intl) | Taksit, kapıda ödeme |
| Arama | **Meilisearch** (hosted) + **pgvector** (semantic) | Hızlı + AI arama |
| Dosya/CDN | **Cloudflare R2** + **Cloudflare Images** | Ucuz, hızlı, AVIF/WebP |
| Email | **Resend** + **React Email** | Tasarım şablonlu |
| SMS | **Netgsm** | Sipariş bildirimi |
| Cache | **Upstash Redis** | Sepet, rate-limit |
| Analitik | **PostHog** + **Vercel Analytics** | Ürün analitiği, funnel |

### 2.3 Altyapı & DevOps
| Katman | Teknoloji |
|---|---|
| Hosting | **Vercel** (frontend) + **Neon/Supabase** (DB) |
| CI/CD | **GitHub Actions** + Vercel preview deployments |
| Paket yöneticisi | **pnpm 9** + **Turborepo** (monorepo) |
| Lint/Format | **Biome 2** (ESLint+Prettier yerine, tek araç) |
| Test | **Vitest 3** + **Playwright** (E2E) + **Storybook 8** |
| Monitoring | **Sentry** + **Vercel Speed Insights** |
| Secrets | **Doppler** |

### 2.4 İçerik & Yönetim
| Katman | Teknoloji |
|---|---|
| CMS (ürün/blog) | **Sanity Studio v3** (headless) veya **Payload CMS 3** (self-host) |
| Medya yönetimi | **Cloudflare Images** + otomatik AVIF dönüşümü |
| Blog/SEO | **MDX** (Next.js içinde) + **Contentlayer** alternatifi |

---

## 3. BİLGİ MİMARİSİ & URL YAPISI

```
/                          Anasayfa (sinematik hero + kategoriler + kampanyalar)
/kategori/[slug]           Kategori listeleme (filtre + sıralama)
/urun/[slug]               Ürün detay (3D, AR, varyant, yorumlar)
/koleksiyon/[slug]         Küratörlü koleksiyon (ör. "Bahar Rüzgarı")
/projeler                  Tamamlanan projeler (dikey bahçe, ofis yeşillendirme)
/proje/[slug]              Proje case study (galeri + before/after slider)
/kesif-talebi              B2B keşif formu
/toptan                     Toptan satış sayfası
/blog                       Blog & dekorasyon ipuçları
/blog/[slug]                Blog yazısı
/hakkimizda                 Kurumsal
/iletisim                   İletişim + harita
/mağazalar                  Fiziksel mağazalar
/sepet                      Sepet
/odeme                      Checkout (çok adımlı)
/hesabim/*                  Hesap (siparişler, adresler, favoriler, sadakat)
/siparis/[id]               Sipariş takibi
/kargo-takip                Kargo takip
/arama                       Arama sonuçları
/sitemap.xml, /robots.txt   SEO
```

---

## 4. VERİ MODELİ (Prisma Şeması Özeti)

```prisma
model Product {
  id            String   @id @default(cuid())
  slug          String   @unique
  name          String
  shortDesc     String
  description   String   @db.Text
  basePrice     Decimal  @db.Decimal(12,2)
  discountPrice Decimal? @db.Decimal(12,2)
  currency      String   @default("TRY")
  sku           String   @unique
  barcode       String?
  stock         Int      @default(0)
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  isActive      Boolean  @default(true)
  isFeatured    Boolean  @default(false)
  isNew         Boolean  @default(false)
  tags          String[]
  // İlişkiler
  category      Category @relation(fields: [categoryId], references: [id])
  categoryId    String
  brand         Brand?   @relation(fields: [brandId], references: [id])
  brandId       String?
  variants      Variant[]
  images        ProductImage[]
  model3dUrl    String?  // .glb dosyası (R2)
  arEnabled     Boolean  @default(false)
  reviews       Review[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@index([categoryId, isActive])
}

model Variant {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  type      String   // "color" | "size" | "saksı"
  name      String   // "Krem", "200 cm", "Gold Saksı"
  sku       String
  stock     Int
  priceDelta Decimal? @db.Decimal(12,2)
  image     String?
  @@index([productId])
}

model Category {
  id          String     @id @default(cuid())
  slug        String     @unique
  name        String
  parentId    String?
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  products    Product[]
  image       String?
  icon        String?
  order       Int        @default(0)
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  url       String  // Cloudflare Images
  alt       String
  width     Int
  height    Int
  order     Int     @default(0)
}

model Review {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  userId    String
  rating    Int      // 1-5
  title     String?
  body      String
  images    String[]
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Project {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  summary     String
  content     String   @db.Text
  location    String?
  coverImage  String
  gallery     String[]
  beforeAfter Json?    // [{before, after}]
  tags        String[]
  createdAt   DateTime @default(now())
}

model Order {
  id          String   @id @default(cuid())
  userId      String?
  status      OrderStatus
  items       Json
  subtotal    Decimal  @db.Decimal(12,2)
  shipping    Decimal  @db.Decimal(12,2)
  total       Decimal  @db.Decimal(12,2)
  address     Json
  paymentRef  String?
  cargoCode   String?
  createdAt   DateTime @default(now())
}

enum OrderStatus { PENDING PAID SHIPPED DELIVERED CANCELLED REFUNDED }
```

---

## 5. SAYFA SAYFA SECTION TASARIMI

### 5.1 ANASAYFA (`/`)

| # | Section | İçerik | Teknoloji / Etki |
|---|---|---|---|
| 1 | **Sinematik Hero** | Tam ekran video/3D arka plan (yapay çiçeklerin makro çekimi), parallax başlık "Doğanın Sonsuz Güzelliği, Sıfır Bakım", CTA "Koleksiyonu Keşfet" | GSAP ScrollTrigger + R3F 3D çiçek sahnesi + Lenis smooth scroll |
| 2 | **Announcement Bar** (sticky top) | Ücretsiz kargo >2000₺ · Kapıda ödeme · 1-3 iş günü teslim · Yeni üye %5 | Marquee animasyon (Framer Motion) |
| 3 | **Kategori Kartları** | 8 ana kategori (Yapay Çiçek, Ağaç, Demet, Gelin Buketi, Kuru Çiçek, Sarmaşık, Dikey Bahçe, Saksı) — hover'da 3D tilt + zoom | CSS perspective + Framer Motion tilt |
| 4 | **Öne Çıkan Ürünler** | Yatay scroll carousel, "Hızlı Bakış" modal, fiyat/indirim rozeti, sepete ekle (optimistic) | Embla Carousel + TanStack Query optimistic |
| 5 | **Sinematik Storytelling Bandı** | Scroll ile çiçek açma animasyonu (3D), metin fade-in: "4 mevsim güzellik", "Bakım gerektirmez", "Gerçek dokunuş hissi" | GSAP timeline + R3F morph |
| 6 | **Yeni Ürünler** | Grid, "YENİ" rozeti, 3D önizleme ikonu, AR ikonu | shadcn Card + R3F |
| 7 | **Koleksiyon Vitrini** | 3 küratörlü koleksiyon (Bahar Rüzgarı / Bohem Kuru / Lüks Ağaç) — büyük görsel + overlay | Parallax + clip-path reveal |
| 8 | **Projeler Showcase** | Dikey bahçe & ofis yeşillendirme projeleri, before/after slider | Image comparison slider (custom) |
| 9 | **AI Mekan Sihirbazı CTA** | "Mekanına uygun çiçeği bul" — interaktif widget | Form + AI öneri (OpenAI function calling) |
| 10 | **Müşteri Yorumları** | Carousel, yıldız, doğrulanmış rozet, müşteri fotoğrafları | Embla + PostHog A/B |
| 11 | **Blog/İlham Köşesi** | 3 son yazı (dekorasyon ipuçları) | MDX preview |
| 12 | **Marka Güvencesi** | Ücretsiz kargo, iade, taksit, kapıda ödeme — 4 ikon kart | Framer Motion stagger |
| 13 | **Newsletter** | E-posta kayıt + %5 indirim kuponu | React Hook Form + Resend |
| 14 | **Footer** | Kategoriler, kurumsal, müşteri hizmetleri, sosyal, ödeme yöntemleri, KVKK | Mega footer |

### 5.2 KATEGORİ LİSTELEME (`/kategori/[slug]`)

| Section | Detay |
|---|---|
| **Breadcrumb** | Anasayfa > Kategori > Alt kategori |
| **Kategori Hero** | Küçük banner + başlık + açıklama + ürün sayısı |
| **Filtre Sidebar** (sticky, mobilde drawer) | Alt kategori, varyant (renk/boyut), marka, fiyat range slider, stoktakiler, indirimli, yeni, boy (cm) |
| **Sıralama Bar** | Varsayılan, A-Z, Z-A, yeniden eskiye, fiyat artan/azalan, puana göre · tükenenleri gizle |
| **Ürün Grid** | Responsive (mobil 2, tablet 3, desktop 4) — hover: 2. görsel, hızlı bakış, favori, sepete ekle, 3D/AR rozeti |
| **Sayfalama / Infinite scroll** | IntersectionObserver ile infinite scroll + "Daha fazla" butonu |
| **SEO metni** | Kategori açıklaması (altta) |

### 5.3 ÜRÜN DETAY (`/urun/[slug]`)

| Section | Detay |
|---|---|
| **Galeri + 3D** | Sol: thumbnail galeri (zoom on hover) + "3D Gör" toggle (R3F 360° döndür) + "AR'da Dene" (model-viewer) |
| **Ürün Başlığı + Marka** | + SKU, kategori linki |
| **Yıldız Puanı** | + yorum sayısı (scroll to reviews) |
| **Fiyat** | Ana fiyat + indirimli fiyat + indirim % + taksit bilgisi |
| **Varyant Seçici** | Renk (renk swatch), Boyut (cm), Saksı tipi — stok durumu rozeti |
| **Miktar** | Stepper |
| **Sepete Ekle** | Büyük CTA + optimistic update + sepet drawer açılır |
| **Hızlı Teslimat Rozeti** | 1-3 iş günü |
| **Güvence İkonları** | Ücretsiz kargo, 14 gün iade, taksit, kapıda ödeme |
| **Sekmeler** | Açıklama / Özellikler (materyal, boy, ağırlık, UV koruma) / Kargo & İade / Yorumlar |
| **Yorumlar** | Yıldız dağılımı, filtre (pozitif/negatif/fotoğraflı), yazma formu, doğrulanmış alıcı rozeti, müşteri fotoğrafları lightbox |
| **İlgili Ürünler** | "Benzer Ürünler" + "Birlikte Alınanlar" carousel |
| **Yapay zeka önerisi** | "Bu ürünü sevenler şunları da beğendi" |

### 5.4 PROJELER (`/projeler`, `/proje/[slug]`)

| Section | Detay |
|---|---|
| **Hero** | "Mekanlara Nefes Katıyoruz" + scroll animasyonu |
| **Proje Grid** | Filtre (konum, tip, ölçek) + masonry layout |
| **Case Study** | Kapak, özet, meydan okuma, çözüm, galeri, before/after slider, müşteri testimonial, kullanılan ürünler (ürün linkleri) |

### 5.5 KEŞİF TALEBİ (`/kesif-talebi`) — B2B

| Section | Detay |
|---|---|
| **Form** | Ad, firma, telefon, e-posta, mekan tipi (ofis/kafe/otel/ev), m², fotoğraf yükleme, açıklama |
| **Süreç Adımları** | Talep → Ücretsiz keşif → 3D görselleştirme → Teklif → Uygulama |
| **Referans Logoları** | Anlaşmalı firmalar |

### 5.6 SEPET & CHECKOUT

| Adım | Detay |
|---|---|
| **Sepet Drawer** (sağdan slide) | Ürünler, miktar değiştir, kaldır, ara toplam, kargo hesabı (posta kodu), "Ödemeye Geç" |
| **Sepet Sayfası** | Detaylı liste + kupon kodu + teslimat tahmini + önerilen ek ürünler |
| **Checkout** | 1) Giriş/Kayık (misafir seçeneği) 2) Teslimat adresi 3) Kargo 4) Ödeme (Iyzico — kart/taksit/kapıda) 5) Özet & onay |
| **Sipariş Onay** | Sipariş no, tahmini teslimat, kargo takip linki, e-posta/SMS |

### 5.7 HESABIM

| Sekme | Detay |
|---|---|
| **Siparişlerim** | Liste + durum (timeline) + kargo takip + tekrar sipariş + fatura PDF |
| **Adreslerim** | CRUD, varsayılan adres |
| **Favorilerim** | Kaydedilen ürünler |
| **Sadakat Programı** | Puan, seviye, ödüller |
| **Yorumlarım** | Yazdığım yorumlar |
| **Ayarlar** | Profil, şifre/passkey, bildirim tercihleri, KVKK veri silme |

---

## 6. GÖRSEL & ANİMASYON SİSTEMİ

### 6.1 Renk Paleti (Doğal & Lüks)
```
--primary:    #2D5016  (derin orman yeşili)
--primary-2:  #6B8E4E  (adaçayı)
--accent:     #C9A96E  (altın kum)
--accent-2:   #E8B4B8  (tozlu gül)
--bg:         #FAF8F3  (sıcak krem)
--bg-dark:    #1A1F16  (koyu zemin — storytelling)
--text:       #1A1F16
--muted:      #6B7264
```

### 6.2 Tipografi
- **Başlık:** `Fraunces` (serif, optik boyut, lüks + doğal) — Google Fonts
- **Gövde:** `Inter` veya `Geist Sans` — modern, okunaklı
- **Dekoratif (az):** `Cormorant Garamond` — italik vurgular

### 6.3 Animasyon Prensipleri
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (expo out) — yumuşak, doğal
- **Süre:** 300-600ms mikro, 800-1200ms makro
- **Scroll-driven:** GSAP ScrollTrigger + Lenis (momentum scroll)
- **Mikro-etkileşim:** hover tilt, magnetic button, image reveal (clip-path), stagger list
- **3D:** R3F çiçek sahnesi (hero), ürün 360° viewer
- **Page transition:** Framer Motion `AnimatePresence` (slide + fade)
- **Reduced motion:** `prefers-reduced-motion` desteği zorunlu

### 6.4 Görsel Optimizasyon
- **Cloudflare Images:** otomatik AVIF/WebP, responsive `srcset`
- **Next.js `<Image>`:** blur placeholder, lazy, priority hero
- **Video:** kısa loop hero (mp4 + webm), `<video>` lazy autoplay muted
- **3D model:** `.glb` (Draco compression), lazy-load, fallback görsel

---

## 7. SEO & PERFORMANS

### 7.1 SEO
- App Router **Metadata API** + `generateMetadata` (dinamik başlık/açıklama/OG)
- **JSON-LD:** Product (fiyat, stok, rating), BreadcrumbList, Organization, FAQPage, Article
- **Sitemap:** `next-sitemap` otomatik (ürün/kategori/blog/proje)
- **Schema:** varyantlı ürünler için `Product` + `Offer` alt yapısı
- **Hreflang:** TR odaklı, opsiyonel EN
- **Core Web Vitals:** LCP <2.5s, INP <200ms, CLS <0.1
- **Semantik:** "yapay çiçek", "dikey bahçe", "yapay ağaç" — sayfa başına odak anahtar
- **Blog:** dekorasyon rehberleri (MDX) — içerik pazarlama

### 7.2 Performans
- **RSC (Server Components):** mümkün olduğunca server-side render
- **Code splitting:** dinamik import (R3F, AR, checkout)
- **Edge:** Vercel Edge fonksiyonları (arama, sepet)
- **Image:** Cloudflare Images + Next Image
- **Font:** `next/font` (self-host, display swap)
- **Bundle:** Turbopack + pnpm + tree shaking
- **Lighthouse:** 90+ hedef (tüm kategoriler)

---

## 8. ÖZELLİK MODÜLLERİ (FARK YARATAN)

| Modül | Açıklama |
|---|---|
| **3D Ürün Viewer** | R3F ile çiçek/ağaç 360° döndürme, zoom, varyant değişiminde model swap |
| **AR "Odanda Dene"** | model-viewer + WebXR — kamerada çiçek ölçekli göster |
| **AI Mekan Sihirbazı** | Kullanıcı mekan fotoğrafı + tarz seçer → AI uygun ürünleri önerir (OpenAI Vision + function calling) |
| **AI Semantik Arama** | "pembe gelin buketi" → vektör arama (pgvector) + Meilisearch fuzzy |
| **Görsel Arama** | Fotoğraf yükle → benzer çiçekleri bul (CLIP embedding) |
| **Kişiselleştirme** | Geçmiş görüntüleme + sepet → "Sana özel" anasayfa bölümü |
| **Sadakat Programı** | Puan kazanç, seviye (Bronz/Gümüş/Altın), doğum günü kuponu |
| **Canlı Stok** | Redis cache + optimistic UI |
| **Kargo Takip** | Entegre kargo API (Yurtiçi/Aras/MNG) + timeline UI |
| **Kapıda Ödeme** | İstanbul içi (rakip USP'si) |
| **Toptan Portal** | B2B fiyatlandırma, minimum adet, özel teklif |
| **Çoklu Dil** | i18n altyapısı (TR varsayılan, EN opsiyonel) |

---

## 9. GÜVENLİK & UYUMLULUK

- **KVKK/GDPR:** çerez onayı (Cookiebot/CookieConsent), veri silme talebi akışı
- **PCI:** ödeme Iyzico/Stripe hosted (kart verisi tutulmaz)
- **Rate limiting:** Upstash Redis (auth, ödeme, arama)
- **CSRF/XSS:** Next.js + Zod validation, CSP header
- **Bot koruması:** Cloudflare Turnstile (login, yorum, keşif formu)
- **Backup:** Neon point-in-time restore
- **Audit log:** admin işlemleri

---

## 10. GELİŞTİRME AŞAMALARI (FAZLAR)

### Faz 0 — Kurulum (1 hafta)
- pnpm + Turborepo monorepo iskeleti
- Next.js 15 + TS + Tailwind v4 + shadcn/ui
- Prisma + Neon PostgreSQL + şema migrate
- Biome, Vitest, Playwright, Storybook
- Vercel + GitHub Actions + preview deploy
- Cloudflare R2/Images + Upstash Redis kurulumu

### Faz 1 — Çekirdek E-ticaret (3-4 hafta)
- Veri modeli + seed (kategori, örnek ürün)
- Kategori listeleme + filtre + sıralama + infinite scroll
- Ürün detay (galeri, varyant, sepete ekle)
- Sepet drawer + sepet sayfası
- Checkout (Iyzico) + sipariş + kargo takip
- Auth (Auth.js + passkey)
- Hesabım (siparişler, adresler, favoriler)

### Faz 2 — Görsel Şölen (2-3 hafta)
- Sinematik hero (GSAP + R3F)
- Scroll storytelling bandı
- Kategori kartları (3D tilt)
- Koleksiyon vitrini (parallax)
- Page transitions + mikro-etkileşimler
- Lenis smooth scroll + reduced-motion

### Faz 3 — 3D & AR (2 hafta)
- Ürün 3D viewer (R3F) — örnek 5-10 üründe
- AR "Odanda Dene" (model-viewer)
- 3D model pipeline (görsel → glb)

### Faz 4 — İçerik & B2B (2 hafta)
- Projeler + case study + before/after slider
- Keşif talebi formu + B2B akış
- Toptan portal
- Blog (MDX) + SEO içerik

### Faz 5 — AI & Kişiselleştirme (2 hafta)
- AI mekan sihirbazı (Vision)
- Semantik + görsel arama (pgvector + CLIP)
- Kişiselleştirilmiş anasayfa
- Sadakat programı

### Faz 6 — Optimizasyon & Lansman (1-2 hafta)
- Lighthouse 90+ optimizasyon
- Core Web Vitals
- SEO (sitemap, schema, meta)
- E2E testler (Playwright)
- Sentry + PostHog
- Soft launch → full launch

---

## 11. KLASÖR YAPISI (Turborepo)

```
dikey-yapay-cicek/
├── apps/
│   └── web/                      # Next.js 15 uygulaması
│       ├── app/
│       │   ├── (shop)/           # E-ticaret route grubu
│       │   │   ├── page.tsx              # Anasayfa
│       │   │   ├── kategori/[slug]/      # Kategori
│       │   │   ├── urun/[slug]/          # Ürün detay
│       │   │   ├── koleksiyon/[slug]/
│       │   │   ├── sepet/
│       │   │   └── odeme/
│       │   ├── (marketing)/      # İçerik route grubu
│       │   │   ├── projeler/
│       │   │   ├── blog/
│       │   │   ├── hakkimizda/
│       │   │   └── iletisim/
│       │   ├── (b2b)/
│       │   │   ├── kesif-talebi/
│       │   │   └── toptan/
│       │   ├── hesabim/
│       │   ├── api/              # Route handlers
│       │   ├── layout.tsx
│       │   └── globals.css
│       ├── components/
│       │   ├── ui/               # shadcn/ui
│       │   ├── product/
│       │   ├── cart/
│       │   ├── three/            # R3F sahneler
│       │   └── marketing/
│       ├── lib/                  # utils, auth, payment
│       ├── hooks/
│       ├── stores/               # Zustand
│       ├── styles/
│       ├── public/
│       │   └── models/           # .glb 3D modeller
│       └── prisma/
│           └── schema.prisma
├── packages/
│   ├── ui/                       # Paylaşılan UI bileşenleri
│   ├── config/                   # ESLint, tsconfig, tailwind config
│   ├── types/                    # Paylaşılan TS tipleri
│   └── email/                    # React Email şablonları
├── sanity/                       # Sanity Studio (CMS)
├── .github/workflows/
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 12. KPI & BAŞARI ÖLÇÜTLERİ

| Metrik | Hedef |
|---|---|
| Lighthouse (Perf/A11y/SEO/BP) | 90+ |
| LCP | <2.5s |
| INP | <200ms |
| CLS | <0.1 |
| Dönüşüm oranı | >%2.5 |
| Sepetten çıkma | <%60 |
| Ort. sipariş değeri | rakipten +%15 |
| Mobil trafik oranı | >%70 (iyi deneyim) |
| Arama kullanım oranı | >%25 |

---

## 13. ADMİN PANEL (`/admin`) — GELİŞMİŞ YÖNETİM ARAYÜZÜ

> **Vizyon:** Sayfaya hükmeden, kapsamlı, modern bir "command center" arayüzü. Tek ekranda tüm operasyonu yönetmek mümkün. Rakiplerin basit panelinden **yıllar ötesinde** bir deneyim.

### 13.1 Admin Stack (Plan ana stack'ine ek)

| Katman | Teknoloji | Neden |
|---|---|---|
| Framework | **Next.js 15** (aynı app, `/admin` route grubu) | Tek kod tabanı, paylaşılan tipler |
| UI Kit | **shadcn/ui** + **Tremor** (dashboard/grafik) + **Ark UI** (state machine) | Veri-dense arayüz |
| Tablo | **TanStack Table v8** (sorting, filtering, virtualization) | 1000+ satır akıcı |
| Form | **React Hook Form** + **Zod** + **@conform-to/react** | Karmaşık formlar |
| Zengin editör | **TipTap 2** (ürün/blog açıklaması, MDX) | WYSIWYG |
| Medya | **Cloudflare Images** picker (entegre) | Sürükle-bırak toplu yükleme |
| 3D yönetim | **R3F** preview + glb yükleme | 3D model atama |
| Grafik | **Tremor** + **Recharts** | Satış, stok, funnel |
| Komut paleti | **cmdk** (Cmd+K) | Hızlı navigasyon/aksiyon |
| Veri | **TanStack Query** + **Server Actions** + **Server Components** | Real-time cache |
| Realtime | **Server-Sent Events** / Supabase Realtime | Canlı sipariş akışı |
| Yetkilendirme | **CASL** (attribute-based) + Auth.js (role) | Rol-bazlı izin |

### 13.2 Rol & Yetki Sistemi (CASL)

```
Süper Admin    → her şey
Yönetici       → ürün, sipariş, kategori, kampanya (finans hariç)
Mağaza Müd.    → sipariş, stok, kargo
İçerik Editörü → blog, proje, kampanya metni
Muhasebe       → sipariş, fatura, ödeme raporu
Keşif Tems.    → keşif talepleri, projeler, toptan teklif
Depo           → stok, kargo, paketleme
```

### 13.3 Admin URL Yapısı

```
/admin                         Dashboard (komuta merkezi)
/admin/urunler                 Ürün listesi
/admin/urunler/yeni            Yeni ürün
/admin/urunler/[id]            Ürün düzenle
/admin/kategoriler             Kategori ağacı (drag-drop)
/admin/markalar                Markalar
/admin/varyantlar              Varyant şablonları
/admin/stok                    Stok yönetimi (toplu güncelleme)
/admin/siparisler              Sipariş listesi
/admin/siparisler/[id]         Sipariş detayı + durum akışı
/admin/iadeler                 İade talepleri
/admin/kargo                   Kargo entegrasyonu & takip
/admin/musteriler              Müşteri listesi
/admin/musteriler/[id]         Müşteri detayı (sipariş geçmişi, segment)
/admin/yorumlar                Yorum moderasyonu
/admin/kampanyalar             Kampanya & kupon
/admin/koleksiyonlar           Küratörlü koleksiyon
/admin/projeler                Projeler & case study
/admin/kesif-talepleri         Keşif talepleri (B2B pipeline)
/admin/toptan                  Toptan müşteri & fiyatlandırma
/admin/blog                    Blog yönetimi
/admin/sayfalar                Statik sayfa içerikleri
/admin/medya                   Medya kütüphanesi (görsel/video/3D)
/admin/menuler                 Menü & navigasyon yönetimi
/admin/bannerlar               Anasayfa banner & hero yönetimi
/admin/gorunum                 Tema/renk/typography ayarları (canlı önizleme)
/admin/seo                     SEO: meta, schema, sitemap, redirect
/admin/raporlar/satis          Satış raporu
/admin/raporlar/stok           Stok raporu
/admin/raporlar/musteri        Müşteri analitiği
/admin/raporlar/urun           Ürün performansı
/admin/raporlar/pazarlama      Kampanya & funnel
/admin/finans                  Ödeme, fatura, komisyon
/admin/ayarlar                 Genel ayarlar
/admin/kullanicilar            Admin kullanıcıları & roller
/admin/audit-log               İşlem günlüğü (kim ne yaptı)
/admin/entegrasyonlar          Iyzico, kargo, SMS, email, analytics
```

### 13.4 Dashboard (Komuta Merkezi) — `/admin`

Tek ekranda **her şey**. Üstte komut paleti (Cmd+K), solda daraltılabilir mega menü, ortada widget grid.

| Widget | İçerik |
|---|---|
| **KPI Kartları** (üst sıra) | Bugünkü ciro, sipariş sayısı, yeni müşteri, dönüşüm oranı — anlık değişim (↑↓ %), sparkline |
| **Canlı Sipariş Akışı** | Realtime SSE — yeni siparişler canlı düşer, sesli bildirim, tek tıkla detay |
| **Satış Grafiği** | Tremor area chart — gün/hafta/ay/yıl seçici, karşılaştırma |
| **Stok Uyarıları** | Kritik stok / tükenen ürünler listesi, tek tık yenile |
| **İade & Destek** | Bekleyen iade/talep sayısı |
| **Keşif Pipeline** | B2B talep kanban (Yeni → Keşfte → Teklif → Kazanıldı/Kaybedildi) |
| **Top Ürünler** | En çok satan / en çok görüntülenen / en yüksek ciro |
| **Trafik & Funnel** | PostHog entegrasyonu — ziyaret → sepet → ödeme funnel |
| **Hızlı Aksiyon** | "Yeni Ürün", "Yeni Kampanya", "Sipariş Ara", "Stok Güncelle" butonları |
| **Sistem Durumu** | DB, CDN, ödeme API, kargo API sağlık göstergeleri |

**Etki:** Açılışta tek bakışta operasyonun nabzı. Renk-kodlu durum, animasyonlu sayaçlar, drag-drop ile widget yer değiştirme (kullanıcı bazlı kayıt).

### 13.5 Ürün Yönetimi — `/admin/urunler`

| Bölüm | Detay |
|---|---|
| **Liste** | TanStack Table: sanal scroll (binlerce ürün), kolon göster/gizle, bulk seçim, bulk fiyat/stok güncelleme, satır içi hızlı düzenleme |
| **Filtre** | Kategori, marka, stok durumu, aktif/pasif, fiyat aralığı, etiket, tarih |
| **Toplu işlemler** | Seçili ürünleri: aktif/pasif, kategori değiştir, fiyat +/- %, CSV import/export, sil |
| **Ürün editör** | Çok sekmeli: Genel (ad, slug, açıklama TipTap) / Fiyat & Stok / Varyantlar (dinamik matris) / Görseller (sürükle-bırak, toplu, sıralama) / 3D & AR (glb yükle, AR toggle) / SEO (meta, slug, schema) / İlişkili ürünler / Kampanya |
| **Varyant matris** | Renk × Boyut × Saksı otomatik kombinasyon üretimi, her hücrede fiyat/stok/SKU |
| **Canlı önizleme** | Sağda ürün sayfasının canlı preview'ı (değişiklik anında yansır) |
| **Revizyon geçmişi** | Her kayıt versiyonlanır, geri al/diff karşılaştırma |

### 13.6 Sipariş Yönetimi — `/admin/siparisler`

| Bölüm | Detay |
|---|---|
| **Liste** | Durum filtreli (kanban + tablo görünüm), arama (sipariş no, müşteri, telefon) |
| **Detay** | Müşteri, adres, ürünler, ödeme, kargo timeline, durum değiştirme (drag timeline), fatura PDF, kargo etiketi yazdır |
| **Durum akışı** | Bekliyor → Ödendi → Hazırlanıyor → Kargoda → Teslim → (İade/İptal) — her adımda otomatik SMS/email |
| **Toplu kargo** | Seçili siparişlere toplu kargo kodu atama, CSV export |
| **İade akışı** | İade talebi → onay → iade etiketi → para iadesi |

### 13.7 Stok Yönetimi — `/admin/stok`

| Bölüm | Detay |
|---|---|
| **Stok tablosu** | Ürün + varyant bazında, mevcut, rezerve, ulaşılabilir, min/maks seviye |
| **Toplu güncelleme** | CSV import, barkod okuyucu desteği, manuel +/- |
| **Stok hareketleri** | Giriş/çıkış logu (nereden, neden, kim) |
| **Tedarikçi** | Tedarikçi & alım siparişi yönetimi, otomatik min-stok uyarısı |
| **Depo** | Çoklu depo, lokasyon (raf/kat/sıra) |

### 13.8 Medya Kütüphanesi — `/admin/medya`

| Bölüm | Detay |
|---|---|
| **Grid/Folder** | Klasör bazlı, etiket, arama, filtre (görsel/video/3D) |
| **Toplu yükleme** | Sürükle-bırak, otomatik AVIF/WebP dönüşümü, otomatik alt-text (AI Vision) |
| **Düzenleme** | Kırpma, yeniden boyut, filigran, AI arka plan kaldırma |
| **3D yönetim** | glb yükleme, Draco compress, preview, ürüne atama |
| **Kullanım takibi** | Hangi görsel hangi ürün/sayfada kullanılıyor |

### 13.9 Kampanya & Pazarlama — `/admin/kampanyalar`

| Bölüm | Detay |
|---|---|
| **Kupon** | Kod, tip (%/tutar/ürün), geçerlilik, kullanım limiti, min sepet, kategori/ürün kısıtı |
| **Kampanya** | Anasayfa banner, hero, countdown, kategori indirim, flash sale |
| **Segmentasyon** | Müşteri segmentine özel kampanya (yeni/tekrar/VIP/terk) |
| **Otomasyon** | Sepeti terk email, doğum günü kupon, win-back |
| **A/B test** | Banner/hero varyantları (PostHog) |

### 13.10 İçerik Yönetimi — `/admin/blog`, `/admin/sayfalar`, `/admin/projeler`

| Bölüm | Detay |
|---|---|
| **Blog** | TipTap MDX editör, kapak görseli, SEO, kategori/etiket, planlanan yayın, taslak |
| **Statik sayfa** | Hakkımızda, iletişim, KVKK vb. — blok tabanlı sayfa kurucu (drag-drop section) |
| **Projeler** | Case study editör, galeri, before/after, kullanılan ürünler linki |
| **Menü yönetimi** | Header/footer menü drag-drop, mega menü yapılandırma |
| **Banner/hero** | Anasayfa section'ları sıralı yönetim, canlı önizleme |

### 13.11 Raporlar & Analitik — `/admin/raporlar/*`

| Rapor | İçerik |
|---|---|
| **Satış** | Ciro, sipariş, AOV, kar marjı — gün/hafta/ay/yıl, karşılaştırma, export PDF/Excel |
| **Stok** | Stok değeri, hareket, yavaş satan, tükenen |
| **Müşteri** | Yeni/tekrar, RFM segment, CLV, churn |
| **Ürün** | En çok satan, en çok görüntülenen, en yüksek iade, margin |
| **Pazarlama** | Kampanya ROI, funnel, kanal bazlı (organik/paid/social), kupon performansı |
| **Finans** | Komisyon, taksit maliyeti, iade, net ciro |

Tüm raporlar: filtre, drill-down, grafik + tablo, export, dashboard'a pinleme.

### 13.12 Sistem & Ayarlar — `/admin/ayarlar`, `/admin/entegrasyonlar`

| Bölüm | Detay |
|---|---|
| **Genel** | Site adı, logo, iletişim, para birimi, dil, saat dilimi |
| **Görünüm** | Tema renk/typography/spacing canlı editör + önizleme |
| **Ödeme** | Iyzico/Stripe anahtar, taksit tablosu, kapıda ödeme bölge |
| **Kargo** | Firmalar, fiyat matrisi, ücretsiz kargo eşiği, teslimat bölge |
| **SMS/Email** | Netgsm/Resend şablonları, tetikleyici kuralları |
| **SEO** | Site geneli meta, sitemap ayarı, 301 redirect yönetimi, robots |
| **Entegrasyon** | PostHog, Sentry, Google/Meta pixel, kargo API'leri |
| **Kullanıcılar** | Admin kullanıcı CRUD, rol atama (CASL), 2FA/passkey zorunlu |
| **Audit log** | Tüm admin işlemleri (kim, ne, ne zaman, önce/sonra), filtre, export |
| **Yedek** | DB snapshot, restore, export |

### 13.13 Admin UI/UX Prensipleri

- **Koyu tema öncelikli** (göz yorgunluğu az, veri odaklı) + açık tema opsiyonu
- **Cmd+K komut paleti** — her yere hızlı erişim (ürün ara, sipariş bul, aksiyon çalıştır)
- **Klavye kısayolları** — güçlü kullanıcılar için (j/k navigasyon, e düzenle, n yeni)
- **Toast + inline bildirim** — aksiyon geri bildirimi
- **Optimistic UI** — sepet/stok/durum değişimi anında yansır
- **Realtime** — canlı sipariş, stok, keşif talebi
- **Responsive** — tablet destekli (mobil sınırlı)
- **Erişilebilirlik** — WCAG AA, klavye navigasyonu
- **Boş durum & yükleme** — şık skeleton + empty state illüstrasyonları
- **Hata durumları** — net mesaj + retry, Sentry'ye otomatik rapor

---

## 14. RİSKLER & AZALTMA

| Risk | Azaltma |
|---|---|
| 3D model maliyeti | Önce 5-10 popüler üründe pilot, kademeli genişlet |
| AR cihaz desteği | Fallback: 3D viewer + görsel |
| Ödeme entegrasyonu | Iyzico sandbox ile test, Stripe yedek |
| SEO geçişi | 301 redirect map, eski URL'leri koru |
| Performans (3D yükü) | Lazy-load, düşük poly model, SSR fallback |

---

## 15. ONAY BEKLEYEN KARARLAR

- [ ] CMS: **Sanity** (hosted, hızlı) vs **Payload** (self-host, kontrol)
- [ ] DB: **Neon** (serverless Postgres) vs **Supabase** (auth+storage dahil)
- [ ] 3D model kaynağı: dış tedarik vs Blender ile üretim
- [ ] Çoklu dil: sadece TR mi, EN de var mı?
- [ ] Toptan portal ayrı subdomain (toptan.domain.com) mi?
- [ ] Passkey öncelikli giriş mi, klasik şifre de kalsın mı?

---

> **Sonraki adım:** Onaylanan stack ile Faz 0 kurulumuna başlanacak.
