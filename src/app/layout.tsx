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
import { SocialProof } from "@/components/marketing/social-proof";
import { ExitIntentModal } from "@/components/marketing/exit-intent-modal";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CookieBanner } from "@/components/legal/cookie-banner";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { FlyingCart } from "@/components/shared/flying-cart";
import { ViewTransitions } from "@/components/shared/view-transitions";
import { CartHydration } from "@/components/shared/cart-hydration";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";
import { AnalyticsScripts } from "@/components/seo/analytics-scripts";
import { Toaster } from "sonner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cicekyapay.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Çiçek Yapay — Yapay Ağaç, Saksılı Bitki ve Yapay Çiçek Koleksiyonu",
    template: "%s — Çiçek Yapay",
  },
  description:
    "Doğal ahşap gövdeli yapay ağaçlar, tasarım saksılı bitkiler, bonsai modelleri ve dev dekoratif çiçekler. 2.000₺ üzeri ücretsiz kargo ve 14 gün iade hakkı.",
  openGraph: {
    title: "Çiçek Yapay — Yapay Ağaç ve Bitki Koleksiyonu",
    description:
      "Doğal ahşap gövdeli yapay ağaçlar, tasarım saksılı bitkiler, bonsai modelleri ve dev dekoratif çiçekler.",
    type: "website",
    locale: "tr_TR",
    siteName: "Çiçek Yapay",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Çiçek Yapay" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Çiçek Yapay — Yapay Ağaç ve Bitki Koleksiyonu",
    description:
      "Doğal ahşap gövdeli yapay ağaçlar, tasarım saksılı bitkiler ve dev dekoratif çiçekler.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "./" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
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
    <html lang="tr" className={`${playfair.variable} ${inter.variable} overflow-x-clip`} suppressHydrationWarning>
      <body className="antialiased overflow-x-clip" suppressHydrationWarning>
        <AnalyticsScripts />
        <LocalBusinessJsonLd
          data={{
            name: "Çiçek Yapay",
            phone: "0(507) 884 66 03",
            email: "info@cicekyapay.com",
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
        <SocialProof />
        <ExitIntentModal />
        <WhatsAppButton />
        <MobileNav />
        <CookieBanner />
        <FlyingCart />
        <ViewTransitions />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid rgba(242,104,22,0.25)",
              color: "#1e2426",
            },
          }}
        />
      </body>
    </html>
  );
}
