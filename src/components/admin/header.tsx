"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/app/admin/login/actions";
import { adminMenu } from "@/components/admin/sidebar";
import { BrandLogo } from "@/components/shared/brand-logo";
import { cn } from "@/lib/utils";

export function AdminHeader({ email }: { email: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const initial = email.charAt(0).toUpperCase();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (q.toUpperCase().startsWith("DYC")) {
      router.push(`/admin/siparisler?q=${encodeURIComponent(q)}`);
    } else {
      router.push(`/admin/urunler?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-primary/10 bg-white/90 px-4 sm:px-6 backdrop-blur">
        {/* Mobil Menü Butonu */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden shrink-0"
          aria-label="Menüyü aç"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Canlı Arama (Ürün adı, SKU veya DYC sipariş no) */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün adı, SKU veya sipariş no (DYC...) ara ve Enter'a bas"
            className="pl-10 bg-white h-10 text-xs sm:text-sm"
          />
        </form>

        {/* Sağ */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Siteyi Gör</span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-white px-2.5 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
              {initial}
            </div>
            <div className="hidden md:block pr-1">
              <div className="text-xs font-semibold leading-tight">{email}</div>
              <div className="text-[10px] text-muted">Yönetici</div>
            </div>
          </div>

          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="icon" aria-label="Çıkış yap" title="Çıkış Yap">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </header>

      {/* Mobil Admin Yan Menü */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-ink/60 backdrop-blur-xs"
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-[#1e2426] text-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <BrandLogo variant="dark" size="sm" showTagline={false} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {adminMenu.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                      active
                        ? "bg-accent text-white font-semibold"
                        : "text-white/70 hover:bg-white/8 hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
