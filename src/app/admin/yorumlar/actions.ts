"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function approveReviewAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.review.update({
      where: { id },
      data: { status: "APPROVED", verified: true },
    });
    revalidatePath("/admin/yorumlar");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Yorum onaylanamadı." };
  }
}

export async function rejectReviewAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.review.update({
      where: { id },
      data: { status: "REJECTED" },
    });
    revalidatePath("/admin/yorumlar");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Yorum reddedilemedi." };
  }
}

export async function deleteReviewAction(id: string): Promise<{ error?: string }> {
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin/yorumlar");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Yorum silinemedi." };
  }
}
