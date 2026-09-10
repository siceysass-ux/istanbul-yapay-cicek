"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendShippingEmail } from "@/lib/email";
import { sendShippingSms } from "@/lib/sms";
import { getCargoProviderName } from "@/lib/cargo";

export async function updateOrderStatusAction(
  orderNumber: string,
  status: string
): Promise<{ error?: string }> {
  try {
    await prisma.order.update({
      where: { orderNumber },
      data: { status },
    });
    revalidatePath(`/admin/siparisler/${orderNumber}`);
    revalidatePath("/admin/siparisler");
    revalidatePath("/admin");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "Durum güncellenemedi." };
  }
}

export async function updateCargoTrackingAction(
  orderNumber: string,
  cargoProvider: string,
  cargoCode: string
): Promise<{ error?: string }> {
  try {
    const order = await prisma.order.update({
      where: { orderNumber },
      data: { cargoProvider, cargoCode, status: "SHIPPED" },
    });

    revalidatePath(`/admin/siparisler/${orderNumber}`);
    revalidatePath("/admin/siparisler");
    revalidatePath("/admin/kargo");

    // Kargo bildirimi (async, engellemez)
    const providerName = getCargoProviderName(cargoProvider);
    if (order.email) {
      sendShippingEmail(order.email, orderNumber, providerName, cargoCode).catch((e) =>
        console.error("Kargo e-posta:", e)
      );
    }
    if (order.phone) {
      sendShippingSms(order.phone, orderNumber, providerName, cargoCode).catch((e) =>
        console.error("Kargo SMS:", e)
      );
    }

    return {};
  } catch (err) {
    console.error(err);
    return { error: "Kargo bilgisi güncellenemedi." };
  }
}
