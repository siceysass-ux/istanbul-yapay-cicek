"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { updateConsentMode } from "@/lib/analytics";

const STORAGE_KEY = "dyc-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    updateConsentMode(true);
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    updateConsentMode(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 px-4 pb-4 lg:bottom-0">
      <div className="mx-auto max-w-3xl rounded-2xl border border-primary/15 bg-white/95 p-5 shadow-2xl backdrop-blur">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-ink/85">
              Alışveriş deneyiminizi iyileştirmek ve reklam performansını ölçümlemek için çerezler kullanıyoruz. Detaylı bilgi için{" "}
              <Link href="/sayfalar/cerez-politikasi" className="text-accent hover:underline font-medium">
                Çerez Politikası
              </Link>{" "}
              ve{" "}
              <Link href="/sayfalar/kvkk-aydinlatma" className="text-accent hover:underline font-medium">
                KVKK Aydınlatma Metni
              </Link>{" "}
              sayfalarımızı inceleyebilirsiniz.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={accept}
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-[#d9560b] transition-colors"
              >
                Kabul Et
              </button>
              <button
                onClick={reject}
                className="rounded-full border border-primary/20 px-5 py-2 text-sm font-medium text-ink hover:bg-primary/5 transition-colors"
              >
                Reddet
              </button>
            </div>
          </div>
          <button
            onClick={reject}
            className="text-muted hover:text-ink"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
