"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, ShoppingBag, Timer, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/utils";

const STORAGE_KEY = "dyc-exit-intent-shown";
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 saat

interface ExitCouponData {
  enabled: boolean;
  code?: string;
  type?: "PERCENT" | "FIXED" | string;
  value?: number;
  minOrder?: number;
}

export function ExitIntentModal() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60);
  const [couponData, setCouponData] = useState<ExitCouponData | null>(null);
  const [copied, setCopied] = useState(false);

  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const setCoupon = useCart((s) => s.setCoupon);

  const count = items.reduce((a, i) => a + Number(i.quantity || 0), 0);
  const subtotal = items.reduce((a, i) => a + Number(i.price || 0) * Number(i.quantity || 0), 0);

  const isExcludedRoute =
    pathname?.startsWith("/odeme") ||
    pathname?.startsWith("/siparis") ||
    pathname?.startsWith("/admin");

  // Sepette ürün olduğunda aktif exit-intent kuponunu veritabanından çek
  useEffect(() => {
    if (count === 0 || isExcludedRoute) return;
    fetch("/api/exit-coupon")
      .then((r) => r.json())
      .then((data: ExitCouponData) => {
        setCouponData(data);
      })
      .catch(() => {});
  }, [count, isExcludedRoute]);

  useEffect(() => {
    if (count === 0 || isExcludedRoute) return;
    if (!couponData?.enabled || !couponData.code) return;
    // Zaten bu kupon uygulanmışsa tekrar gösterme
    if (couponCode === couponData.code) return;
    if (couponData.minOrder && subtotal < couponData.minOrder) return;

    const shown = localStorage.getItem(STORAGE_KEY);
    if (shown) {
      const shownTime = Number(shown);
      if (Date.now() - shownTime < SESSION_TIMEOUT) return;
    }

    let triggered = false;

    const triggerPopup = () => {
      if (triggered) return;
      triggered = true;
      setIsOpen(true);
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        triggerPopup();
      }
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < lastScrollY - 220 && currentY < 300) {
        triggerPopup();
      }
      lastScrollY = currentY;
    };

    const fallbackTimer = setTimeout(() => {
      triggerPopup();
    }, 25000);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(fallbackTimer);
    };
  }, [count, subtotal, isExcludedRoute, couponData, couponCode]);

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

  if (!couponData?.enabled || !couponData.code || isExcludedRoute) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const discountAmount =
    couponData.type === "PERCENT"
      ? Math.round((subtotal * Number(couponData.value || 0)) / 100)
      : Number(couponData.value || 0);
  const discountLabel =
    couponData.type === "PERCENT"
      ? `%${couponData.value} indirim`
      : `${formatPrice(Number(couponData.value || 0))} indirim`;

  const handleCopyCode = () => {
    if (!couponData.code) return;
    navigator.clipboard?.writeText(couponData.code);
    setCopied(true);
    toast.success(`Kupon kodu kopyalandı: ${couponData.code}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyAndCheckout = () => {
    if (couponData.code && discountAmount > 0) {
      setCoupon(couponData.code, discountAmount);
      toast.success(`${couponData.code} kuponu sepetinize otomatik uygulandı! (-${formatPrice(discountAmount)})`);
    }
    setIsOpen(false);
    router.push("/odeme");
  };

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
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="exit-intent-title"
            >
              {/* Kapat */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-ink hover:bg-white transition-colors"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Üst banner */}
              <div className="relative bg-gradient-to-br from-[#1e2426] to-[#14181a] p-7 sm:p-8 text-center text-white overflow-hidden">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                  className="relative mx-auto mb-4 flex h-15 w-15 items-center justify-center rounded-2xl bg-white/10 backdrop-blur"
                >
                  <Gift className="h-8 w-8 text-accent" />
                </motion.div>

                <h2 id="exit-intent-title" className="relative font-serif text-xl sm:text-2xl font-bold text-balance">
                  Sepetinde {count} ürün var
                </h2>
                <p className="relative mt-1.5 text-white/85 text-sm">
                  Şimdi tamamla, anında <span className="text-accent font-bold">{discountLabel}</span>{" "}
                  ({formatPrice(discountAmount)} avantaj) kazan!
                </p>
              </div>

              {/* İçerik */}
              <div className="p-6 text-center">
                {/* Geri sayım */}
                <div className="mb-4 flex items-center justify-center gap-2 rounded-2xl bg-accent/10 py-2.5">
                  <Timer className="h-4 w-4 text-accent" />
                  <span className="text-xs sm:text-sm font-semibold text-accent">
                    İndirim sona eriyor: {minutes}:{seconds.toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Kupon kodu (Tıklayınca kopyalanır) */}
                <div className="mb-5">
                  <p className="text-xs text-muted mb-2">
                    Kupon kodun (butona bastığında ödeme adımında otomatik uygulanır):
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 px-5 py-2 transition-colors hover:bg-accent/10"
                  >
                    <span className="font-mono text-lg font-bold tracking-widest text-ink">
                      {couponData.code}
                    </span>
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-accent" />
                    )}
                  </button>
                </div>

                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={handleApplyAndCheckout}
                >
                  <ShoppingBag className="h-5 w-5" /> İndirimi Uygula ve Sepetimi Tamamla
                </Button>

                <button
                  type="button"
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
