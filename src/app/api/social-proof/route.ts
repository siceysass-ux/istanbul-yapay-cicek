import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 } },
      select: {
        name: true,
        slug: true,
        images: {
          orderBy: { order: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    });

    const items = products.map((p) => ({
      name: p.name,
      slug: p.slug,
      image: p.images[0]?.url || `/products/${p.slug}/1.jpg`,
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
