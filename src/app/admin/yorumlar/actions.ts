"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

async function syncProductReviewStats(productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId, status: "APPROVED" },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const count = agg._count.rating ?? 0;
  const avg = count > 0 ? Math.round((agg._avg.rating ?? 0) * 10) / 10 : 0;

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { rating: avg, reviewCount: count },
    select: { slug: true },
  });

  revalidatePath("/");
  revalidatePath("/kategori/[slug]", "page");
  revalidatePath(`/urun/${updatedProduct.slug}`);
  revalidatePath("/admin/yorumlar");
}

export async function approveReviewAction(id: string): Promise<{ error?: string }> {
  try {
    const rev = await prisma.review.update({
      where: { id },
      data: { status: "APPROVED", verified: true },
    });
    await syncProductReviewStats(rev.productId);
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Yorum onaylanamadı." };
  }
}

export async function rejectReviewAction(id: string): Promise<{ error?: string }> {
  try {
    const rev = await prisma.review.update({
      where: { id },
      data: { status: "REJECTED" },
    });
    await syncProductReviewStats(rev.productId);
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Yorum reddedilemedi." };
  }
}

export async function deleteReviewAction(id: string): Promise<{ error?: string }> {
  try {
    const rev = await prisma.review.delete({ where: { id } });
    await syncProductReviewStats(rev.productId);
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Yorum silinemedi." };
  }
}
