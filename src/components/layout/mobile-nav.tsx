"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trees, Flower2, ShoppingBag, Phone } from "lucide-react";
import { useCart } from "@/stores/cart";
import { cn } from "@/lib/utils";

const items = [
  { icon: Home, label: "Anasayfa", href: "/" },
  { icon: Trees, label: "Ağaçlar", href: "/kategori/yapay-agac" },
  { icon: Flower2, label: "Çiçekler", href: "/kategori/yapay-cicek" },
  { icon: ShoppingBag, label: "Sepet", href: "/sepet", isCart: true },
  { icon: Phone, label: "İletişim", href: "/iletisim" },
];

export function MobileNav() {
  const pathname = usePathname();
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const toggleCart = useCart((s) => s.toggleCart);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-primary/10 bg-white/95 px-2 pb-safe backdrop-blur-lg lg:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        const isCart = "isCart" in item && item.isCart;

        if (isCart) {
          return (
            <button
              key={item.label}
              onClick={toggleCart}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[11px]"
              aria-label={item.label}
            >
              <item.icon className={cn("h-5 w-5", active ? "text-accent" : "text-ink/70")} />
              <span className={active ? "text-accent font-semibold" : "text-muted"}>
                {item.label}
              </span>
              {count > 0 && (
                <span className="absolute top-0 right-1/4 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
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
              "relative flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[11px] transition-colors",
              active ? "text-primary font-semibold" : "text-ink/65 hover:text-primary"
            )}
          >
            {active && (
              <span className="absolute -top-1.5 h-1 w-6 rounded-full bg-accent" />
            )}
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
