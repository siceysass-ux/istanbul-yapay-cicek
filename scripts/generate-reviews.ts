/**
 * Gerçekçi Türkçe ürün yorumları + yıldızlama generator
 * 47 ürün için 3-15 arası yorum, gerçekçi rating dağılımı
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// === Türkçe isim havuzu ===
const firstNames = [
  "Ayşe", "Mehmet", "Zeynep", "Mustafa", "Elif", "Burak", "Selin", "Ahmet",
  "Deniz", "Ceren", "Emre", "Gizem", "Onur", "Buse", "Kerem", "Dilara",
  "Tolga", "Merve", "Serkan", "Ece", "Hakan", "Pınar", "Murat", "Seda",
  "Cem", "Yağmur", "Barış", "Esra", "Volkan", "Nazlı", "Fatma", "Ali",
  "Şeyda", "Kaan", "Begüm", "Ozan", "Asuman", "Yusuf", "Hande", "Cenk",
  "Nuray", "Emel", "Tunç", "Sevgi", "Bora", "Lale", "Furkan", "Damla",
];

const lastNames = [
  "Kaya", "Yılmaz", "Demir", "Şahin", "Çelik", "Yıldız", "Yıldırım", "Öztürk",
  "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara",
  "Koç", "Kurt", "Özkan", "Şimşek", "Polat", "Korkmaz", "Erdoğan", "Güneş",
  "Aktaş", "Çakır", "Bulut", "Tunç", "Aksoy", "Erdem", "Taş", "Akın",
  "Bilgin", "Soylu", "Kaplan", "Sezer", "Tamer", "Yalçın", "Güler", "Acar",
];

const cities = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya",
  "Gaziantep", "Mersin", "Eskişehir", "Samsun", "Trabzon", "Kayseri",
  "Denizli", "Sakarya", "Balıkesir", "Aydın", "Hatay", "Kahramanmaraş", "Van",
  "Muğla", "Tekirdağ", "Manisa", "Samsun", "Kocaeli",
];

// === Yorum başlıkları (rating'e göre) ===
const titles5 = [
  "Harika ürün!", "Beklentilerimi aştı", "Çok memnun kaldım", "Mükemmel kalite",
  "Tavsiye ederim", "Gerçek görünüyor", "Çok şık duruyor", "Fiyatına değer",
  "Süper", "Mutlaka alın", "İnanılmaz gerçekçi", "Mekanı değiştirdi",
  "Hayran kaldım", "İkinci kez aldım", "Çok beğenildi", "Profesyonel işçilik",
  "Kusursuz", "Kaliteli malzeme", "Hızlı teslimat", "Açıklama gibi geldi",
];

const titles4 = [
  "Güzel ürün", "Memnun kaldım", "İyi kalite", "Beğendim",
  "Fena değil", "Beklentileri karşıladı", "İyi alışveriş", "Tavsiye ediyorum",
  "Kaliteli ama pahalı", "Güzel görünüyor", "İşimi gördü", "Yine alırım",
];

const titles3 = [
  "Orta kalite", "Beklentileri kısmen karşıladı", "İdare eder",
  "Daha iyisi olabilirdi", "Fiyatı biraz yüksek", "Ortalama ürün",
];

const titles2 = [
  "Beklediğim gibi değildi", "Hayal kırıklığı", "Kalite düşük",
  "Fiyatı pahalı", "Beklentimi karşılamadı",
];

const titles1 = [
  "Çok kötü", "İade ettim", "Kötü kalite", "Tavsiye etmiyorum",
];

// === Yorum gövdeleri — kategoriye göre ===
const genericBodies = [
  "Ürünü {time} aldım ve {duration} kullanıyorum. {place} çok şık duruyor. {feeling} Tavsiye ederim.",
  "{time} sipariş verdim, {delivery} geldi. {place} koydum, gerçek görünüyor. {feeling}",
  "Kalitesinden memnun kaldım. {place} çok güzel duruyor. {duration} kullanıyorum, hiç sorun yaşamadım. {feeling}",
  "Fiyatına göre çok iyi. {place} koydum, herkes beğeniyor. {feeling} Tekrar alırım.",
  "{time} aldım, {delivery} teslim edildi. {place} koydum, mekanın havası değişti. {feeling}",
  "Beklentilerimi {expectation}. {place} çok şık duruyor. {feeling}",
  "Gerçekten {reality}. {duration} kullanıyorum, solma yok. {place} harika duruyor. {feeling}",
  "İkinci kez alıyorum. {place} ilk aldığım hala ilk günkü gibi. {feeling}",
  "Hediye olarak aldım, çok beğenildi. {place} koyduk, herkes soruyor nereden aldık. {feeling}",
  "Profesyonel işçilik. {place} koydum, gerçek bitki sananlar oldu. {feeling}",
];

const verticalGardenBodies = [
  "Dikey bahçe panelini {place} uyguladık. {duration} oldu, ilk günkü gibi. {feeling} Gerçek bitki sananlar var.",
  "Ofisimize dikey bahçe yaptırdık. {place} harika duruyor. {feeling} Çalışanlar çok sevdi.",
  "Kafemize dikey bahçe paneli aldık. {place} koyduk, müşteriler çok beğeniyor. {feeling}",
  "Dikey bahçe modülünü {place} taktık. {duration} oldu, hiç bakım gerektirmedi. {feeling}",
  "Restoranımıza dikey bahçe yaptık. {place} harika duruyor. {feeling} Gerçek sananlar oluyor.",
];

const treeBodies = [
  "Yapay ağacı {place} koydum. {duration} oldu, ilk günkü gibi duruyor. {feeling} Gerçek ağaç sananlar var.",
  "Büyük yapay ağacı ofise aldık. {place} çok şık duruyor. {feeling} Bakım gerektirmiyor.",
  "Yapay ağacı {place} koydum, herkes gerçek sanıyor. {duration} oldu, solma yok. {feeling}",
  "Ağacı {place} koydum. {feeling} Gerçek görünüyor, bakım gerektirmiyor.",
];

const flowerBodies = [
  "Yapay çiçekleri {place} koydum. {duration} oldu, ilk günkü gibi. {feeling} Gerçek sananlar var.",
  "Çiçekleri {place} dizdim, çok şık duruyor. {feeling} Bakım gerektirmiyor.",
  "Yapay çiçek buketini {place} koydum. {feeling} Herkes nereden aldığımı soruyor.",
  "Çiçekler {place} harika duruyor. {duration} oldu, solma yok. {feeling}",
];

const mossBodies = [
  "Yosun duvarı {place} yaptırdık. {duration} oldu, ilk günkü gibi. {feeling} Ses sönümleme de yapıyor.",
  "Yosun paneli {place} taktık. {feeling} Gerçek yosun sananlar var.",
  "Akustik yosun panelini ofise aldık. {place} koyduk, ses azaldı. {feeling}",
  "Yosun tabloyu {place} astım. {feeling} Herkes beğeniyor.",
];

// === Dolgu kelimeleri ===
const times = ["geçen ay", "2 ay önce", "3 ay önce", "geçen hafta", "1 hafta önce", "yaklaşık 6 ay önce", "geçen yıl", "1 yıl önce"];
const durations = ["3 aydır", "6 aydır", "1 yıldır", "2 yıldır", "aylardır", "haftalardır"];
const places = ["oturma odamda", "ofiste", "kafede", "restoranda", "lobide", "yatak odamda", "mutfakta", "balkonda", "terasda", "koridorda", "resepsiyonda", "toplantı odasında"];
const deliveries = ["1 günde", "2 günde", "3 günde", "aynı hafta", "hızlıca"];
const feelings = ["Çok memnunum.", "Hayran kaldım.", "Tavsiye ederim.", "Tekrar alırım.", "Çok beğendim.", "Mutluyum.", "Şaşırdım.", "Memnun kaldım."];
const expectations = ["bastı", "aştı", "karşıladı"];
const realities = ["gerçek görünüyor", "kaliteli", "şık", "güzel", "harika"];
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomName(): string {
  return `${randomItem(firstNames)} ${randomItem(lastNames)}`;
}

function fillTemplate(template: string): string {
  return template
    .replace("{time}", randomItem(times))
    .replace("{duration}", randomItem(durations))
    .replace("{place}", randomItem(places))
    .replace("{delivery}", randomItem(deliveries))
    .replace("{feeling}", randomItem(feelings))
    .replace("{expectation}", randomItem(expectations))
    .replace("{reality}", randomItem(realities));
}


function getBodiesForCategory(slug: string): string[] {
  if (slug.includes("dikey") || slug.includes("bahce")) return [...verticalGardenBodies, ...genericBodies];
  if (slug.includes("agac")) return [...treeBodies, ...genericBodies];
  if (slug.includes("cicek") || slug.includes("gul") || slug.includes("demet") || slug.includes("buket")) return [...flowerBodies, ...genericBodies];
  if (slug.includes("yosun") || slug.includes("moss")) return [...mossBodies, ...genericBodies];
  return genericBodies;
}

function getTitleForRating(rating: number): string {
  if (rating === 5) return randomItem(titles5);
  if (rating === 4) return randomItem(titles4);
  if (rating === 3) return randomItem(titles3);
  if (rating === 2) return randomItem(titles2);
  return randomItem(titles1);
}

// Rating dağılımı: 5★ %60, 4★ %40 (minimum 4 yıldız)
function randomRating(): number {
  const r = Math.random() * 100;
  if (r < 60) return 5;
  return 4;
}

function randomDateWithinYears(years: number): Date {
  const now = new Date();
  const past = new Date(now.getFullYear() - years, now.getMonth(), now.getDate());
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

async function main() {
  console.log("=== Review Generator ===\n");

  // Önce mevcut fake yorumları sil
  const deleted = await prisma.review.deleteMany({
    where: { userId: null },
  });
  console.log(`Eski fake yorumlar silindi: ${deleted.count}\n`);

  const products = await prisma.product.findMany({
    include: { category: true },
  });

  console.log(`Toplam ürün sayısı (aktif + pasif): ${products.length}\n`);

  // Pasif ürünleri aktive et
  const inactiveProducts = products.filter((p) => !p.isActive);
  if (inactiveProducts.length > 0) {
    console.log(`Pasif ürünler aktive ediliyor: ${inactiveProducts.length}\n`);
    for (const p of inactiveProducts) {
      await prisma.product.update({
        where: { id: p.id },
        data: { isActive: true },
      });
    }
  }

  let totalReviews = 0;
  const productUpdates: { id: string; rating: number; reviewCount: number }[] = [];
  const globalUsedBodies = new Set<string>(); // Global unique body

  for (const product of products) {
    // 3-15 arası rastgele yorum
    const reviewCount = 3 + Math.floor(Math.random() * 13);
    const catSlug = product.category?.slug ?? "";
    const bodies = getBodiesForCategory(catSlug);

    const reviews = [];
    let ratingSum = 0;
    const usedNames = new Set<string>();
    const usedBodies = new Set<string>();

    let attempts = 0;
    while (reviews.length < reviewCount && attempts < reviewCount * 10) {
      attempts++;
      const rating = randomRating();
      ratingSum += rating;

      const name = randomName();
      // Aynı ürün içinde aynı isim olmasın
      if (usedNames.has(name)) {
        ratingSum -= rating;
        continue;
      }

      const body = fillTemplate(randomItem(bodies));
      // Aynı ürün içinde ve global olarak aynı body olmasın
      if (usedBodies.has(body) || globalUsedBodies.has(body)) {
        ratingSum -= rating;
        continue;
      }

      usedNames.add(name);
      usedBodies.add(body);
      globalUsedBodies.add(body);

      const city = randomItem(cities);
      const title = getTitleForRating(rating);
      const verified = Math.random() < 0.7; // %70 doğrulanmış
      const helpfulCount = Math.floor(Math.random() * 26); // 0-25
      const createdAt = randomDateWithinYears(2);

      reviews.push({
        productId: product.id,
        userId: null,
        authorName: name,
        authorLocation: city,
        rating,
        title,
        body,
        images: "[]",
        verified,
        helpfulCount,
        status: "APPROVED",
        createdAt,
      });
    }

    // Toplu insert
    await prisma.review.createMany({ data: reviews });

    const avgRating = Math.round((ratingSum / reviewCount) * 10) / 10;
    productUpdates.push({
      id: product.id,
      rating: avgRating,
      reviewCount,
    });

    totalReviews += reviewCount;
    console.log(`✓ ${product.name} — ${reviewCount} yorum, ort ${avgRating}★`);
  }

  // Ürün rating ve reviewCount güncelle
  for (const update of productUpdates) {
    await prisma.product.update({
      where: { id: update.id },
      data: {
        rating: update.rating,
        reviewCount: update.reviewCount,
      },
    });
  }

  console.log(`\n=== Tamamlandı ===`);
  console.log(`Toplam yorum: ${totalReviews}`);
  console.log(`Güncellenen ürün: ${productUpdates.length}`);
  console.log(`Ortalama yorum/ürün: ${(totalReviews / products.length).toFixed(1)}`);
}

main()
  .catch((err) => {
    console.error("Hata:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
