"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await loginAction(formData);
    },
    null
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1e2426] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo variant="dark" size="lg" />
          <p className="mt-3 text-sm text-white/60">Yönetim Paneli Girişi</p>
        </div>

        {/* Form */}
        <form
          action={formAction}
          className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-8 backdrop-blur"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/85">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
              <Input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@cicekyapay.com"
                className="pl-11 border-white/15 bg-white/8 text-white placeholder:text-white/35 focus:border-accent focus:ring-accent/25"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/85">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
              <Input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-11 border-white/15 bg-white/8 text-white placeholder:text-white/35 focus:border-accent focus:ring-accent/25"
              />
            </div>
          </div>

          {state?.error && (
            <p className="rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-2.5 text-sm text-red-300">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Giriş yapılıyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-white/45">
          Bu alan yalnızca yetkili yöneticiler içindir.
        </p>
      </div>
    </div>
  );
}
