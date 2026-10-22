import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alışveriş Sepetim",
  description: "Çiçek Yapay alışveriş sepetiniz. 2.000₺ ve üzeri siparişlerde ücretsiz kargo.",
  robots: { index: false, follow: false },
};

export default function SepetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
