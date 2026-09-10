import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const img = (id: string, w = 800, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

async function main() {
  // Kategoriler
  const cats = [
    { slug: "yapay-cicek", name: "Yapay Çiçekler", icon: "Flower2", order: 1, image: img("photo-1490750967868-88aa4486c946") },
    { slug: "yapay-agac", name: "Yapay Ağaçlar", icon: "TreePine", order: 2, image: img("photo-1545241047-6083a3684587") },
    { slug: "demet-cicek", name: "Demet Çiçekler", icon: "Flower", order: 3, image: img("photo-1561181286-d3fee7d55364") },
    { slug: "gelin-buketi", name: "Gelin Buketi", icon: "Heart", order: 4, image: img("photo-1485955900006-10f4d324d411") },
    { slug: "kuru-cicek", name: "Kuru Çiçek", icon: "Leaf", order: 5, image: img("photo-1497366216548-37526070297c") },
    { slug: "sarmasik", name: "Sarmaşıklar", icon: "Sprout", order: 6, image: img("photo-1545241047-6083a3684587") },
    { slug: "dikey-bahce", name: "Dikey Bahçe", icon: "Wall", order: 7, image: img("photo-1485955900006-10f4d324d411") },
    { slug: "saksi", name: "Saksı", icon: "Circle", order: 8, image: img("photo-1485955900006-10f4d324d411") },
  ];

  for (const c of cats) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  // Alt kategoriler
  const subCats = [
    { slug: "gul-demeti", name: "Gül Demeti", parentId: "demet-cicek" },
    { slug: "papatya-demeti", name: "Papatya Demeti", parentId: "demet-cicek" },
    { slug: "lilyum-demeti", name: "Lilyum Demeti", parentId: "demet-cicek" },
    { slug: "ortanca-demeti", name: "Ortanca Demeti", parentId: "demet-cicek" },
    { slug: "bambu-agac", name: "Bambu Ağaçlar", parentId: "yapay-agac" },
    { slug: "zeytin-agac", name: "Zeytin Ağacı", parentId: "yapay-agac" },
    { slug: "bonsai", name: "Bonsai Ağacı", parentId: "yapay-agac" },
    { slug: "kaktus", name: "Kaktüs Ağacı", parentId: "yapay-agac" },
  ];
  for (const sc of subCats) {
    const parent = await prisma.category.findUnique({ where: { slug: sc.parentId } });
    if (parent) {
      await prisma.category.upsert({
        where: { slug: sc.slug },
        update: {},
        create: { slug: sc.slug, name: sc.name, parentId: parent.id },
      });
    }
  }

  // Markalar
  const brands = [
    { slug: "premium-botanik", name: "Premium Botanik" },
    { slug: "natura-decor", name: "Natura Decor" },
    { slug: "evergreen", name: "EverGreen" },
  ];
  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }

  // Ürünler
  const products = [
    {
      slug: "yapay-gul-demeti-kirmizi-50cm",
      name: "Yapay Gül Demeti 50 cm Kırmızı",
      shortDesc: "Gerçek dokulu 12li kırmızı gül demeti",
      description: "Gerçek çiçek dokusunda, ıslak hisli premium kırmızı gül demeti. 12 adet gül içerir. Vazoda şık duruş. Bakım gerektirmez, 4 mevsim güzelliğini korur.",
      basePrice: 349, discountPrice: 279, sku: "GD-KR-50", stock: 45, isFeatured: true, isNew: false,
      categorySlug: "gul-demeti", brandSlug: "premium-botanik",
      images: ["photo-1485955900006-10f4d324d411", "photo-1490750967868-88aa4486c946"],
    },
    {
      slug: "yapay-papatya-demeti-30cm-krem",
      name: "Yapay 10lu İri Papatya Demeti 30 cm Krem",
      shortDesc: "10 adet iri krem papatya demeti",
      description: "İri çiçek başlı 10 adet krem papatya. Islak dokulu yapraklar. Dekoratif vazolar için ideal.",
      basePrice: 99, discountPrice: null, sku: "PD-KR-30", stock: 120, isFeatured: true, isNew: true,
      categorySlug: "papatya-demeti", brandSlug: "natura-decor",
      images: ["photo-1561181286-d3fee7d55364"],
    },
    {
      slug: "yapay-lilyum-demeti-60cm-beyaz",
      name: "Yapay Lilyum Demeti 60 cm Beyaz",
      shortDesc: "Zarif beyaz lilyum demeti",
      description: "3 çiçekli beyaz lilyum demeti. Gerçek dokulu, 60 cm boy. Şık cam vazo için ideal.",
      basePrice: 189, discountPrice: 149, sku: "LD-BY-60", stock: 30, isFeatured: true, isNew: false,
      categorySlug: "lilyum-demeti", brandSlug: "premium-botanik",
      images: ["photo-1490750967868-88aa4486c946"],
    },
    {
      slug: "yapay-ortanca-demeti-45cm-mor",
      name: "Yapay Ortanca Demeti 45 cm Mor",
      shortDesc: "Bol çiçekli mor ortanca demeti",
      description: "7 başlı mor ortanca demeti. Gerçek dokulu yapraklar. Kuru ve yapay çiçek aranjmanları için.",
      basePrice: 159, discountPrice: null, sku: "OD-MR-45", stock: 60, isFeatured: false, isNew: true,
      categorySlug: "ortanca-demeti", brandSlug: "evergreen",
      images: ["photo-1545241047-6083a3684587"],
    },
    {
      slug: "yapay-bambu-agac-180cm",
      name: "Yapay Bambu Ağacı 180 cm",
      shortDesc: "Doğal görünümlü 180 cm bambu ağacı",
      description: "UV korumalı, dış mekan uyumlu 180 cm yapay bambu ağacı. Dekoratif saksı dahil. Bakım gerektirmez.",
      basePrice: 2990, discountPrice: 2490, sku: "BA-180", stock: 15, isFeatured: true, isNew: false,
      categorySlug: "bambu-agac", brandSlug: "premium-botanik",
      images: ["photo-1545241047-6083a3684587"],
    },
    {
      slug: "yapay-zeytin-agac-150cm",
      name: "Yapay Zeytin Ağacı 150 cm",
      shortDesc: "Gerçekçi zeytin ağacı, fiber saksılı",
      description: "150 cm yapay zeytin ağacı. Doğal gövde dokusu, fiber saksı dahil. İç ve dış mekan uyumlu.",
      basePrice: 1890, discountPrice: null, sku: "ZA-150", stock: 20, isFeatured: true, isNew: false,
      categorySlug: "zeytin-agac", brandSlug: "natura-decor",
      images: ["photo-1485955900006-10f4d324d411"],
    },
    {
      slug: "yapay-bonsai-agac-200cm",
      name: "Yapay Lüks Bonsai Ağacı 200 cm",
      shortDesc: "58 dallı lüks bonsai, fiber saksılı",
      description: "200 cm boy, 58 dal, beyaz fiber saksılı lüks bonsai ağacı. UV korumalı. Prestij mekânlar için.",
      basePrice: 44900, discountPrice: null, sku: "BO-200", stock: 5, isFeatured: true, isNew: true,
      categorySlug: "bonsai", brandSlug: "premium-botanik",
      images: ["photo-1545241047-6083a3684587"],
    },
    {
      slug: "yapay-kaktus-agac-150cm",
      name: "Yapay Kaktüs Ağacı 150 cm",
      shortDesc: "Gerçekçi kaktüs ağacı, saksılı",
      description: "150 cm yapay kaktüs ağacı. Doğal doku, dekoratif saksı dahil. Modern dekorasyon için ideal.",
      basePrice: 5490, discountPrice: 4490, sku: "KA-150", stock: 10, isFeatured: false, isNew: true,
      categorySlug: "kaktus", brandSlug: "evergreen",
      images: ["photo-1497366216548-37526070297c"],
    },
    {
      slug: "yapay-gelincik-dali-60cm-beyaz",
      name: "Yapay Çiçek 4lü Gelincik Dalı 60 cm Beyaz",
      shortDesc: "4 dallı beyaz gelincik",
      description: "60 cm 4lü gelincik dalı. İnce zarif yapraklar. Demet ve aranjman için ideal.",
      basePrice: 85, discountPrice: null, sku: "GE-BY-60", stock: 200, isFeatured: false, isNew: true,
      categorySlug: "yapay-cicek", brandSlug: "natura-decor",
      images: ["photo-1490750967868-88aa4486c946"],
    },
    {
      slug: "yapay-nergis-demeti-35cm-beyaz",
      name: "Yapay 15li Nergis Çiçeği Demeti 35 cm Beyaz",
      shortDesc: "15 adet ıslak dokulu nergis",
      description: "35 cm 15li nergis demeti. Islak dokulu yapraklar ile gerçek his. Bahar dekorasyonu için.",
      basePrice: 149, discountPrice: null, sku: "NE-BY-35", stock: 80, isFeatured: false, isNew: true,
      categorySlug: "yapay-cicek", brandSlug: "premium-botanik",
      images: ["photo-1561181286-d3fee7d55364"],
    },
    {
      slug: "yapay-dikey-bahce-paneli-1m2",
      name: "Yapay Dikey Bahçe Paneli 1 m²",
      shortDesc: "UV korumalı dikey bahçe paneli",
      description: "1 m² yapay dikey bahçe paneli. UV korumalı, iç-dış mekan. Kolay montaj, bakım gerektirmez.",
      basePrice: 890, discountPrice: 690, sku: "DB-1M2", stock: 40, isFeatured: true, isNew: false,
      categorySlug: "dikey-bahce", brandSlug: "evergreen",
      images: ["photo-1485955900006-10f4d324d411"],
    },
    {
      slug: "yapay-sarmasik-paneli-3m",
      name: "Yapay Sarmaşık Paneli 3 metre",
      shortDesc: "Yoğun yapraklı sarmaşık panel",
      description: "3 metre yapay sarmaşık paneli. Tırmanıcı yapraklar, duvar ve korkuluk için ideal.",
      basePrice: 459, discountPrice: null, sku: "SR-3M", stock: 55, isFeatured: false, isNew: false,
      categorySlug: "sarmasik", brandSlug: "natura-decor",
      images: ["photo-1545241047-6083a3684587"],
    },
  ];

  for (const p of products) {
    const cat = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
    const brand = p.brandSlug ? await prisma.brand.findUnique({ where: { slug: p.brandSlug } }) : null;
    if (!cat) continue;
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) continue;
    const product = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        shortDesc: p.shortDesc,
        description: p.description,
        basePrice: p.basePrice,
        discountPrice: p.discountPrice,
        sku: p.sku,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        tags: "[]",
        categoryId: cat.id,
        brandId: brand?.id,
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 50) + 5,
      },
    });
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img(p.images[i]),
          alt: p.name,
          width: 800,
          height: 800,
          order: i,
        },
      });
    }
    // Varyant örnekleri
    if (p.slug.includes("agac") || p.slug.includes("bonsai") || p.slug.includes("kaktus")) {
      for (const size of ["120 CM", "160 CM", "200 CM"]) {
        await prisma.variant.create({
          data: {
            productId: product.id,
            type: "size",
            name: size,
            sku: `${p.sku}-${size}`,
            stock: 5,
            priceDelta: size === "120 CM" ? -500 : size === "200 CM" ? 1000 : 0,
          },
        });
      }
    } else {
      for (const color of ["Beyaz", "Krem", "Pembe", "Mor"]) {
        await prisma.variant.create({
          data: {
            productId: product.id,
            type: "color",
            name: color,
            sku: `${p.sku}-${color}`,
            stock: 15,
            priceDelta: 0,
          },
        });
      }
    }
  }

  // Projeler — dikeyyapaybahce.com referansları
  const projects = [
    { slug: "adim-yapi", title: "Adım Yapı", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu uyguladık.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1466692215971-7c92c2c1c1a1"), gallery: "[]", tags: "[]" },
    { slug: "agaoglu-terrace", title: "Ağaoğlu Terrace", summary: "İç mekana yapay dikey bahçe dekorasyonu", content: "İç mekana harika bir yapay dikey bahçe dekorasyonu uyguladık.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1551882547-ff40c63fe5fa"), gallery: "[]", tags: "[]" },
    { slug: "american-life-dil-kursu", title: "American Life Dil Kursu", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1486406146926-c627a92ad1ab"), gallery: "[]", tags: "[]" },
    { slug: "arsavev", title: "ArsaVev", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1518895949257-7621c3c236d0"), gallery: "[]", tags: "[]" },
    { slug: "bahat-egitim-merkezi", title: "Bahat Eğitim Merkezi", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1497366216548-37526070297c"), gallery: "[]", tags: "[]" },
    { slug: "best-hotel", title: "Best Hotel", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1566073771259-6a8506099f55"), gallery: "[]", tags: "[]" },
    { slug: "bulut-yazilim-teknolojileri", title: "Bulut Yazılım Teknolojileri", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1497366811353-6870744d04b2"), gallery: "[]", tags: "[]" },
    { slug: "colombia-coffee", title: "Colombia Coffee", summary: "Yapay dikey bahçe ve yapay sarmaşık dekorasyonu", content: "Mekana harika bir yapay dikey bahçe ve yapay sarmaşık dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe + Sarmaşık", duration: "2 Hafta", coverImage: img("photo-1554118811-83eefd975929"), gallery: "[]", tags: "[]" },
    { slug: "contemporary-modern-art-museum", title: "Contemporary Modern Art Museum", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1518998053901-5348d3961a04"), gallery: "[]", tags: "[]" },
    { slug: "coskun-grup", title: "Coşkun Grup", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1502977249-613b9b054c45"), gallery: "[]", tags: "[]" },
    { slug: "dilek-pastanesi", title: "Dilek Pastanesi", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1485955900006-10f4d324d411"), gallery: "[]", tags: "[]" },
    { slug: "donerci-ali-efendi", title: "Dönerci Ali Efendi", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1463936677720-2aff4c7d3e30"), gallery: "[]", tags: "[]" },
    { slug: "huqqam", title: "Huqqam", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1559339352-11d035aa65de"), gallery: "[]", tags: "[]" },
    { slug: "iceberry", title: "Iceberry", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1486406146926-c627a92ad1ab"), gallery: "[]", tags: "[]" },
    { slug: "isbike-yazilim", title: "isbike Yazılım", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1497366811353-6870744d04b2"), gallery: "[]", tags: "[]" },
    { slug: "levent-office", title: "Levent Office", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1497366216548-37526070297c"), gallery: "[]", tags: "[]" },
    { slug: "maxi-doner", title: "Maxi Döner", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1463936677720-2aff4c7d3e30"), gallery: "[]", tags: "[]" },
    { slug: "mega-gardenpark", title: "Mega Gardenpark", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1518895949257-7621c3c236d0"), gallery: "[]", tags: "[]" },
    { slug: "moom-lounge", title: "MOOM Lounge", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1551882547-ff40c63fe5fa"), gallery: "[]", tags: "[]" },
    { slug: "olio-pizza", title: "Olio Pizza", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1554118811-83eefd975929"), gallery: "[]", tags: "[]" },
    { slug: "revmen", title: "Revmen", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1502977249-613b9b054c45"), gallery: "[]", tags: "[]" },
    { slug: "romatem-move", title: "Romatem Move", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1486406146926-c627a92ad1ab"), gallery: "[]", tags: "[]" },
    { slug: "saray-insaat", title: "Saray İnşaat", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1497366216548-37526070297c"), gallery: "[]", tags: "[]" },
    { slug: "tallylife", title: "Tallylife", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1463936677720-2aff4c7d3e30"), gallery: "[]", tags: "[]" },
    { slug: "tm-etil-insaat", title: "TM Etil İnşaat", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1551882547-ff40c63fe5fa"), gallery: "[]", tags: "[]" },
    { slug: "yesilcam-cafe", title: "Yeşilçam Cafe", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1559339352-11d035aa65de"), gallery: "[]", tags: "[]" },
    { slug: "vogs-coffee", title: "Vogs Coffee", summary: "Yapay dikey bahçe dekorasyonu", content: "Mekana harika bir yapay dikey bahçe dekorasyonu gerçekleştirdik.", location: "İstanbul", projectType: "Yapay Dikey Bahçe", duration: "2 Hafta", coverImage: img("photo-1554118811-83eefd975929"), gallery: "[]", tags: "[]" },
  ];
  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {},
      create: proj,
    });
  }

  // Admin kullanıcı
  const adminPassword = await hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@dikeyyapaybahce.com" },
    update: {},
    create: {
      email: "admin@dikeyyapaybahce.com",
      name: "Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  // Site ayarları
  const settings = [
    { key: "site_name", value: "Dikey Yapay Çiçek" },
    { key: "phone", value: "0(507) 884 66 03" },
    { key: "email", value: "info@dikeyyapaybahce.com" },
    { key: "address", value: "Nuripaşa Mah. Merve Cad. No:73/A, Zeytinburnu / İstanbul" },
    { key: "whatsapp", value: "905078846603" },
    { key: "free_shipping_threshold", value: "2000" },
    { key: "shipping_cost", value: "49" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // Kuponlar
  const coupons = [
    { code: "SEPET5", type: "PERCENT", value: 5, minOrder: 0, maxUses: 1000, isActive: true },
    { code: "HOSGELDIN10", type: "PERCENT", value: 10, minOrder: 1000, maxUses: 100, isActive: true },
    { code: "BAYRAM50", type: "FIXED", value: 50, minOrder: 500, maxUses: 50, isActive: true },
  ];
  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
