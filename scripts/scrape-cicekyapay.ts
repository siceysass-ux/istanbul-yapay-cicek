/**
 * cicekyapay.com scraper
 * Tüm kategorilerden ürünleri çeker, XML üretir, görselleri indirir.
 * Çalıştırma: npx tsx scripts/scrape-cicekyapay.ts
 */

import { writeFileSync, mkdirSync, existsSync, createWriteStream } from "fs";
import { join, basename } from "path";
import { pipeline } from "stream/promises";

const SITE = "https://cicekyapay.com";
const OUT_DIR = join(process.cwd(), "scraped");
const IMG_DIR = join(OUT_DIR, "images");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

const collections = [
  { slug: "yapay-agac", name: "Yapay Ağaçlar" },
  { slug: "yapay-cicekler", name: "Yapay Çiçekler" },
  { slug: "yapay-sarmasiklar", name: "Yapay Sarmaşıklar" },
  { slug: "yapay-duvar-panelleri", name: "Yapay Duvar Panelleri" },
  { slug: "yapay-guller", name: "Yapay Güller" },
];

interface Variant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  sku?: string;
  available: boolean;
  option1?: string;
  option2?: string;
  option3?: string;
}

interface Image {
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  bodyHtml: string;
  productType: string;
  vendor: string;
  tags: string;
  variants: Variant[];
  images: Image[];
  collections: string[];
}

async function fetchCollection(slug: string): Promise<any[]> {
  const url = `${SITE}/collections/${slug}/products.json?limit=250`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${slug}`);
  const data = await res.json();
  return data.products ?? [];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeXml(s: unknown): string {
  const str = String(s ?? "");
  return str
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/\u0022/g, "\u0026quot;")
    .replace(/\u0027/g, "\u0026apos;");
}

async function downloadImage(url: string, filePath: string): Promise<boolean> {
  if (existsSync(filePath)) return true;
  try {
    const res = await fetch(url);
    if (!res.ok || !res.body) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(filePath, buf);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("=== cicekyapay.com scraper ===\n");

  // 1. Tüm kategorileri çek
  const productMap = new Map<string, Product>();
  const collectionMap = new Map<string, string[]>();

  for (const col of collections) {
    console.log(`Çekiliyor: ${col.slug}...`);
    try {
      const products = await fetchCollection(col.slug);
      console.log(`  ${products.length} ürün`);
      const handles: string[] = [];

      for (const p of products) {
        handles.push(p.handle);
        if (productMap.has(p.handle)) {
          // Koleksiyon ekle
          const existing = productMap.get(p.handle)!;
          if (!existing.collections.includes(col.name)) {
            existing.collections.push(col.name);
          }
        } else {
          productMap.set(p.handle, {
            id: String(p.id),
            title: p.title,
            handle: p.handle,
            bodyHtml: p.body_html ?? "",
            productType: p.product_type ?? "",
            vendor: p.vendor ?? "",
            tags: p.tags ?? "",
            variants: (p.variants ?? []).map((v: any) => ({
              id: String(v.id),
              title: v.title,
              price: v.price,
              compareAtPrice: v.compare_at_price,
              sku: v.sku,
              available: v.available,
              option1: v.option1,
              option2: v.option2,
              option3: v.option3,
            })),
            images: (p.images ?? []).map((img: any) => ({
              id: String(img.id),
              src: img.src,
              alt: img.alt ?? undefined,
              width: img.width,
              height: img.height,
            })),
            collections: [col.name],
          });
        }
      }
      collectionMap.set(col.name, handles);
    } catch (err) {
      console.error(`  HATA: ${err}`);
    }
  }

  const allProducts = Array.from(productMap.values());
  console.log(`\nToplam unique ürün: ${allProducts.length}`);

  // 2. JSON kaydet
  writeFileSync(
    join(OUT_DIR, "products.json"),
    JSON.stringify(allProducts, null, 2),
    "utf-8"
  );
  console.log("products.json kaydedildi");

  // 3. Görselleri indir
  console.log("\nGörseller indiriliyor...");
  let imgCount = 0;
  let imgFail = 0;
  for (const p of allProducts) {
    const productImgDir = join(IMG_DIR, p.handle);
    if (!existsSync(productImgDir)) mkdirSync(productImgDir, { recursive: true });
    for (let i = 0; i < p.images.length; i++) {
      const img = p.images[i];
      const ext = img.src.split(".").pop()?.split("?")[0] ?? "jpg";
      const filename = `${i + 1}.${ext}`;
      const filePath = join(productImgDir, filename);
      const ok = await downloadImage(img.src, filePath);
      if (ok) imgCount++;
      else imgFail++;
    }
  }
  console.log(`  İndirilen: ${imgCount}, Başarısız: ${imgFail}`);

  // 4. XML üret
  console.log("\nXML üretiliyor...");
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<products>');

  for (const p of allProducts) {
    const description = stripHtml(p.bodyHtml).substring(0, 2000);
    const price = p.variants[0]?.price ?? "0";
    const compareAtPrice = p.variants[0]?.compareAtPrice;
    const available = p.variants.some((v) => v.available);
    const sku = p.variants[0]?.sku ?? "";

    lines.push("  <product>");
    lines.push(`    <id>${escapeXml(p.id)}</id>`);
    lines.push(`    <handle>${escapeXml(p.handle)}</handle>`);
    lines.push(`    <title>${escapeXml(p.title)}</title>`);
    lines.push(`    <type>${escapeXml(p.productType)}</type>`);
    lines.push(`    <vendor>${escapeXml(p.vendor)}</vendor>`);
    lines.push(`    <tags>${escapeXml(p.tags)}</tags>`);
    lines.push(`    <price>${escapeXml(price)}</price>`);
    if (compareAtPrice) {
      lines.push(`    <compareAtPrice>${escapeXml(compareAtPrice)}</compareAtPrice>`);
    }
    lines.push(`    <sku>${escapeXml(sku)}</sku>`);
    lines.push(`    <available>${available}</available>`);
    lines.push(`    <description>${escapeXml(description)}</description>`);
    lines.push(`    <bodyHtml><![CDATA[${p.bodyHtml}]]></bodyHtml>`);

    // Koleksiyonlar
    lines.push("    <collections>");
    for (const c of p.collections) {
      lines.push(`      <collection>${escapeXml(c)}</collection>`);
    }
    lines.push("    </collections>");

    // Görseller
    lines.push("    <images>");
    for (let i = 0; i < p.images.length; i++) {
      const img = p.images[i];
      const ext = img.src.split(".").pop()?.split("?")[0] ?? "jpg";
      const localPath = `images/${p.handle}/${i + 1}.${ext}`;
      lines.push("      <image>");
      lines.push(`        <id>${escapeXml(img.id)}</id>`);
      lines.push(`        <src>${escapeXml(img.src)}</src>`);
      lines.push(`        <localPath>${escapeXml(localPath)}</localPath>`);
      if (img.alt) lines.push(`        <alt>${escapeXml(img.alt)}</alt>`);
      if (img.width) lines.push(`        <width>${img.width}</width>`);
      if (img.height) lines.push(`        <height>${img.height}</height>`);
      lines.push("      </image>");
    }
    lines.push("    </images>");

    // Varyantlar (opsiyonlar)
    lines.push("    <variants>");
    for (const v of p.variants) {
      lines.push("      <variant>");
      lines.push(`        <id>${escapeXml(v.id)}</id>`);
      lines.push(`        <title>${escapeXml(v.title)}</title>`);
      lines.push(`        <price>${escapeXml(v.price)}</price>`);
      if (v.compareAtPrice) {
        lines.push(`        <compareAtPrice>${escapeXml(v.compareAtPrice)}</compareAtPrice>`);
      }
      if (v.sku) lines.push(`        <sku>${escapeXml(v.sku)}</sku>`);
      lines.push(`        <available>${v.available}</available>`);
      if (v.option1) lines.push(`        <option1>${escapeXml(v.option1)}</option1>`);
      if (v.option2) lines.push(`        <option2>${escapeXml(v.option2)}</option2>`);
      if (v.option3) lines.push(`        <option3>${escapeXml(v.option3)}</option3>`);
      lines.push("      </variant>");
    }
    lines.push("    </variants>");

    lines.push("  </product>");
  }
  lines.push("</products>");

  writeFileSync(join(OUT_DIR, "products.xml"), lines.join("\n"), "utf-8");
  console.log(`products.xml kaydedildi (${allProducts.length} ürün)`);

  // 5. Özet rapor
  const totalImages = allProducts.reduce((a, p) => a + p.images.length, 0);
  const totalVariants = allProducts.reduce((a, p) => a + p.variants.length, 0);
  const multiVariant = allProducts.filter((p) => p.variants.length > 1).length;

  console.log("\n=== ÖZET ===");
  console.log(`Toplam ürün: ${allProducts.length}`);
  console.log(`Toplam görsel: ${totalImages}`);
  console.log(`Toplam varyant: ${totalVariants}`);
  console.log(`Çoklu varyantlı ürün: ${multiVariant}`);
  console.log(`Kategori sayısı: ${collections.length}`);
  console.log(`\nÇıktı: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
