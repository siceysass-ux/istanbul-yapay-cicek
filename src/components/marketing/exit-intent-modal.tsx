"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, ShoppingBag, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/stores/cart";

const STORAGE_KEY = "dyc-exit-intent-shown";
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 saat

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 dakika
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));

  useEffect(() => {
    if (count === 0) return; // Sepet boşsa gösterme

    // Daha önce gösterilmiş mi?
    const shown = localStorage.getItem(STORAGE_KEY);
    if (shown) {
      const shownTime = Number(shown);
      if (Date.now() - shownTime < SESSION_TIMEOUT) return;
    }

    let triggered = false;

    // Desktop: mouse leave (üst kenardan çıkış)
    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered) return;
      if (e.clientY <= 0) {
        triggered = true;
        setIsOpen(true);
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    };

    // Mobile: hızlı scroll-up (geri dönüş niyeti)
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (triggered) return;
      const currentY = window.scrollY;
      if (currentY < lastScrollY - 200 && currentY < 300) {
        triggered = true;
        setIsOpen(true);
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
      lastScrollY = currentY;
    };

    // 20 saniye sonra da tetikle (fallback)
    const fallbackTimer = setTimeout(() => {
      if (!triggered) {
        triggered = true;
        setIsOpen(true);
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    }, 20000);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(fallbackTimer);
    };
  }, [count]);

  // Geri sayım
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // ESC kapat
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[70] bg-ink/70 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-cream shadow-2xl pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="exit-intent-title"
            >
              {/* Kapat */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/80 hover:bg-cream transition-colors"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Üst banner */}
              <div className="relative bg-gradient-to-br from-primary to-primary-dark p-8 text-center text-cream overflow-hidden">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-light/30 blur-3xl" />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cream/15 backdrop-blur"
                >
                  <Gift className="h-8 w-8 text-accent" />
                </motion.div>

                <h2 id="exit-intent-title" className="relative font-serif text-xl font-bold text-balance">
                  Sepetinde {count} ürün var
                </h2>
                <p className="relative mt-1 text-cream/80 text-sm">
                  Şimdi tamamla, <span className="text-accent font-semibold">%5 indirim</span> kazan.
                </p>
              </div>

              {/* İçerik */}
              <div className="p-6 text-center">
                {/* Geri sayım */}
                <div className="mb-5 flex items-center justify-center gap-2 rounded-2xl bg-accent/10 py-3">
                  <Timer className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">
                    İndirim sona eriyor: {minutes}:{seconds.toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Kupon kodu */}
                <div className="mb-5">
                  <p className="text-xs text-muted mb-2">Kupon kodunu ödeme sayfasında kullan:</p>
                  <div className="flex items-center justify-center">
                    <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-2">
                      <span className="font-mono text-lg font-bold tracking-widest text-primary">SEPET5</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = "/odeme";
                  }}
                >
                  <ShoppingBag className="h-5 w-5" /> Sepetimi Tamamla
                </Button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-3 text-xs text-muted hover:text-ink transition-colors"
                >
                  Hayır, teşekkürler
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
