"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, MapPin, X } from "lucide-react";

type Notification = {
  name: string;
  city: string;
  product: string;
  time: string;
};

const names = [
  "Ayşe K.", "Mehmet D.", "Zeynep A.", "Mustafa Y.", "Elif Ş.",
  "Burak T.", "Selin Ö.", "Ahmet R.", "Deniz B.", "Ceren M.",
  "Emre Ç.", "Gizem K.", "Onur P.", "Buse N.", "Kerem F.",
  "Dilara S.", "Tolga A.", "Merve Y.", "Serkan D.", "Ece G.",
];

const cities = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya",
  "Adana", "Konya", "Gaziantep", "Mersin", "Eskişehir",
  "Samsun", "Trabzon", "Kayseri", "Denizli", "Sakarya",
];

const products = [
  "Yapay Dikey Bahçe Paneli",
  "Yapay Ağaç 150cm",
  "Yosun Duvar Paneli",
  "Yapay Gül Buketi",
  "Dikey Bahçe Modülü",
  "Yapay Sarmaşık",
  "Yosun Tablo",
  "Yapay Bambu 200cm",
  "Luxury Boxwood Panel",
  "Akustik Yosun Panel",
  "Yapay Çit Sistemi",
  "Bölücü Panel",
];

const times = [
  "2 dakika önce",
  "5 dakika önce",
  "8 dakika önce",
  "12 dakika önce",
  "1 saat önce",
  "1 saat önce",
  "3 saat önce",
  "Az önce",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNotification(): Notification {
  return {
    name: randomItem(names),
    city: randomItem(cities),
    product: randomItem(products),
    time: randomItem(times),
  };
}

export function SocialProof() {
  const [current, setCurrent] = useState<Notification | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // İlk bildirim — 5 saniye sonra
    const firstTimer = setTimeout(() => {
      setCurrent(randomNotification());
      setVisible(true);
    }, 5000);

    return () => clearTimeout(firstTimer);
  }, [dismissed]);

  useEffect(() => {
    if (!visible || !current) return;

    // 5 saniye sonra otomatik gizle
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(hideTimer);
  }, [visible, current]);

  useEffect(() => {
    if (dismissed) return;

    // Her 15-25 saniyede bir yeni bildirim
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(randomNotification());
        setVisible(true);
      }, 800);
    }, 18000 + Math.random() * 7000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 lg:bottom-4">
      <AnimatePresence mode="wait">
        {visible && current && (
          <motion.div
            key={`${current.name}-${current.product}-${Date.now()}`}
            initial={{ opacity: 0, x: -40, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -40, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-[300px] overflow-hidden rounded-2xl border border-primary/10 bg-white/95 p-3 shadow-2xl shadow-primary/10 backdrop-blur-lg"
          >
            {/* Kapat */}
            <button
              onClick={() => setDismissed(true)}
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/5 hover:text-primary"
              aria-label="Bildirimleri kapat"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="flex items-start gap-2.5 pr-4">
              {/* Onay ikonu */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>

              {/* İçerik */}
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-snug text-ink">
                  <span className="font-semibold">{current.name}</span> (
                  <span className="inline-flex items-center gap-0.5">
                    <MapPin className="h-2.5 w-2.5" />
                    {current.city}
                  </span>
                  ) bir sipariş verdi
                </p>
                <p className="mt-0.5 truncate text-[11px] font-medium text-primary">
                  {current.product}
                </p>
                <p className="mt-0.5 text-[10px] text-muted">
                  {current.time} · Doğrulanmış alım
                </p>
              </div>
            </div>

            {/* Alt ilerleme çubuğu */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-0.5 bg-accent/60"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
