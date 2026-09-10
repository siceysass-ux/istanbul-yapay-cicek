"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Sepete uçan animasyon — ürün görselini sepet ikonuna doğru uçurur
 * Kullanım: flyToCart(imageUrl, sourceX, sourceY)
 */

interface FlyingItem {
  id: number;
  image: string;
  startX: number;
  startY: number;
}

let flyingItems: FlyingItem[] = [];
let listeners: ((items: FlyingItem[]) => void)[] = [];
let nextId = 0;

export function flyToCart(image: string, startX: number, startY: number) {
  const item: FlyingItem = { id: nextId++, image, startX, startY };
  flyingItems = [...flyingItems, item];
  listeners.forEach((l) => l(flyingItems));

  // 800ms sonra kaldır
  setTimeout(() => {
    flyingItems = flyingItems.filter((i) => i.id !== item.id);
    listeners.forEach((l) => l(flyingItems));
  }, 800);
}

export function subscribeFlyingItems(listener: (items: FlyingItem[]) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function FlyingCart() {
  const [items, setItems] = useState<FlyingItem[]>([]);

  useEffect(() => {
    return subscribeFlyingItems(setItems);
  }, []);

  const [cartPos, setCartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCartPos = () => {
      const cartBtn = document.getElementById("cart-button");
      if (cartBtn) {
        const rect = cartBtn.getBoundingClientRect();
        setCartPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    };
    updateCartPos();
    window.addEventListener("resize", updateCartPos);
    window.addEventListener("scroll", updateCartPos, true);
    return () => {
      window.removeEventListener("resize", updateCartPos);
      window.removeEventListener("scroll", updateCartPos, true);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      {items.map((item) => (
        <motion.img
          key={item.id}
          src={item.image}
          alt=""
          initial={{
            x: item.startX - 40,
            y: item.startY - 40,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: cartPos.x - 30,
            y: cartPos.y - 30,
            scale: 0.2,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="fixed h-20 w-20 rounded-xl object-cover shadow-2xl"
        />
      ))}
    </div>
  );
}
