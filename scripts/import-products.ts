/**
 * cicekyapay.com ürünlerini Prisma'ya import et
 * Çalıştırma: npx tsx scripts/import-products.ts
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();
const SCRAPED_DIR = join(process.cwd(), "scraped");
const PUBLIC_PRODUCTS = join(process.cwd(), "public", "products");

if (!existsSync(PUBLIC_PRODUCTS)) mkdirSync(PUBLIC_PRODUCTS, { recursive: true });

// Kategori eşleştirme
const categoryMap: Record<string, string> = {
  "Yapay Ağaçlar": "yapay-agac",
  "Yapay Çiçekler": "yapay-cicek",
  "Yapay Sarmaşıklar": "sarmasik",
  "Yapay Duvar Panelleri": "yapay-duvar-panelleri",
  "Yapay Güller": "yapay-guller",
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ı/g, "i").replace(/İ/g, "i")
    .replace(/ş/g, "s").replace(/Ş/g, "s")
    .replace(/ğ/g, "g").replace(/Ğ/g, "g")
    .replace(/ü/g, "u").replace(/Ü/g, "u")
    .replace(/ö/g, "o").replace(/Ö/g, "o")
    .replace(/ç/g, "c").replace(/Ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  console.log("=== Ürün import başlıyor ===\n");

  const data = JSON.parse(readFileSync(join(SCRAPED_DIR, "products.json"), "utf-8"));

  // Eksik kategorileri oluştur
  for (const [name, slug] of Object.entries(categoryMap)) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.category.create({
        data: { slug, name: name, order: 10 },
      });
      console.log(`Kategori oluşturuldu: ${slug}`);
    }
  }

  // Kategori ID'lerini al
  const categories = await prisma.category.findMany();
  const catIdMap = new Map(categories.map((c) => [c.slug, c.id]));

  let imported = 0;
  let skipped = 0;
  let imagesCopied = 0;

  for (const p of data) {
    // Slug çakışması kontrolü
    const existing = await prisma.product.findUnique({ where: { slug: p.handle } });
    if (existing) {
      skipped++;
      continue;
    }

    // SKU çakışması kontrolü
    const sku = p.variants[0]?.sku ?? `DKY-${p.id}`;
    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      skipped++;
      continue;
    }

    // İlk koleksiyon → kategori
    const firstCollection = p.collections[0] ?? "Yapay Çiçekler";
    const catSlug = categoryMap[firstCollection] ?? "yapay-cicek";
    const categoryId = catIdMap.get(catSlug) ?? catIdMap.get("yapay-cicek");
    if (!categoryId) {
      console.error(`Kategori bulunamadı: ${catSlug}`);
      continue;
    }

    // Açıklama
    const description = stripHtml(p.bodyHtml ?? "");
    const shortDesc = description.substring(0, 120) + (description.length > 120 ? "..." : "");

    // Fiyat
    const basePrice = parseFloat(p.variants[0]?.price ?? "0");
    const compareAtPrice = p.variants[0]?.compareAtPrice ? parseFloat(p.variants[0].compareAtPrice) : null;
    const discountPrice = compareAtPrice && compareAtPrice > basePrice ? compareAtPrice : null;
    const finalBasePrice = discountPrice ?? basePrice;
    const finalDiscountPrice = discountPrice ? basePrice : null;

    // Stok
    const available = p.variants.some((v: any) => v.available);
    const stock = available ? 50 : 0;

    // Görselleri kopyala
    const productImgDir = join(PUBLIC_PRODUCTS, p.handle);
    if (!existsSync(productImgDir)) mkdirSync(productImgDir, { recursive: true });

    const images: { url: string; alt: string; width: number; height: number; order: number }[] = [];
    const scrapedImgDir = join(SCRAPED_DIR, "images", p.handle);
    if (existsSync(scrapedImgDir)) {
      const imgFiles = readdirSync(scrapedImgDir).sort();
      for (let i = 0; i < imgFiles.length; i++) {
        const filename = imgFiles[i];
        const destPath = join(productImgDir, filename);
        const srcPath = join(scrapedImgDir, filename);
        copyFileSync(srcPath, destPath);
        imagesCopied++;

        const origImg = p.images[i];
        images.push({
          url: `/products/${p.handle}/${filename}`,
          alt: origImg?.alt ?? p.title,
          width: origImg?.width ?? 1200,
          height: origImg?.height ?? 1200,
          order: i,
        });
      }
    }

    // Ürünü oluştur
    const product = await prisma.product.create({
      data: {
        slug: p.handle,
        name: p.title,
        shortDesc,
        description: description || shortDesc,
        basePrice: finalBasePrice,
        discountPrice: finalDiscountPrice,
        currency: "TRY",
        sku,
        stock,
        rating: 0,
        reviewCount: 0,
        isActive: available,
        isFeatured: false,
        isNew: true,
        tags: typeof p.tags === "string" ? p.tags : Array.isArray(p.tags) ? p.tags.join(",") : "",
        categoryId,
        images: {
          create: images,
        },
      },
    });

    // Varyant oluştur (eğer option1 "Default Title" değilse)
    const variant = p.variants[0];
    if (variant && variant.option1 && variant.option1 !== "Default Title") {
      await prisma.variant.create({
        data: {
          productId: product.id,
          type: "variant",
          name: variant.option1,
          sku: variant.sku ?? sku,
          stock: variant.available ? 50 : 0,
          priceDelta: variant.price ? parseFloat(variant.price) - finalBasePrice : null,
        },
      });
    }

    imported++;
    if (imported % 10 === 0) console.log(`  ${imported} ürün import edildi...`);
  }

  console.log(`\n=== ÖZET ===`);
  console.log(`Import edilen: ${imported}`);
  console.log(`Atlanan (çakışma): ${skipped}`);
  console.log(`Kopyalanan görsel: ${imagesCopied}`);
  console.log(`\nÜrünler: /public/products/[slug]/`);
}

main()
  .catch((err) => {
    console.error("Hata:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
