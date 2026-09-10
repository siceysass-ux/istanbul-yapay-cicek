/**
 * JSON'dan XML üret (görseller zaten indirildi)
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const OUT_DIR = join(process.cwd(), "scraped");

function escapeXml(s: unknown): string {
  const str = String(s ?? "");
  return str
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/\u0022/g, "\u0026quot;")
    .replace(/\u0027/g, "\u0026apos;");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const data = JSON.parse(readFileSync(join(OUT_DIR, "products.json"), "utf-8"));

const lines: string[] = [];
lines.push('<?xml version="1.0" encoding="UTF-8"?>');
lines.push('<products>');

for (const p of data) {
  const description = stripHtml(p.bodyHtml ?? "").substring(0, 2000);
  const price = p.variants[0]?.price ?? "0";
  const compareAtPrice = p.variants[0]?.compareAtPrice;
  const available = p.variants.some((v: any) => v.available);
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
  lines.push(`    <bodyHtml><![CDATA[${p.bodyHtml ?? ""}]]></bodyHtml>`);

  lines.push("    <collections>");
  for (const c of p.collections) {
    lines.push(`      <collection>${escapeXml(c)}</collection>`);
  }
  lines.push("    </collections>");

  lines.push("    <images>");
  for (let i = 0; i < p.images.length; i++) {
    const img = p.images[i];
    const ext = (img.src ?? "").split(".").pop()?.split("?")[0] ?? "jpg";
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

// Özet
const totalImages = data.reduce((a: number, p: any) => a + p.images.length, 0);
const totalVariants = data.reduce((a: number, p: any) => a + p.variants.length, 0);
const multiVariant = data.filter((p: any) => p.variants.length > 1).length;

console.log("=== ÖZET ===");
console.log(`Toplam ürün: ${data.length}`);
console.log(`Toplam görsel: ${totalImages}`);
console.log(`Toplam varyant: ${totalVariants}`);
console.log(`Çoklu varyantlı ürün: ${multiVariant}`);
console.log(`\nÇıktı: ${OUT_DIR}/products.xml`);
