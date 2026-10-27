"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, FolderTree,
  Image as ImageIcon, Tag, FileText, Settings, BarChart3,
  Truck, MessageSquare, Building2, LogOut, ChevronRight, ExternalLink,
  ClipboardList, Mail, MailOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/login/actions";
import { BrandLogo } from "@/components/shared/brand-logo";

const menu = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Ürünler", href: "/admin/urunler", icon: Package },
  { label: "Siparişler", href: "/admin/siparisler", icon: ShoppingCart },
  { label: "Müşteriler", href: "/admin/musteriler", icon: Users },
  { label: "Kategoriler", href: "/admin/kategoriler", icon: FolderTree },
  { label: "Projeler", href: "/admin/projeler", icon: Building2 },
  { label: "Medya", href: "/admin/medya", icon: ImageIcon },
  { label: "Kampanyalar", href: "/admin/kampanyalar", icon: Tag },
  { label: "Yorumlar", href: "/admin/yorumlar", icon: MessageSquare },
  { label: "Keşif Talepleri", href: "/admin/kesif-talepleri", icon: ClipboardList },
  { label: "Mesajlar", href: "/admin/mesajlar", icon: Mail },
  { label: "Bülten", href: "/admin/bulten", icon: MailOpen },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Kargo", href: "/admin/kargo", icon: Truck },
  { label: "Raporlar", href: "/admin/raporlar", icon: BarChart3 },
  { label: "Ayarlar", href: "/admin/ayarlar", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-64 flex-col border-r border-primary/10 bg-[#1e2426] text-white/85">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-cream/10 px-5">
        <BrandLogo variant="dark" size="sm" showTagline={false} />
        <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-cream/60">
          Admin
        </span>
      </div>

      {/* Menü */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-primary text-cream font-medium"
                  : "text-cream/60 hover:bg-cream/5 hover:text-cream"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Alt */}
      <div className="space-y-1 border-t border-cream/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/60 hover:bg-cream/5 hover:text-cream transition-all"
        >
          <ExternalLink className="h-4 w-4" /> Siteyi Aç
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/60 hover:bg-cream/5 hover:text-cream transition-all"
          >
            <LogOut className="h-4 w-4" /> Çıkış Yap
          </button>
        </form>
      </div>
    </aside>
  );
}
