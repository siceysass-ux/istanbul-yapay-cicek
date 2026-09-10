# Review Generator Planı

## Hedef
47 ürün için gerçekçi, geniş yelpazeli, detaylı fake yorumlar + yıldızlamalar oluşturup Prisma'ya yükle.

## Prisma Şema Değişikliği
- `Review.userId` → `String?` (nullable) — fake yorumlar için kullanıcı gereksiz
- `Review` modeline `authorName`, `authorLocation` alanları ekle
- `Review` modeline `helpfulCount` alanı ekle (kaç kişi faydalı buldu)
- `Product.rating` ve `Product.reviewCount` güncellenecek

## Generator Yapısı (`scripts/generate-reviews.ts`)

### Türkçe isim havuzu (50+)
- Ad + Soyad kombinasyonları
- Gerçek Türk isimleri: Ayşe, Mehmet, Zeynep, Mustafa, Elif, Burak, Selin, Ahmet, Deniz, Ceren, Emre, Gizem, Onur, Buse, Kerem, Dilara, Tolga, Merve, Serkan, Ece, Hakan, Pınar, Murat, Seda, Cem, Yağmur, Barış, Esra, Volkan, Nazlı...

### Türkçe şehir havuzu (20+)
- İstanbul, Ankara, İzmir, Bursa, Antalya, Adana, Konya, Gaziantep, Mersin, Eskişehir, Samsun, Trabzon, Kayseri, Denizli, Sakarya, Balıkesir, Aydın, Hatay, Kahramanmaraş, Van

### Yorum başlığı havuzu (30+)
- "Harika ürün!", "Beklentilerimi aştı", "Çok memnun kaldım", "Kaliteli malzeme", "Mükemmel", "Tavsiye ederim", "Gerçek görünüyor", "Çok şık", "Fiyatına değer", "Hızlı teslimat", "Süper kalite", "Mutlaka alın", "İnanılmaz gerçekçi", "Mekanı değiştirdi", "Hayran kaldım", "İkinci kez aldım", "Hediye olarak aldım", "Çok beğenildi", "Profesyonel işçilik", "Kusursuz"

### Yorum gövde havuzu (40+)
- Ürün tipine göre değişen, gerçekçi, detaylı yorumlar
- 2-4 cümle uzunluğunda
- Belirli ürün kategorilerine özel (dikey bahçe, yapay ağaç, çiçek, yosun, vb.)
- Zaman ifadeleri ("3 aydır kullanıyorum", "1 yıldır duruyor", "geçen ay aldım")
- Mekan ifadeleri ("oturma odamda", "ofiste", "kafede", "restoranda")
- Duygu ifadeleri ("çok memnun", "şaşırdım", "mutluyum", "tavsiye ederim")

### Rating dağılımı (gerçekçi)
- 5 yıldız: %55
- 4 yıldız: %25
- 3 yıldız: %12
- 2 yıldız: %5
- 1 yıldız: %3
- Ortalama: ~4.3-4.7

### Her ürün için
- 3-15 arası rastgele yorum sayısı
- Toplamda ~300-500 yorum
- Her yoruma:
  - Rastgele Türk isim + şehir
  - Rating (yukarıdaki dağılıma göre)
  - Başlık (havuzdan)
  - Gövde (ürün tipine göre)
  - `verified: true` (%70 olasılık)
  - `helpfulCount`: 0-25 arası
  - `createdAt`: son 2 yıl içinde rastgele tarih

### Ürün rating güncelleme
- Her ürün için yorumların ortalaması → `Product.rating`
- Yorum sayısı → `Product.reviewCount`

## Çalıştırma
1. Prisma şema güncelle → `npx prisma db push`
2. Generator script çalıştır → `npx tsx scripts/generate-reviews.ts`
3. TypeScript kontrol
4. Sayfa test
