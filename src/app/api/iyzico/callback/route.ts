import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { completeIyzico3DSPayment } from "@/lib/iyzico";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { sendOrderSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

function htmlRedirect(targetUrl: string) {
  const safeUrl = targetUrl.replace(/"/g, "&quot;");
  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${safeUrl}" />
  <title>Yönlendiriliyor...</title>
</head>
<body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#fff;color:#1e2426;">
  <p>Ödeme sonucu işleniyor, lütfen bekleyin...</p>
  <script>window.top.location.href = ${JSON.stringify(targetUrl)};</script>
</body>
</html>`;
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * iyzico 3D Secure Callback Endpoint (/api/iyzico/callback)
 * Banka 3D doğrulaması tamamlandığında iyzico bu adrese application/x-www-form-urlencoded POST gönderir.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const status = String(formData.get("status") ?? "");
    const paymentId = String(formData.get("paymentId") ?? "");
    const conversationId = String(formData.get("conversationId") ?? "");
    const conversationData = String(formData.get("conversationData") ?? "");
    const mdStatus = String(formData.get("mdStatus") ?? "");

    const orderNumber = conversationId.split("-")[0] || conversationId;

    if (status !== "success" || mdStatus !== "1" || !paymentId) {
      const msg = encodeURIComponent(
        "3D Secure banka doğrulaması tamamlanamadı veya iptal edildi. Lütfen tekrar deneyin."
      );
      return htmlRedirect(`${SITE_URL}/odeme?error=${msg}`);
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      const msg = encodeURIComponent("Sipariş kaydı bulunamadı.");
      return htmlRedirect(`${SITE_URL}/odeme?error=${msg}`);
    }

    if (order.status === "PAID") {
      return htmlRedirect(`${SITE_URL}/siparis/${order.orderNumber}`);
    }

    // Adım 5: iyzico /payment/3dsecure/auth çağrısı ile tahsilatı resmileştir
    const authResult = await completeIyzico3DSPayment({
      paymentId,
      conversationId,
      conversationData: conversationData || undefined,
    });

    if (authResult.status !== "success") {
      const msg = encodeURIComponent(
        authResult.errorMessage ?? "Ödeme banka tarafından onaylanmadı."
      );
      return htmlRedirect(`${SITE_URL}/odeme?error=${msg}`);
    }

    let orderItems: Array<{
      productId: string;
      variantId?: string;
      name: string;
      price: number;
      quantity: number;
      variant?: string;
    }> = [];
    try {
      orderItems = JSON.parse(order.items);
    } catch {
      orderItems = [];
    }

    // Siparişi PAID olarak güncelle ve stokları düş
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { orderNumber: order.orderNumber },
        data: {
          status: "PAID",
          paymentRef: authResult.paymentId ?? paymentId,
          total: authResult.paidPrice ? Number(authResult.paidPrice) : order.total,
        },
      });

      for (const item of orderItems) {
        if (item.variantId) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    });

    // Bildirim e-postası ve SMS
    if (order.email) {
      sendOrderConfirmationEmail(
        order.email,
        order.orderNumber,
        authResult.paidPrice ? Number(authResult.paidPrice) : order.total,
        orderItems
      ).catch((err) => console.error("E-posta gönderilemedi:", err));
    }
    if (order.phone) {
      sendOrderSms(
        order.phone,
        order.orderNumber,
        authResult.paidPrice ? Number(authResult.paidPrice) : order.total
      ).catch((err) => console.error("SMS gönderilemedi:", err));
    }

    return htmlRedirect(`${SITE_URL}/siparis/${order.orderNumber}`);
  } catch (err) {
    console.error("iyzico 3DS callback hatası:", err);
    const msg = encodeURIComponent("Ödeme doğrulaması sırasında bir hata oluştu.");
    return htmlRedirect(`${SITE_URL}/odeme?error=${msg}`);
  }
}
