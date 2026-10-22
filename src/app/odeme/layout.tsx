import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Güvenli Ödeme ve Sipariş Tamamlama",
  description: "256-bit SSL ve iyzico güvencesiyle siparişinizi tamamlayın.",
  robots: { index: false, follow: false },
};

export default function OdemeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
