"use client";

import { Search, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/app/admin/login/actions";

export function AdminHeader({ email }: { email: string }) {
  const initial = email.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-primary/10 bg-cream/80 px-6 backdrop-blur">
      {/* Arama */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input placeholder="Ürün, sipariş, müşteri ara..." className="pl-11 bg-white/60" />
      </div>

      {/* Sağ */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Bildirimler" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
        </Button>
        <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-cream text-sm font-medium">
            {initial}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium">{email}</div>
            <div className="text-[10px] text-muted">Yönetici</div>
          </div>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="icon" aria-label="Çıkış yap">
            <LogOut className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </header>
  );
}
