"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User, X, ChevronDown } from "lucide-react";
import { useCart } from "@/stores/cart";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Yapay Güller", href: "/kategori/yapay-guller" },
  { label: "Yapay Çiçekler", href: "/kategori/yapay-cicek" },
  { label: "Yapay Ağaçlar", href: "/kategori/yapay-agac" },
  { label: "Sarmaşıklar", href: "/kategori/sarmasik" },
  { label: "Dikey Bahçe", href: "/kategori/dikey-bahce" },
  { label: "Duvar Panelleri", href: "/kategori/yapay-duvar-panelleri" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const toggleCart = useCart((s) => s.toggleCart);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary text-cream overflow-hidden">
        <div className="flex whitespace-nowrap marquee py-2 text-xs font-medium tracking-wide">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              <span>🚚 2000₺ üzeri ücretsiz kargo</span>
              <span>📍 İstanbul içi kapıda ödeme</span>
              <span>⚡ 1-3 iş gününde teslim</span>
              <span>� 500+ tamamlanan proje</span>
              <span>🚚 2000₺ üzeri ücretsiz kargo</span>
              <span>📍 İstanbul içi kapıda ödeme</span>
              <span>⚡ 1-3 iş gününde teslim</span>
              <span>� 500+ tamamlanan proje</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ana header */}
      <header className="sticky top-0 z-40 glass border-b border-primary/10 overflow-visible">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-6 px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 pr-4 lg:pr-8 lg:border-r lg:border-primary/10 py-1 z-50">
            <Image src="/logo.webp" alt="İstanbul Yapay Çiçek" width={420} height={180} className="h-30 w-auto" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex flex-1 items-center gap-1">
            {navItems.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-ink/80 hover:text-primary transition-colors rounded-full hover:bg-primary/5"
              >
                {item.label}
              </Link>
            ))}
            {/* Ayırıcı çizgi */}
            <span className="mx-2 h-6 w-px bg-primary/15" aria-hidden="true" />
            <Link
              href="/uygulamalar"
              className="px-3 py-2 text-sm font-medium text-ink/80 hover:text-primary transition-colors rounded-full hover:bg-primary/5"
            >
              Uygulamalar
            </Link>
            <Link
              href="/projeler"
              className="px-3 py-2 text-sm font-medium text-ink/80 hover:text-primary transition-colors rounded-full hover:bg-primary/5"
            >
              Projeler
            </Link>
            <Link
              href="/galeri"
              className="px-3 py-2 text-sm font-medium text-ink/80 hover:text-primary transition-colors rounded-full hover:bg-primary/5"
            >
              Galeri
            </Link>
          </nav>

          {/* Aksiyonlar */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Ara">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Hesabım">
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative"
              aria-label="Sepet"
              id="cart-button"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-ink">
                  {count}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobil menü */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 border-t border-primary/10",
            mobileOpen ? "max-h-[500px]" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-primary/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {/* Ayırıcı çizgi */}
            <div className="my-2 h-px bg-primary/10" />
            <Link
              href="/uygulamalar"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-primary/5 transition-colors"
            >
              Uygulamalar
            </Link>
            <Link
              href="/projeler"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-primary/5 transition-colors"
            >
              Projeler
            </Link>
            <Link
              href="/galeri"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-primary/5 transition-colors"
            >
              Galeri
            </Link>
            <Link
              href="/kesif-talebi"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-primary/5 transition-colors"
            >
              Keşif Talebi
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
