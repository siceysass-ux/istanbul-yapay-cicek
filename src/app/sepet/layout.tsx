import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alışveriş Sepetim",
  description: "Çiçek Yapay alışveriş sepetiniz. Tüm ürünlerde Türkiye geneli ücretsiz kargo.",
  robots: { index: false, follow: false },
};

export default function SepetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
