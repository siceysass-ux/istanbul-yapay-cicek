import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const revalidate = 3600;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const itemsXml = products
    .map((p) => {
      const price = (p.discountPrice ?? p.basePrice).toFixed(2);
      const primaryImg = p.images[0]?.url
        ? p.images[0].url.startsWith("http")
          ? p.images[0].url
          : `${SITE_URL}${p.images[0].url}`
        : `${SITE_URL}/og-image.jpg`;
      const additionalImgs = p.images
        .slice(1, 5)
        .map((im) => {
          const u = im.url.startsWith("http") ? im.url : `${SITE_URL}${im.url}`;
          return `      <g:additional_image_link>${escapeXml(u)}</g:additional_image_link>`;
        })
        .join("\n");
      const availability = p.stock > 0 ? "in_stock" : "out_of_stock";
      const shippingPrice = Number(price) >= 2000 ? "0.00 TRY" : "49.00 TRY";

      return `    <item>
      <g:id>${escapeXml(p.sku)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(p.shortDesc || p.description)}</g:description>
      <g:link>${escapeXml(`${SITE_URL}/urun/${p.slug}`)}</g:link>
      <g:image_link>${escapeXml(primaryImg)}</g:image_link>
${additionalImgs ? additionalImgs + "\n" : ""}      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price} TRY</g:price>
      <g:brand>Çiçek Yapay</g:brand>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>Home &amp; Garden &gt; Decor &gt; Artificial Flora</g:google_product_category>
      <g:product_type>${escapeXml(p.category.name)}</g:product_type>
      <g:shipping>
        <g:country>TR</g:country>
        <g:service>Standart Kargo</g:service>
        <g:price>${shippingPrice}</g:price>
      </g:shipping>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Çiçek Yapay — Google Merchant Center Ürün Feed</title>
    <link>${SITE_URL}</link>
    <description>Doğal ahşap gövdeli yapay ağaçlar, tasarım saksılı bitkiler, bonsai ve dev dekoratif çiçekler.</description>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
