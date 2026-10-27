import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 } },
      select: {
        id: true,
        name: true,
        slug: true,
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
    });

    const items = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.discountPrice ?? p.basePrice,
      basePrice: p.basePrice,
      stock: p.stock,
      isFeatured: p.isFeatured,
      categoryName: p.category.name,
      image: p.images[0]?.url || `/products/${p.slug}/1.jpg`,
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
