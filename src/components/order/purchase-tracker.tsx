"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/stores/cart";
import { trackPurchase } from "@/lib/analytics";

interface PurchaseTrackerProps {
  orderNumber: string;
  total: number;
  shipping: number;
  email: string;
  phone: string;
  city: string;
  items: { name: string; price: number; quantity: number }[];
}

export function PurchaseTracker({
  orderNumber,
  total,
  shipping,
  email,
  phone,
  city,
  items,
}: PurchaseTrackerProps) {
  const clear = useCart((s) => s.clear);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    clear();
    trackPurchase({
      orderNumber,
      total,
      shipping,
      email,
      phone,
      city,
      items,
    });
  }, [orderNumber, total, shipping, email, phone, city, items, clear]);

  return null;
}
