"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  ShoppingBag,
  X,
  ChevronRight,
  Phone,
  MessageCircle,
  Sparkles,
  Trees,
  Flower2,
   Sprout,
  Layers,
  Briefcase,
  Images,
} from "lucide-react";
import { useCart } from "@/stores/cart";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";

const categoryNavItems = [
  { label: "Yapay Ağaçlar", href: "/kategori/yapay-agac", icon: Trees, desc: "Zeytin, bambu, benjamin ve tropikal ağaçlar" },
  { label: "Yapay Çiçekler", href: "/kategori/yapay-cicek", icon: Flower2, desc: "Sakura, begonvil, salkım ve çiçekli ağaçlar" },
  { label: "Saksılı & Bonsai", href: "/kategori/saksi", icon: Sprout, desc: "Tasarım saksılı bitkiler ve bonsai koleksiyonu" },
  { label: "Dev Çiçekler", href: "/kategori/yapay-guller", icon: Sparkles, desc: "Dev ayaklı şakayık, lotus ve vitrin çiçekleri" },
];

const corporateNavItems = [
  { label: "Uygulamalar", href: "/uygulamalar", icon: Layers },
  { label: "Projeler", href: "/projeler", icon: Briefcase },
  { label: "Galeri", href: "/galeri", icon: Images },
  { label: "İletişim", href: "/iletisim", icon: Phone },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const toggleCart = useCart((s) => s.toggleCart);

  // Route değiştiğinde mobil menüyü kapat
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Mobil çekmece açıkken sayfa kaydırmasını kilitle
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
              <span>✦ 500+ tamamlanan proje</span>
              <span>🚚 2000₺ üzeri ücretsiz kargo</span>
              <span>📍 İstanbul içi kapıda ödeme</span>
              <span>⚡ 1-3 iş gününde teslim</span>
              <span>✦ 500+ tamamlanan proje</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ana header */}
      <header className="sticky top-0 z-40 glass border-b border-primary/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Çiçek Yapay Ana Sayfa"
            className="flex items-center shrink-0 pr-3 xl:pr-6 xl:border-r xl:border-primary/10 py-1 z-50"
          >
            <BrandLogo variant="light" size="md" />
          </Link>

          {/* Desktop nav — tek satır (whitespace-nowrap), asla alt alta kırılmaz */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 whitespace-nowrap">
            {categoryNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-all",
                    active
                      ? "bg-primary text-cream shadow-sm"
                      : "text-ink/85 hover:bg-primary/8 hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <span className="mx-1.5 h-5 w-px shrink-0 bg-primary/15" aria-hidden="true" />

            {corporateNavItems.slice(0, 3).map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[13.5px] font-medium transition-all",
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-ink/75 hover:bg-primary/8 hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sağ Aksiyonlar */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/kesif-talebi"
              className="hidden xl:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-cream"
            >
              Keşif Talebi
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative h-10 w-10 rounded-full hover:bg-primary/10"
              aria-label="Sepet"
              id="cart-button"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-ink">
                  {count}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 rounded-full border border-primary/15 bg-white/60"
              onClick={() => setMobileOpen(true)}
              aria-label="Menüyü Aç"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobil Tam Ekran / Yan Çekmece Menü (Slide-Over Drawer) */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300",
          mobileOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Karartma Arka Planı */}
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/60 backdrop-blur-xs transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Çekmece Paneli */}
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Çekmece Üst Başlık */}
          <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4">
            <BrandLogo variant="light" size="sm" showTagline={false} />
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-white/70 text-ink transition-colors hover:bg-primary hover:text-cream"
              aria-label="Menüyü Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Çekmece İçeriği */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            {/* Kategoriler */}
            <div>
              <p className="px-2 mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                Ürün Kategorileri
              </p>
              <div className="space-y-1.5">
                {categoryNavItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3.5 rounded-2xl p-3 transition-all",
                        active
                          ? "bg-primary text-cream shadow-sm"
                          : "bg-white/70 text-ink hover:bg-white border border-primary/8"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          active ? "bg-cream/15 text-accent-light" : "bg-primary/8 text-primary"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold leading-tight">{item.label}</div>
                        <div
                          className={cn(
                            "mt-0.5 truncate text-[11px]",
                            active ? "text-cream/75" : "text-muted"
                          )}
                        >
                          {item.desc}
                        </div>
                      </div>
                      <ChevronRight
                        className={cn("h-4 w-4 shrink-0", active ? "text-cream" : "text-muted")}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Kurumsal & Hizmetler */}
            <div>
              <p className="px-2 mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                Uygulama &amp; Kurumsal
              </p>
              <div className="grid grid-cols-2 gap-2">
                {corporateNavItems.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl border p-3 text-sm font-medium transition-all",
                        active
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-primary/10 bg-white/60 text-ink/85 hover:bg-white"
                      )}
                    >
                      <item.icon className="h-4 w-4 text-accent shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Keşif Talebi Kartı */}
            <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-cream">
              <p className="text-xs font-medium text-accent-light">Profesyonel Peyzaj &amp; Dikey Bahçe</p>
              <p className="mt-1 font-serif text-base font-semibold">Mekanınız İçin Ücretsiz Keşif</p>
              <p className="mt-1 text-xs text-cream/70">
                Ofis, otel, kafe ve konut projeleri için yerinde keşif ve teklif alın.
              </p>
              <Link
                href="/kesif-talebi"
                onClick={() => setMobileOpen(false)}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-ink transition-transform active:scale-98"
              >
                Ücretsiz Keşif Talebi Oluştur
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Çekmece Alt Hızlı İletişim */}
          <div className="border-t border-primary/10 bg-white/60 p-4">
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:+905078846603"
                className="flex items-center justify-center gap-2 rounded-xl border border-primary/15 bg-white py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-primary/5"
              >
                <Phone className="h-4 w-4 text-primary" />
                Hemen Ara
              </a>
              <a
                href="https://wa.me/905078846603"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-semibold text-white shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
