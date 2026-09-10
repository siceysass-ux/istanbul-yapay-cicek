"use client";

import { useEffect } from "react";
import { useCart } from "@/stores/cart";

/**
 * Cart store'u mount'tan sonra manuel rehydrate eder.
 * skipHydration: true ile hydration mismatch önlenir,
 * bu component ise localStorage'dan sepeti güvenli şekilde yükler.
 */
export function CartHydration() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  return null;
}
