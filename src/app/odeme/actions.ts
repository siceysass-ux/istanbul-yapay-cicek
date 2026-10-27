"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  initializeIyzico3DSPayment,
  checkIyzicoInstallments,
  isIyzicoConfigured,
} from "@/lib/iyzico";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { sendOrderSms } from "@/lib/sms";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export interface CheckoutItemInput {
  id: string;
  variantId?: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface CheckoutFormInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  tcIdentity?: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  notes?: string;
  couponCode?: string | null;
  items: CheckoutItemInput[];
  subtotal: number;
  total: number;
  // Kart bilgileri (sadece kart ile ödemede)
  cardHolderName?: string;
  cardNumber?: string;
  expireMonth?: string;
  expireYear?: string;
  cvc?: string;
  installment?: number;
}

export interface CheckoutResult {
  error?: string;
  orderNumber?: string;
  threeDSHtmlContent?: string;
  redirectUrl?: string;
}

export async function createOrderAction(
  formData: FormData
): Promise<CheckoutResult> {
  const payloadRaw = formData.get("payload") as string | null;
  if (!payloadRaw) {
    return { error: "Geçersiz sipariş verisi." };
  }

  let data: CheckoutFormInput;
  try {
    data = JSON.parse(payloadRaw) as CheckoutFormInput;
  } catch {
    return { error: "Sipariş verisi okunamadı." };
  }

  // Temel doğrulama
  if (!data.items || data.items.length === 0) {
    return { error: "Sepetiniz boş." };
  }
  if (!data.name || !data.email || !data.phone || !data.address || !data.city) {
    return { error: "Teslimat bilgileri eksik." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { error: "Geçerli bir e-posta adresi girin." };
  }
  const phoneClean = data.phone.replace(/\D/g, "");
  if (phoneClean.length < 10) {
    return { error: "Geçerli bir telefon numarası girin." };
  }

  // Stok ve fiyat doğrulama (server-side, güvenilir)
  const productIds = data.items.map((i) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true },
  });

  const orderItems: {
    productId: string;
    variantId?: string;
    name: string;
    price: number;
    quantity: number;
    variant?: string;
  }[] = [];

  let serverSubtotal = 0;

  for (const item of data.items) {
    const product = products.find((p) => p.id === item.id);
    if (!product || !product.isActive) {
      return { error: `${item.name} artık satışta değil.` };
    }

    const unitPrice = product.discountPrice ?? product.basePrice;
    let variantStock = product.stock;
    let priceDelta = 0;

    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return { error: `${item.name} için seçilen varyant bulunamadı.` };
      }
      variantStock = variant.stock;
      priceDelta = variant.priceDelta ?? 0;
    }

    const finalUnitPrice = unitPrice + priceDelta;
    if (Math.abs(finalUnitPrice - item.price) > 0.01) {
      return { error: `${item.name} fiyatı değişmiş. Sepetinizi güncelleyin.` };
    }

    if (item.quantity > variantStock) {
      return {
        error: `${item.name} için yeterli stok yok (kalan: ${variantStock}).`,
      };
    }

    orderItems.push({
      productId: product.id,
      variantId: item.variantId,
      name: product.name,
      price: finalUnitPrice,
      quantity: item.quantity,
      variant: item.variant,
    });
    serverSubtotal += finalUnitPrice * item.quantity;
  }

  // Kupon doğrulama
  let discount = 0;
  let couponCode: string | null = null;
  if (data.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: data.couponCode.toUpperCase() },
    });
    if (!coupon || !coupon.isActive) {
      return { error: "Geçersiz kupon kodu." };
    }
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return { error: "Bu kupon kullanım sınırına ulaştı." };
    }
    if (coupon.endsAt && new Date(coupon.endsAt) < new Date()) {
      return { error: "Bu kuponun süresi dolmuş." };
    }
    if (serverSubtotal < coupon.minOrder) {
      return {
        error: `Bu kupon en az ${coupon.minOrder}₺ alışveriş için geçerlidir.`,
      };
    }
    couponCode = coupon.code;
    discount =
      coupon.type === "PERCENT"
        ? Math.round((serverSubtotal * coupon.value) / 100)
        : coupon.value;
  }

  const shipping = Number(data.shippingCost || 0);
  const baseTotal = Math.max(1, serverSubtotal + shipping - discount);

  // Sipariş numarası oluştur
  const orderNumber = `DYC${Date.now().toString().slice(-8)}${Math.floor(
    Math.random() * 100
  )
    .toString()
    .padStart(2, "0")}`;

  // Kredi/Banka Kartı ile ödeme — iyzico 3D Secure
  if (data.paymentMethod === "card") {
    if (!isIyzicoConfigured()) {
      return {
        error: "Kart ile ödeme şu anda yapılandırılmamış. Lütfen bizimle iletişime geçin.",
      };
    }

    const cleanCardNum = (data.cardNumber ?? "").replace(/\D/g, "");
    if (
      !data.cardHolderName ||
      cleanCardNum.length < 15 ||
      !data.expireMonth ||
      !data.expireYear ||
      !data.cvc
    ) {
      return { error: "Lütfen tüm kart bilgilerini eksiksiz girin." };
    }

    const selectedInstallment = Math.max(1, Number(data.installment ?? 1));
    let paidPrice = baseTotal;

    // Taksit seçildiyse iyzico'dan güncel taksitli toplam tutarı doğrula
    if (selectedInstallment > 1) {
      const binRes = await checkIyzicoInstallments(cleanCardNum.slice(0, 6), baseTotal);
      const matchedOpt = binRes.installmentPrices?.find(
        (opt) => opt.installmentNumber === selectedInstallment
      );
      if (matchedOpt && matchedOpt.totalPrice > 0) {
        paidPrice = matchedOpt.totalPrice;
      }
    }

    const hdrs = await headers();
    const clientIp =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "85.34.78.112";

    const [name, ...surnameParts] = data.name.trim().split(/\s+/);
    const surname = surnameParts.join(" ") || name;

    // 3DS callback geldiğinde eşleşmesi için siparişi PENDING olarak kaydet
    let createdOrderId: string | null = null;
    try {
      const pendingOrder = await prisma.order.create({
        data: {
          orderNumber,
          status: "PENDING",
          items: JSON.stringify(orderItems),
          subtotal: serverSubtotal,
          shipping,
          discount,
          total: paidPrice,
          currency: "TRY",
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          phone: data.phone,
          email: data.email,
          notes: data.notes,
          paymentMethod: "card",
          cargoProvider: data.shippingMethod,
        },
      });
      createdOrderId = pendingOrder.id;
    } catch (err) {
      console.error("Sipariş ön kaydı hatası:", err);
      return { error: "Sipariş başlatılırken bir hata oluştu." };
    }

    const iyzico3DS = await initializeIyzico3DSPayment({
      price: serverSubtotal,
      paidPrice,
      currency: "TRY",
      installment: selectedInstallment,
      paymentChannel: "WEB",
      paymentGroup: "PRODUCT",
      paymentCard: {
        cardHolderName: data.cardHolderName,
        cardNumber: cleanCardNum,
        expireMonth: data.expireMonth,
        expireYear: data.expireYear,
        cvc: data.cvc,
      },
      buyer: {
        id: orderNumber,
        name,
        surname,
        email: data.email,
        phone: data.phone,
        identityNumber: data.tcIdentity || "11111111111",
        address: data.address,
        city: data.city,
        country: "Turkey",
        zipCode: data.postalCode || "34000",
        ip: clientIp,
      },
      shippingAddress: {
        id: orderNumber,
        name,
        surname,
        email: data.email,
        phone: data.phone,
        identityNumber: data.tcIdentity || "11111111111",
        address: data.address,
        city: data.city,
        country: "Turkey",
        zipCode: data.postalCode || "34000",
      },
      billingAddress: {
        id: orderNumber,
        name,
        surname,
        email: data.email,
        phone: data.phone,
        identityNumber: data.tcIdentity || "11111111111",
        address: data.address,
        city: data.city,
        country: "Turkey",
        zipCode: data.postalCode || "34000",
      },
      basketItems: orderItems.map((item) => ({
        id: item.productId,
        name: item.name,
        category1: "Yapay Çiçek ve Ağaç",
        itemType: "PHYSICAL" as const,
        price: item.price * item.quantity,
      })),
      conversationId: orderNumber,
      callbackUrl: `${SITE_URL}/api/iyzico/callback`,
    });

    if (iyzico3DS.status !== "success" || !iyzico3DS.threeDSHtmlContent) {
      // Başlatılamayan ön siparişi temizle
      if (createdOrderId) {
        await prisma.order.delete({ where: { id: createdOrderId } }).catch(() => {});
      }
      return {
        error: `Ödeme başlatılamadı: ${iyzico3DS.errorMessage ?? "Kart bilgilerinizi kontrol edin."}`,
      };
    }

    return {
      orderNumber,
      threeDSHtmlContent: iyzico3DS.threeDSHtmlContent,
    };
  }

  // Kapıda ödeme — doğrudan sipariş oluştur
  try {
    const order = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          status: "PENDING",
          items: JSON.stringify(orderItems),
          subtotal: serverSubtotal,
          shipping,
          discount,
          total: baseTotal,
          currency: "TRY",
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          phone: data.phone,
          email: data.email,
          notes: data.notes,
          paymentMethod: data.paymentMethod,
          cargoProvider: data.shippingMethod,
        },
      });

      for (const item of orderItems) {
        if (item.variantId) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (couponCode) {
        await tx.coupon.update({
          where: { code: couponCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      return order;
    });

    if (order.email) {
      sendOrderConfirmationEmail(order.email, orderNumber, baseTotal, orderItems).catch(
        (err) => console.error("E-posta gönderilemedi:", err)
      );
    }

    if (order.phone) {
      sendOrderSms(order.phone, orderNumber, baseTotal).catch(
        (err) => console.error("SMS gönderilemedi:", err)
      );
    }

    return {
      orderNumber,
      redirectUrl: `/siparis/${orderNumber}`,
    };
  } catch (err) {
    console.error("Sipariş oluşturma hatası:", err);
    return { error: "Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin." };
  }
}
