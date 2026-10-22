"use client";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
  }
}

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-4312107150";
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

export function pushDataLayer(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function updateConsentMode(granted: boolean) {
  if (typeof window === "undefined") return;
  const status = granted ? "granted" : "denied";
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
      analytics_storage: status,
    });
  }
  if (typeof window.fbq === "function") {
    window.fbq("consent", granted ? "grant" : "revoke");
  }
  pushDataLayer("consent_update", { consent_status: status });
}

export function trackViewItem(item: {
  id: string;
  name: string;
  price: number;
  category?: string;
  sku?: string;
}) {
  if (typeof window === "undefined") return;
  const payload = {
    currency: "TRY",
    value: item.price,
    items: [
      {
        item_id: item.sku || item.id,
        item_name: item.name,
        item_category: item.category || "Yapay Bitki",
        price: item.price,
        quantity: 1,
      },
    ],
  };
  if (typeof window.gtag === "function") {
    window.gtag("event", "view_item", payload);
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "ViewContent", {
      content_ids: [item.sku || item.id],
      content_name: item.name,
      content_type: "product",
      value: item.price,
      currency: "TRY",
    });
  }
  pushDataLayer("view_item", { ecommerce: payload });
}

export function trackAddToCart(item: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}) {
  if (typeof window === "undefined") return;
  const qty = item.quantity ?? 1;
  const value = item.price * qty;
  const payload = {
    currency: "TRY",
    value,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: qty,
      },
    ],
  };
  if (typeof window.gtag === "function") {
    window.gtag("event", "add_to_cart", payload);
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "AddToCart", {
      content_ids: [item.id],
      content_name: item.name,
      content_type: "product",
      value,
      currency: "TRY",
    });
  }
  pushDataLayer("add_to_cart", { ecommerce: payload });
}

export function trackBeginCheckout(
  items: { id: string; name: string; price: number; quantity: number }[],
  totalValue: number
) {
  if (typeof window === "undefined") return;
  const payload = {
    currency: "TRY",
    value: totalValue,
    items: items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  };
  if (typeof window.gtag === "function") {
    window.gtag("event", "begin_checkout", payload);
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      content_ids: items.map((i) => i.id),
      num_items: items.reduce((s, i) => s + i.quantity, 0),
      value: totalValue,
      currency: "TRY",
    });
  }
  pushDataLayer("begin_checkout", { ecommerce: payload });
}

export function trackPurchase(order: {
  orderNumber: string;
  total: number;
  shipping: number;
  email?: string;
  phone?: string;
  city?: string;
  items: { name: string; price: number; quantity: number }[];
}) {
  if (typeof window === "undefined") return;
  const payload = {
    transaction_id: order.orderNumber,
    currency: "TRY",
    value: order.total,
    shipping: order.shipping,
    items: order.items.map((i, idx) => ({
      item_id: `${order.orderNumber}-${idx + 1}`,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  };
  if (typeof window.gtag === "function") {
    if (order.email || order.phone) {
      window.gtag("set", "user_data", {
        email: order.email,
        phone_number: order.phone,
        address: order.city ? { city: order.city, country: "TR" } : undefined,
      });
    }
    window.gtag("event", "purchase", payload);
    window.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_ID,
      value: order.total,
      currency: "TRY",
      transaction_id: order.orderNumber,
    });
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "Purchase", {
      value: order.total,
      currency: "TRY",
      order_id: order.orderNumber,
      content_type: "product",
    });
  }
  pushDataLayer("purchase", {
    ecommerce: payload,
    user_data: { email: order.email, phone_number: order.phone, city: order.city },
  });
}

export function trackWhatsAppClick(context = "genel") {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "whatsapp_click", { event_category: "engagement", event_label: context });
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "Contact", { content_name: `WhatsApp: ${context}` });
  }
  pushDataLayer("whatsapp_click", { context });
}

export function trackPhoneClick(context = "genel") {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "phone_click", { event_category: "engagement", event_label: context });
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "Contact", { content_name: `Telefon: ${context}` });
  }
  pushDataLayer("phone_click", { context });
}

export function trackLeadForm(formName = "iletisim") {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", { form_name: formName });
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: formName });
  }
  pushDataLayer("generate_lead", { form_name: formName });
}
