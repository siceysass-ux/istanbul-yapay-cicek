import Image from "next/image";
import { ShieldCheck, Truck, RotateCcw, CreditCard, Lock, BadgeCheck, Headphones } from "lucide-react";

interface TrustBarProps {
  variant?: "light" | "dark";
  className?: string;
}

const items = [
  {
    icon: ShieldCheck,
    title: "Güvenli Ödeme",
    desc: "256-bit SSL şifreleme",
  },
  {
    icon: RotateCcw,
    title: "14 Gün İade",
    desc: "Koşulsuz para iadesi",
  },
  {
    icon: Truck,
    title: "Ücretsiz Kargo",
    desc: "2000₺ üzeri siparişler",
  },
  {
    icon: CreditCard,
    title: "3 Taksit İmkanı",
    desc: "Tüm kredi kartlarına",
  },
  {
    icon: Lock,
    title: "KVKK Uyumlu",
    desc: "Verileriniz korunur",
  },
  {
    icon: Headphones,
    title: "7/24 Destek",
    desc: "WhatsApp & telefon",
  },
];

export function TrustBar({ variant = "light", className = "" }: TrustBarProps) {
  const isDark = variant === "dark";
  return (
    <section
      className={`border-y ${isDark ? "border-cream/10 bg-ink" : "border-primary/10 bg-cream-dark/30"} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <div
              key={item.title}
              className={`flex flex-col items-center gap-1.5 text-center ${isDark ? "text-cream" : "text-ink"}`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${
                  isDark ? "bg-cream/5 ring-1 ring-cream/10" : "bg-primary/5 ring-1 ring-primary/10"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isDark ? "text-accent" : "text-primary"}`} />
              </div>
              <span className="text-xs font-semibold">{item.title}</span>
              <span className={`text-[10px] ${isDark ? "text-cream/50" : "text-muted"}`}>{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Garanti bandı */}
        <div
          className={`mt-6 flex flex-col items-center justify-center gap-4 border-t pt-6 sm:flex-row ${
            isDark ? "border-cream/10" : "border-primary/10"
          }`}
        >
          <div className="flex items-center gap-2">
            <BadgeCheck className={`h-5 w-5 ${isDark ? "text-accent" : "text-primary"}`} />
            <span className={`text-xs ${isDark ? "text-cream/70" : "text-muted"}`}>
              Güvenli ödeme altyapısı
            </span>
          </div>
          <span className={`hidden h-4 w-px sm:block ${isDark ? "bg-cream/20" : "bg-primary/20"}`} />
          <span className={`text-xs ${isDark ? "text-cream/70" : "text-muted"}`}>
            10+ yıl deneyim · 500+ tamamlanan proje
          </span>
        </div>
      </div>
    </section>
  );
}
