/**
 * iyzico Sanal POS Entegrasyonu (IYZWSv2 HMAC-SHA256)
 * Resmi Dokümantasyon: https://docs.iyzico.com/odeme-metotlari/api
 *
 * Desteklenen servisler:
 * 1. BIN & Taksit Sorgulama (/payment/iyzipos/installment & /payment/bin/check)
 * 2. 3D Secure Ödeme Başlatma (/payment/3dsecure/initialize)
 * 3. 3D Secure Ödeme Tamamlama (/payment/3dsecure/auth)
 * 4. Non-3DS Ödeme Oluşturma (/payment/auth)
 * 5. Ödeme Sorgulama (/payment/detail) ve İade (/payment/refund)
 */

import crypto from "node:crypto";

function getApiUrl(): string {
  if (process.env.IYZICO_API_URL) return process.env.IYZICO_API_URL;
  return process.env.IYZICO_MODE === "sandbox"
    ? "https://sandbox-api.iyzipay.com"
    : "https://api.iyzipay.com";
}

function getCredentials() {
  return {
    apiKey: (process.env.IYZICO_API_KEY ?? "").trim(),
    secretKey: (process.env.IYZICO_SECRET_KEY ?? "").trim(),
  };
}

export function isIyzicoConfigured(): boolean {
  const { apiKey, secretKey } = getCredentials();
  return Boolean(apiKey && secretKey);
}

/**
 * Resmi IYZWSv2 HMAC-SHA256 yetkilendirme başlığı üretir.
 * Formül:
 *   encryptedData = HMACSHA256(randomKey + uriPath + bodyJson, secretKey)
 *   base64Auth    = Base64("apiKey:" + apiKey + "&randomKey:" + randomKey + "&signature:" + encryptedData)
 *   Authorization = "IYZWSv2 " + base64Auth
 */
export function buildIyzicoHeaders(uriPath: string, bodyJson: string): Record<string, string> {
  const { apiKey, secretKey } = getCredentials();
  const randomKey = `${Date.now()}${Math.random().toString(36).slice(2, 11)}`;
  const payload = `${randomKey}${uriPath}${bodyJson}`;
  const encryptedData = crypto
    .createHmac("sha256", secretKey)
    .update(payload, "utf8")
    .digest("hex");
  const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${encryptedData}`;
  const base64Auth = Buffer.from(authString, "utf8").toString("base64");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `IYZWSv2 ${base64Auth}`,
    "x-iyzi-rnd": randomKey,
    "x-iyzi-client-version": "iyzipay-node-2.0.61",
  };
}

async function iyzicoPost<T = Record<string, unknown>>(
  uriPath: string,
  bodyObj: Record<string, unknown>
): Promise<T> {
  const bodyJson = JSON.stringify(bodyObj);
  const headers = buildIyzicoHeaders(uriPath, bodyJson);
  const response = await fetch(`${getApiUrl()}${uriPath}`, {
    method: "POST",
    headers,
    body: bodyJson,
    cache: "no-store",
  });
  return (await response.json()) as T;
}

export function formatIyzicoPhone(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("5")) return `+90${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+9${digits}`;
  if (digits.length === 12 && digits.startsWith("90")) return `+${digits}`;
  if (digits.length >= 10) return `+90${digits.slice(-10)}`;
  return "+905078846603";
}

function formatIyzicoDate(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function normalizeExpireMonth(month: string): string {
  const m = (month || "").replace(/\D/g, "");
  const num = Math.min(12, Math.max(1, Number(m) || 1));
  return String(num).padStart(2, "0");
}

export function normalizeExpireYear(year: string): string {
  const y = (year || "").replace(/\D/g, "");
  if (y.length === 2) return `20${y}`;
  if (y.length === 4) return y;
  return "2028";
}

export interface IyzicoInstallmentOption {
  installmentNumber: number;
  installmentPrice: number;
  totalPrice: number;
}

export interface IyzicoBinInstallmentResult {
  status: "success" | "failure";
  binNumber?: string;
  cardType?: string;
  cardAssociation?: string;
  cardFamilyName?: string;
  bankName?: string;
  bankCode?: number;
  force3ds?: number;
  commercial?: number;
  installmentPrices?: IyzicoInstallmentOption[];
  errorMessage?: string;
}

/**
 * 1. BIN ve Taksit Seçenekleri Sorgulama (/payment/iyzipos/installment)
 */
export async function checkIyzicoInstallments(
  binNumber: string,
  price: number
): Promise<IyzicoBinInstallmentResult> {
  if (!isIyzicoConfigured()) {
    return { status: "failure", errorMessage: "iyzico API anahtarları yapılandırılmamış." };
  }

  const cleanBin = (binNumber || "").replace(/\D/g, "").slice(0, 8);
  const safePrice = Math.max(1, Math.round(Number(price || 0) * 100) / 100);

  try {
    const data = await iyzicoPost<{
      status: string;
      errorMessage?: string;
      installmentDetails?: Array<{
        binNumber?: string;
        cardType?: string;
        cardAssociation?: string;
        cardFamilyName?: string;
        bankName?: string;
        bankCode?: number;
        force3ds?: number;
        commercial?: number;
        installmentPrices?: IyzicoInstallmentOption[];
      }>;
    }>("/payment/iyzipos/installment", {
      locale: "tr",
      conversationId: `inst-${Date.now()}`,
      binNumber: cleanBin.length >= 6 ? cleanBin.slice(0, 6) : undefined,
      price: safePrice.toFixed(2),
    });

    if (data.status === "success" && data.installmentDetails?.[0]) {
      const detail = data.installmentDetails[0];
      return {
        status: "success",
        binNumber: detail.binNumber,
        cardType: detail.cardType,
        cardAssociation: detail.cardAssociation,
        cardFamilyName: detail.cardFamilyName,
        bankName: detail.bankName,
        bankCode: detail.bankCode,
        force3ds: detail.force3ds,
        commercial: detail.commercial,
        installmentPrices: detail.installmentPrices ?? [
          { installmentNumber: 1, installmentPrice: safePrice, totalPrice: safePrice },
        ],
      };
    }

    return {
      status: "failure",
      errorMessage: data.errorMessage ?? "Taksit bilgisi alınamadı.",
    };
  } catch (err) {
    console.error("iyzico taksit sorgu hatası:", err);
    return { status: "failure", errorMessage: "Taksit sorgulama sırasında hata oluştu." };
  }
}

export interface IyzicoBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  identityNumber: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  ip?: string;
}

export interface IyzicoBasketItem {
  id: string;
  name: string;
  category1: string;
  category2?: string;
  itemType: "PHYSICAL" | "VIRTUAL";
  price: number;
}

export interface IyzicoPaymentRequest {
  price: number;
  paidPrice: number;
  currency: "TRY";
  installment: number;
  paymentChannel: "WEB";
  paymentGroup: "PRODUCT" | "LISTING" | "SUBSCRIPTION";
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
    registerCard?: 0 | 1;
  };
  buyer: IyzicoBuyer;
  shippingAddress: IyzicoBuyer;
  billingAddress: IyzicoBuyer;
  basketItems: IyzicoBasketItem[];
  conversationId: string;
  callbackUrl?: string;
}

export interface IyzicoPaymentResult {
  status: "success" | "failure";
  paymentId?: string;
  conversationId?: string;
  threeDSHtmlContent?: string;
  authCode?: string;
  hostReference?: string;
  paidPrice?: number;
  errorMessage?: string;
  errorCode?: string;
}

function buildPaymentPayload(request: IyzicoPaymentRequest) {
  const formattedItems = request.basketItems.map((item) => {
    const itemPrice = Math.max(0.01, Math.round(Number(item.price || 0) * 100) / 100);
    return {
      id: String(item.id),
      name: item.name,
      category1: item.category1 || "Yapay Bitki",
      category2: item.category2 || "Dekorasyon",
      itemType: item.itemType || "PHYSICAL",
      price: itemPrice.toFixed(2),
      _numPrice: itemPrice,
    };
  });

  // iyzico kuralı: price alanı, basketItems[].price toplamına birebir eşit olmalıdır
  const basketSum =
    Math.round(formattedItems.reduce((sum, i) => sum + i._numPrice, 0) * 100) / 100;
  const paidPriceNum = Math.max(0.01, Math.round(Number(request.paidPrice || basketSum) * 100) / 100);
  const nowStr = formatIyzicoDate();
  const tcNo =
    request.buyer.identityNumber && /^\d{11}$/.test(request.buyer.identityNumber)
      ? request.buyer.identityNumber
      : "11111111111";

  return {
    locale: "tr",
    conversationId: request.conversationId,
    price: basketSum.toFixed(2),
    paidPrice: paidPriceNum.toFixed(2),
    currency: request.currency || "TRY",
    installment: Number(request.installment || 1),
    basketId: request.conversationId,
    paymentChannel: request.paymentChannel || "WEB",
    paymentGroup: request.paymentGroup || "PRODUCT",
    paymentCard: {
      cardHolderName: request.paymentCard.cardHolderName.trim(),
      cardNumber: request.paymentCard.cardNumber.replace(/\D/g, ""),
      expireMonth: normalizeExpireMonth(request.paymentCard.expireMonth),
      expireYear: normalizeExpireYear(request.paymentCard.expireYear),
      cvc: request.paymentCard.cvc.replace(/\D/g, ""),
      registerCard: 0,
    },
    buyer: {
      id: request.buyer.id,
      name: request.buyer.name || "Müşteri",
      surname: request.buyer.surname || "Müşteri",
      gsmNumber: formatIyzicoPhone(request.buyer.phone),
      email: request.buyer.email,
      identityNumber: tcNo,
      lastLoginDate: nowStr,
      registrationDate: nowStr,
      registrationAddress: request.buyer.address,
      ip: request.buyer.ip || "85.34.78.112",
      city: request.buyer.city || "Istanbul",
      country: request.buyer.country || "Turkey",
      zipCode: request.buyer.zipCode || "34000",
    },
    shippingAddress: {
      contactName: `${request.shippingAddress.name} ${request.shippingAddress.surname}`.trim(),
      city: request.shippingAddress.city || "Istanbul",
      country: request.shippingAddress.country || "Turkey",
      address: request.shippingAddress.address,
      zipCode: request.shippingAddress.zipCode || "34000",
    },
    billingAddress: {
      contactName: `${request.billingAddress.name} ${request.billingAddress.surname}`.trim(),
      city: request.billingAddress.city || "Istanbul",
      country: request.billingAddress.country || "Turkey",
      address: request.billingAddress.address,
      zipCode: request.billingAddress.zipCode || "34000",
    },
    basketItems: formattedItems.map(({ _numPrice: _, ...rest }) => rest),
  };
}

/**
 * 2. 3D Secure Ödeme Başlatma (/payment/3dsecure/initialize)
 */
export async function initializeIyzico3DSPayment(
  request: IyzicoPaymentRequest
): Promise<IyzicoPaymentResult> {
  if (!isIyzicoConfigured()) {
    return {
      status: "failure",
      errorMessage: "iyzico API anahtarları eksik.",
    };
  }

  try {
    const payload = {
      ...buildPaymentPayload(request),
      callbackUrl:
        request.callbackUrl ||
        `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com"}/api/iyzico/callback`,
    };

    const data = await iyzicoPost<{
      status: string;
      paymentId?: string;
      conversationId?: string;
      threeDSHtmlContent?: string;
      errorMessage?: string;
      errorCode?: string;
    }>("/payment/3dsecure/initialize", payload);

    if (data.status === "success" && data.threeDSHtmlContent) {
      // base64 decode
      const decodedHtml = Buffer.from(data.threeDSHtmlContent, "base64").toString("utf8");
      return {
        status: "success",
        paymentId: data.paymentId,
        conversationId: data.conversationId,
        threeDSHtmlContent: decodedHtml,
      };
    }

    return {
      status: "failure",
      errorMessage: data.errorMessage ?? "3D Secure ödeme başlatılamadı.",
      errorCode: data.errorCode,
    };
  } catch (err) {
    console.error("iyzico 3DS başlatma hatası:", err);
    return {
      status: "failure",
      errorMessage: "3D Secure ödeme başlatılırken bağlantı hatası oluştu.",
    };
  }
}

/**
 * 3. 3D Secure Ödeme Tamamlama (/payment/3dsecure/auth)
 * Banka SMS doğrulaması sonrası callback içinde çağrılır.
 */
export async function completeIyzico3DSPayment(params: {
  paymentId: string;
  conversationId: string;
  conversationData?: string;
}): Promise<IyzicoPaymentResult> {
  if (!isIyzicoConfigured()) {
    return { status: "failure", errorMessage: "iyzico API anahtarları eksik." };
  }

  try {
    const payload: Record<string, unknown> = {
      locale: "tr",
      conversationId: params.conversationId,
      paymentId: params.paymentId,
    };
    if (params.conversationData) {
      payload.conversationData = params.conversationData;
    }

    const data = await iyzicoPost<{
      status: string;
      paymentId?: string;
      conversationId?: string;
      authCode?: string;
      hostReference?: string;
      paidPrice?: number;
      errorMessage?: string;
      errorCode?: string;
    }>("/payment/3dsecure/auth", payload);

    if (data.status === "success" && data.paymentId) {
      return {
        status: "success",
        paymentId: data.paymentId,
        conversationId: data.conversationId,
        authCode: data.authCode,
        hostReference: data.hostReference,
        paidPrice: data.paidPrice,
      };
    }

    return {
      status: "failure",
      errorMessage: data.errorMessage ?? "3D Secure ödeme onayı alınamadı.",
      errorCode: data.errorCode,
    };
  } catch (err) {
    console.error("iyzico 3DS auth hatası:", err);
    return { status: "failure", errorMessage: "3D Secure ödeme tamamlanırken hata oluştu." };
  }
}

/**
 * 4. Non-3DS Ödeme Oluşturma (/payment/auth)
 */
export async function createIyzicoPayment(
  request: IyzicoPaymentRequest
): Promise<IyzicoPaymentResult> {
  if (!isIyzicoConfigured()) {
    return {
      status: "failure",
      errorMessage: "iyzico API anahtarları eksik.",
    };
  }

  try {
    const payload = buildPaymentPayload(request);
    const data = await iyzicoPost<{
      status: string;
      paymentId?: string;
      conversationId?: string;
      authCode?: string;
      hostReference?: string;
      paidPrice?: number;
      errorMessage?: string;
      errorCode?: string;
    }>("/payment/auth", payload);

    if (data.status === "success" && data.paymentId) {
      return {
        status: "success",
        paymentId: data.paymentId,
        conversationId: data.conversationId,
        authCode: data.authCode,
        hostReference: data.hostReference,
        paidPrice: data.paidPrice,
      };
    }

    return {
      status: "failure",
      errorMessage: data.errorMessage ?? "Ödeme reddedildi.",
      errorCode: data.errorCode,
    };
  } catch (err) {
    console.error("iyzico Non-3DS ödeme hatası:", err);
    return {
      status: "failure",
      errorMessage: "Ödeme işlemi sırasında bir hata oluştu.",
    };
  }
}

/**
 * 5. Ödeme Sorgulama (/payment/detail)
 */
export async function getIyzicoPaymentStatus(
  paymentId: string,
  conversationId?: string
): Promise<IyzicoPaymentResult> {
  if (!isIyzicoConfigured()) {
    return { status: "failure", errorMessage: "iyzico API anahtarları eksik." };
  }

  try {
    const data = await iyzicoPost<{
      status: string;
      paymentId?: string;
      conversationId?: string;
      errorMessage?: string;
    }>("/payment/detail", {
      locale: "tr",
      conversationId: conversationId ?? paymentId,
      paymentId,
    });

    return data.status === "success"
      ? { status: "success", paymentId: data.paymentId, conversationId: data.conversationId }
      : { status: "failure", errorMessage: data.errorMessage };
  } catch (err) {
    console.error("iyzico durum sorgu hatası:", err);
    return { status: "failure", errorMessage: "Durum sorgulama hatası." };
  }
}

/**
 * 6. Ödeme İade (/payment/refund)
 */
export async function refundIyzicoPayment(
  paymentTransactionId: string,
  amount: number,
  conversationId: string
): Promise<IyzicoPaymentResult> {
  if (!isIyzicoConfigured()) {
    return { status: "failure", errorMessage: "iyzico API anahtarları eksik." };
  }

  try {
    const safePrice = Math.max(0.01, Math.round(Number(amount || 0) * 100) / 100);
    const data = await iyzicoPost<{
      status: string;
      paymentId?: string;
      conversationId?: string;
      errorMessage?: string;
    }>("/payment/refund", {
      locale: "tr",
      conversationId,
      paymentTransactionId,
      price: safePrice.toFixed(2),
      currency: "TRY",
      ip: "85.34.78.112",
    });

    return data.status === "success"
      ? { status: "success", paymentId: data.paymentId, conversationId: data.conversationId }
      : { status: "failure", errorMessage: data.errorMessage ?? "İade başarısız." };
  } catch (err) {
    console.error("iyzico iade hatası:", err);
    return { status: "failure", errorMessage: "İade işlemi sırasında hata oluştu." };
  }
}
