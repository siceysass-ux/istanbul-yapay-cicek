"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Tag,
  Settings,
  BarChart3,
  Truck,
  MessageSquare,
  LogOut,
  ChevronRight,
  ExternalLink,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/login/actions";
import { BrandLogo } from "@/components/shared/brand-logo";

export const adminMenu = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Ürünler (Hızlı Düzenle)", href: "/admin/urunler", icon: Package },
  { label: "Kategoriler", href: "/admin/kategoriler", icon: FolderTree },
  { label: "Siparişler", href: "/admin/siparisler", icon: ShoppingCart },
  { label: "Kargo Takibi", href: "/admin/kargo", icon: Truck },
  { label: "Kampanyalar ve Kuponlar", href: "/admin/kampanyalar", icon: Tag },
  { label: "Ürün Yorumları", href: "/admin/yorumlar", icon: MessageSquare },
  { label: "İletişim Mesajları", href: "/admin/mesajlar", icon: Mail },
  { label: "Müşteriler", href: "/admin/musteriler", icon: Users },
  { label: "Satış Raporları", href: "/admin/raporlar", icon: BarChart3 },
  { label: "Ayarlar ve Şifre", href: "/admin/ayarlar", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-64 flex-col border-r border-primary/10 bg-[#1e2426] text-white/85">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <BrandLogo variant="dark" size="sm" showTagline={false} />
        <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
          Admin
        </span>
      </div>

      {/* Menü */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {adminMenu.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-accent text-white font-semibold shadow-xs"
                  : "text-white/65 hover:bg-white/6 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {active && <ChevronRight className="h-4 w-4 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Alt */}
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/6 hover:text-white transition-all"
        >
          <ExternalLink className="h-4 w-4" /> Mağazayı Görüntüle
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/6 hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Çıkış Yap
          </button>
        </form>
      </div>
    </aside>
  );
}
