import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, name, email, title, body: reviewBody, rating } = body;

    if (!productId || !name || !reviewBody || !rating) {
      return NextResponse.json(
        { error: "Eksik alanlar" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Geçersiz puan" },
        { status: 400 }
      );
    }

    // Ürün var mı kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    // Yorumu oluştur (pending durumda)
    await prisma.review.create({
      data: {
        productId,
        userId: `guest-${Date.now()}`,
        rating: Math.round(rating),
        title: title ?? null,
        body: reviewBody,
        images: "[]",
        verified: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Yorum oluşturma hatası:", err);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
