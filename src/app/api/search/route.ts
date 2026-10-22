import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normalizeTr(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(req: NextRequest) {
  try {
    const rawQuery = req.nextUrl.searchParams.get("q") ?? "";
    const q = normalizeTr(rawQuery);

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          sku: true,
          shortDesc: true,
          tags: true,
          basePrice: true,
          discountPrice: true,
          stock: true,
          isFeatured: true,
          category: { select: { name: true, slug: true } },
          images: {
            orderBy: { order: "asc" },
            take: 1,
            select: { url: true },
          },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { products: true } },
        },
        orderBy: { order: "asc" },
      }),
    ]);

    // Sorgu boşsa popüler / öne çıkan ilk 6 ürünü ve tüm kategorileri döndür
    if (!q) {
      return NextResponse.json({
        categories: categories.map((c) => ({
          name: c.name,
          slug: c.slug,
          count: c._count.products,
        })),
        products: products.slice(0, 6).map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          price: p.discountPrice ?? p.basePrice,
          categoryName: p.category.name,
          image: p.images[0]?.url || `/products/${p.slug}/1.jpg`,
        })),
        totalProducts: products.length,
      });
    }

    const tokens = q.split(" ").filter(Boolean);

    const matchedCategories = categories
      .filter((c) => {
        const hay = normalizeTr(`${c.name} ${c.slug}`);
        return tokens.every((t) => hay.includes(t));
      })
      .map((c) => ({
        name: c.name,
        slug: c.slug,
        count: c._count.products,
      }));

    const scoredProducts = products
      .map((p) => {
        const nameNorm = normalizeTr(p.name);
        const catNorm = normalizeTr(p.category.name);
        const descNorm = normalizeTr(`${p.shortDesc} ${p.tags} ${p.sku}`);
        const fullHay = `${nameNorm} ${catNorm} ${descNorm}`;

        if (!tokens.every((t) => fullHay.includes(t))) {
          return null;
        }

        let score = 0;
        for (const t of tokens) {
          if (nameNorm.includes(t)) score += 10;
          if (catNorm.includes(t)) score += 5;
          if (descNorm.includes(t)) score += 2;
        }
        if (p.isFeatured) score += 1;

        return {
          score,
          item: {
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            price: p.discountPrice ?? p.basePrice,
            categoryName: p.category.name,
            image: p.images[0]?.url || `/products/${p.slug}/1.jpg`,
          },
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      categories: matchedCategories,
      products: scoredProducts.slice(0, 8).map((x) => x.item),
      totalMatched: scoredProducts.length,
    });
  } catch {
    return NextResponse.json({ categories: [], products: [], totalMatched: 0 });
  }
}
