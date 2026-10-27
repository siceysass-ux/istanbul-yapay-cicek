"use client";

import { usePathname } from "next/navigation";
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

export function StorefrontChrome({
  children,
  socialProofEnabled = true,
}: {
  children: React.ReactNode;
  socialProofEnabled?: boolean;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      {socialProofEnabled && <SocialProof />}
      <ExitIntentModal />
      <WhatsAppButton />
      <MobileNav />
      <CookieBanner />
      <FlyingCart />
    </>
  );
}
