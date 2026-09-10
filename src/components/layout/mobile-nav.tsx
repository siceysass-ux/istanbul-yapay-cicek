"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Phone } from "lucide-react";
import { useCart } from "@/stores/cart";
import { cn } from "@/lib/utils";

const items = [
  { icon: Home, label: "Anasayfa", href: "/" },
  { icon: Search, label: "Ara", href: "/kategori/yapay-cicek" },
  { icon: ShoppingBag, label: "Sepet", href: "/sepet", isCart: true },
  { icon: Phone, label: "İletişim", href: "/iletisim" },
];

export function MobileNav() {
  const pathname = usePathname();
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const toggleCart = useCart((s) => s.toggleCart);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-primary/10 bg-cream/95 backdrop-blur-lg lg:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        const isCart = "isCart" in item && item.isCart;

        if (isCart) {
          return (
            <button
              key={item.label}
              onClick={toggleCart}
              className="relative flex flex-col items-center gap-1 text-xs"
              aria-label={item.label}
            >
              <item.icon className={cn("h-5 w-5", active ? "text-primary" : "text-ink/60")} />
              <span className={active ? "text-primary font-medium" : "text-muted"}>
                {item.label}
              </span>
              {count > 0 && (
                <span className="absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-ink">
                  {count}
                </span>
              )}
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 text-xs transition-colors",
              active ? "text-primary" : "text-ink/60 hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className={active ? "font-medium" : ""}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
