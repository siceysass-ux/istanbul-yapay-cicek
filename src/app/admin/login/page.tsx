"use client";

import { useState } from "react";
import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await loginAction(formData);
    },
    null
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
            <span className="font-serif text-2xl text-cream">D</span>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-cream">
            İstanbul Yapay Çiçek
          </h1>
          <p className="mt-1 text-sm text-cream/50">Admin Panel Girişi</p>
        </div>

        {/* Form */}
        <form
          action={formAction}
          className="space-y-5 rounded-3xl border border-cream/10 bg-cream/[0.03] p-8 backdrop-blur"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream/80">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
              <Input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@dikeyyapaybahce.com"
                className="border-cream/15 bg-cream/5 text-cream placeholder:text-cream/30 focus:border-primary-light focus:ring-primary-light/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream/80">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
              <Input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="border-cream/15 bg-cream/5 text-cream placeholder:text-cream/30 focus:border-primary-light focus:ring-primary-light/20"
              />
            </div>
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
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

        <p className="mt-6 text-center text-xs text-cream/40">
          Bu alan yalnızca yetkili personel içindir.
        </p>
      </div>
    </div>
  );
}
