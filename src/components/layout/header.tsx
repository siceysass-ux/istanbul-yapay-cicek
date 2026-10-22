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
  ArrowUpRight,
  Building2,
} from "lucide-react";
import { useCart } from "@/stores/cart";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";

const categoryNavItems = [
  { label: "Yapay Ağaçlar", href: "/kategori/yapay-agac", icon: Trees, desc: "Zeytin, bambu, benjamin ve tropikal ağaçlar" },
  { label: "Yapay Çiçekler", href: "/kategori/yapay-cicek", icon: Flower2, desc: "Sakura, begonvil, salkım ve çiçekli ağaçlar" },
  { label: "Saksılı Bitkiler", href: "/kategori/saksi", icon: Sprout, desc: "Tasarım saksılı bitkiler ve bonsai koleksiyonu" },
  { label: "Dev Çiçekler", href: "/kategori/dev-cicekler", icon: Sparkles, desc: "Dev ayaklı şakayık, lotus ve vitrin çiçekleri" },
];

const B2B_SITE_URL = "https://dikeyyapaybahce.com/";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const toggleCart = useCart((s) => s.toggleCart);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
      {/* Announcement bar — P2-8: Türkiye geneli teslimat bilgisi */}
      <div className="bg-[#1e2426] text-white border-b border-accent/30 overflow-hidden">
        <div className="flex whitespace-nowrap marquee py-2 text-xs font-medium tracking-wide">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              <span>🚚 Türkiye Geneli Kargo · 2000₺ Üzeri Ücretsiz</span>
              <span>⚡ İstanbul 1-3, Diğer İller 2-5 İş Gününde Teslim</span>
              <span>📍 İstanbul İçi Kapıda Ödeme</span>
              <span className="text-accent-light">✦ Doğal Gövdeli ve Gerçek Dokulu Koleksiyon</span>
              <span>🚚 Türkiye Geneli Kargo · 2000₺ Üzeri Ücretsiz</span>
              <span>⚡ İstanbul 1-3, Diğer İller 2-5 İş Gününde Teslim</span>
              <span>📍 İstanbul İçi Kapıda Ödeme</span>
              <span className="text-accent-light">✦ Doğal Gövdeli ve Gerçek Dokulu Koleksiyon</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ana header */}
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Çiçek Yapay Ana Sayfa"
            className="flex items-center shrink-0 pr-3 xl:pr-6 xl:border-r xl:border-primary/10 py-1 z-50"
          >
            <BrandLogo variant="light" size="md" />
          </Link>

          {/* Desktop nav — tek satır */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap">
            {categoryNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-accent text-white shadow-sm"
                      : "text-ink/85 hover:bg-accent/10 hover:text-accent"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <span className="mx-1.5 h-5 w-px shrink-0 bg-primary/15" aria-hidden="true" />

            <Link
              href="/iletisim"
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all",
                pathname === "/iletisim"
                  ? "bg-accent text-white font-semibold"
                  : "text-ink/75 hover:bg-accent/10 hover:text-accent"
              )}
            >
              İletişim
            </Link>
          </nav>

          {/* Sağ Aksiyonlar: Kurumsal & Yüksek Metraj Dikey Bahçe Yönlendirmesi + Sepet */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={B2B_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden md:inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-accent/40 bg-[#1e2426] px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-accent hover:border-accent hover:shadow-md"
              title="İşletme ve yüksek metraj dikey bahçe projeleri için kurumsal sitemiz"
            >
              <Building2 className="h-3.5 w-3.5 text-accent group-hover:text-white shrink-0" />
              <span>Dikey Bahçe Projeleri</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-accent group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </a>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative h-10 w-10 rounded-full hover:bg-accent/10"
              aria-label="Sepet"
              id="cart-button"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
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

      {/* Mobil Yan Çekmece Menü — P2-10: overflow-hidden ile mobilde yatay taşma önlenir */}
      <div
        className={cn(
          "fixed inset-0 z-50 overflow-hidden lg:hidden transition-all duration-300",
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
                          ? "bg-accent text-white shadow-sm"
                          : "bg-cream-dark text-ink hover:bg-accent/5 border border-primary/8"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          active ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold leading-tight">{item.label}</div>
                        <div
                          className={cn(
                            "mt-0.5 truncate text-[11px]",
                            active ? "text-white/85" : "text-muted"
                          )}
                        >
                          {item.desc}
                        </div>
                      </div>
                      <ChevronRight
                        className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-muted")}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* İşletme & Yüksek Metraj Dikey Bahçe Yönlendirme Kartı */}
            <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-[#1b2123] to-[#14181a] p-4 text-white shadow-lg">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <Building2 className="h-4 w-4" />
                <span>İşletme ve Kurumsal Projeler</span>
              </div>
              <p className="mt-1.5 font-serif text-base font-semibold leading-snug">
                Dikey Yapay Bahçe ve Yosun Duvar Uygulamaları
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/75">
                Otel, ofis, restoran, AVM ve kurumsal mekanlarda yüksek metrajlı dikey bahçe projeleri için kurumsal sitemizi ziyaret edin.
              </p>
              <a
                href={B2B_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white transition-transform active:scale-98"
              >
                dikeyyapaybahce.com&apos;a Git
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            {/* Hızlı Bağlantılar */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/hakkimizda"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-xl border border-primary/10 bg-white/60 p-3 text-xs font-semibold text-ink/85 hover:bg-white"
              >
                Hakkımızda
              </Link>
              <Link
                href="/iletisim"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-xl border border-primary/10 bg-white/60 p-3 text-xs font-semibold text-ink/85 hover:bg-white"
              >
                İletişim
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
