import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "optional",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "optional",
});
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ExitIntentModal } from "@/components/marketing/exit-intent-modal";
import { SocialProof } from "@/components/marketing/social-proof";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CookieBanner } from "@/components/legal/cookie-banner";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { FlyingCart } from "@/components/shared/flying-cart";
import { ViewTransitions } from "@/components/shared/view-transitions";
import { CartHydration } from "@/components/shared/cart-hydration";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";
import { Toaster } from "sonner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "İstanbul Yapay Çiçek — Yapay Çiçek & Dikey Bahçe",
    template: "%s — İstanbul Yapay Çiçek",
  },
  description:
    "Yapay çiçek, ağaç ve dikey bahçe ürünleri. Bakım gerektirmez, ücretsiz kargo.",
  keywords: ["yapay çiçek", "yapay ağaç", "dikey bahçe", "yapay bitki", "gelin buketi", "kuru çiçek"],
  openGraph: {
    title: "İstanbul Yapay Çiçek",
    description: "Yapay çiçek ve dikey bahçe ürünleri",
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "İstanbul Yapay Çiçek",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "İstanbul Yapay Çiçek" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "İstanbul Yapay Çiçek",
    description: "Yapay çiçek ve dikey bahçe ürünleri",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <LocalBusinessJsonLd
          data={{
            name: "İstanbul Yapay Çiçek",
            phone: "0(507) 884 66 03",
            email: "info@dikeyyapaybahce.com",
            address: "Nuripaşa Mah. Merve Cad. No:73/A, Zeytinburnu / İstanbul",
            whatsapp: "905078846603",
          }}
        />
        <ScrollProgress />
        <CartHydration />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <ExitIntentModal />
        <SocialProof />
        <WhatsAppButton />
        <MobileNav />
        <CookieBanner />
        <FlyingCart />
        <ViewTransitions />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#f5ede0",
              border: "1px solid rgba(45,80,22,0.1)",
              color: "#202010",
            },
          }}
        />
      </body>
    </html>
  );
}
