/**
 * Iyzico ödeme entegrasyonu (sandbox/production)
 * https://docs.iyzico.com/
 *
 * Bu modül Iyzico REST API'sine istek gönderir.
 * Kart bilgileri hiçbir zaman sunucumuzda saklanmaz.
 */

const IYZICO_API_URL =
  process.env.IYZICO_API_URL ??
  (process.env.IYZICO_MODE === "production"
    ? "https://api.iyzipay.com"
    : "https://sandbox-api.iyzipay.com");

const API_KEY = process.env.IYZICO_API_KEY ?? "";
const SECRET_KEY = process.env.IYZICO_SECRET_KEY ?? "";

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
  authCode?: string;
  hostReference?: string;
  errorMessage?: string;
  errorCode?: string;
}

/**
 * Iyzico ödeme iste. Kart bilgileri doğrudan Iyzico'ya iletilir.
 */
export async function createIyzicoPayment(
  request: IyzicoPaymentRequest
): Promise<IyzicoPaymentResult> {
  if (!API_KEY || !SECRET_KEY) {
    return {
      status: "failure",
      errorMessage: "Iyzico API anahtarları eksik. .env dosyasını kontrol edin.",
    };
  }

  const randomString = Math.random().toString(36).substring(2, 12);
  const time = Date.now();
  const conversationId = `${request.conversationId}-${randomString}`;

  try {
    const body = {
      locale: "tr",
      conversationId,
      price: Math.round(request.price * 100) / 100,
      paidPrice: Math.round(request.paidPrice * 100) / 100,
      currency: request.currency,
      installment: request.installment,
      paymentChannel: request.paymentChannel,
      paymentGroup: request.paymentGroup,
      paymentCard: request.paymentCard,
      buyer: {
        id: request.buyer.id,
        name: request.buyer.name,
        surname: request.buyer.surname,
        email: request.buyer.email,
        gsmNumber: request.buyer.phone,
        identityNumber: request.buyer.identityNumber || "11111111111",
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        registrationAddress: request.buyer.address,
        ip: "1.1.1.1",
        city: request.buyer.city,
        country: request.buyer.country,
        zipCode: request.buyer.zipCode,
      },
      shippingAddress: {
        contactName: `${request.shippingAddress.name} ${request.shippingAddress.surname}`,
        city: request.shippingAddress.city,
        country: request.shippingAddress.country,
        address: request.shippingAddress.address,
        zipCode: request.shippingAddress.zipCode,
      },
      billingAddress: {
        contactName: `${request.billingAddress.name} ${request.billingAddress.surname}`,
        city: request.billingAddress.city,
        country: request.billingAddress.country,
        address: request.billingAddress.address,
        zipCode: request.billingAddress.zipCode,
      },
      basketItems: request.basketItems.map((item) => ({
        id: item.id,
        name: item.name,
        category1: item.category1,
        category2: item.category2,
        itemType: item.itemType,
        price: Math.round(item.price * 100) / 100,
      })),
    };

    // Iyzico imzası: HMAC-SHA1
    const signature = await generateSignature(randomString, time);

    const response = await fetch(`${IYZICO_API_URL}/payment/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `IYZWS ${API_KEY}`,
        "X-Random-String": randomString,
        "X-Timestamp": String(time),
        "X-Signature": signature,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return {
        status: "failure",
        errorMessage: `Iyzico HTTP hatası: ${response.status}`,
      };
    }

    const data = await response.json();

    if (data.status === "success") {
      return {
        status: "success",
        paymentId: data.paymentId,
        conversationId: data.conversationId,
        authCode: data.authCode,
        hostReference: data.hostReference,
      };
    }

    return {
      status: "failure",
      errorMessage: data.errorMessage ?? "Ödeme reddedildi",
      errorCode: data.errorCode,
    };
  } catch (err) {
    console.error("Iyzico ödeme hatası:", err);
    return {
      status: "failure",
      errorMessage: "Ödeme işlemi sırasında bir hata oluştu.",
    };
  }
}

/**
 * HMAC-SHA1 imza oluştur
 */
async function generateSignature(randomString: string, time: number): Promise<string> {
  const data = `${randomString}${time}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Iyzico ödeme iade
 */
export async function refundIyzicoPayment(
  paymentId: string,
  amount: number,
  conversationId: string
): Promise<IyzicoPaymentResult> {
  if (!API_KEY || !SECRET_KEY) {
    return {
      status: "failure",
      errorMessage: "Iyzico API anahtarları eksik.",
    };
  }

  const randomString = Math.random().toString(36).substring(2, 12);
  const time = Date.now();

  try {
    const body = {
      locale: "tr",
      conversationId,
      paymentId,
      price: Math.round(amount * 100) / 100,
      currency: "TRY",
      ip: "1.1.1.1",
    };

    const signature = await generateSignature(randomString, time);

    const response = await fetch(`${IYZICO_API_URL}/payment/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `IYZWS ${API_KEY}`,
        "X-Random-String": randomString,
        "X-Timestamp": String(time),
        "X-Signature": signature,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return { status: "failure", errorMessage: `HTTP ${response.status}` };
    }

    const data = await response.json();

    return data.status === "success"
      ? { status: "success", paymentId, conversationId: data.conversationId }
      : { status: "failure", errorMessage: data.errorMessage ?? "İade başarısız" };
  } catch (err) {
    console.error("Iyzico iade hatası:", err);
    return { status: "failure", errorMessage: "İade işlemi sırasında hata" };
  }
}

/**
 * Iyzico ödeme durumunu kontrol et
 */
export async function getIyzicoPaymentStatus(
  paymentId: string
): Promise<IyzicoPaymentResult> {
  if (!API_KEY || !SECRET_KEY) {
    return { status: "failure", errorMessage: "Iyzico API anahtarları eksik." };
  }

  const randomString = Math.random().toString(36).substring(2, 12);
  const time = Date.now();

  try {
    const signature = await generateSignature(randomString, time);

    const response = await fetch(`${IYZICO_API_URL}/payment/detail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `IYZWS ${API_KEY}`,
        "X-Random-String": randomString,
        "X-Timestamp": String(time),
        "X-Signature": signature,
      },
      body: JSON.stringify({
        locale: "tr",
        conversationId: paymentId,
        paymentId,
        paymentConversationId: paymentId,
      }),
    });

    if (!response.ok) {
      return { status: "failure", errorMessage: `HTTP ${response.status}` };
    }

    const data = await response.json();

    return data.status === "success"
      ? { status: "success", paymentId, conversationId: data.conversationId }
      : { status: "failure", errorMessage: data.errorMessage };
  } catch (err) {
    console.error("Iyzico durum hatası:", err);
    return { status: "failure", errorMessage: "Durum sorgulama hatası" };
  }
}

export function isIyzicoConfigured(): boolean {
  return Boolean(API_KEY && SECRET_KEY);
}
