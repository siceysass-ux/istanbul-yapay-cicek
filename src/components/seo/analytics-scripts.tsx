"use client";

import Script from "next/script";
import { useEffect } from "react";
import {
  GOOGLE_ADS_ID,
  GA4_ID,
  GTM_ID,
  META_PIXEL_ID,
  trackWhatsAppClick,
  trackPhoneClick,
} from "@/lib/analytics";

export function AnalyticsScripts() {
  // Sayfadaki tüm tel: ve wa.me link tıklamalarını otomatik yakala
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href") || "";
      if (href.includes("wa.me/")) {
        trackWhatsAppClick(window.location.pathname);
      } else if (href.startsWith("tel:")) {
        trackPhoneClick(window.location.pathname);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const primaryGtagId = GA4_ID || GOOGLE_ADS_ID;

  return (
    <>
      {/* Consent Mode v2 + dataLayer + gtag + fbq temel başlatıcı */}
      <Script id="consent-mode-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          var savedConsent = null;
          try { savedConsent = localStorage.getItem('dyc-cookie-consent'); } catch(e) {}
          var defaultState = savedConsent === 'rejected' ? 'denied' : 'granted';

          gtag('consent', 'default', {
            'ad_storage': defaultState,
            'ad_user_data': defaultState,
            'ad_personalization': defaultState,
            'analytics_storage': defaultState,
            'wait_for_update': 500
          });
          gtag('set', 'ads_data_redaction', true);
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}', { 'allow_enhanced_conversions': true });
          ${GA4_ID ? `gtag('config', '${GA4_ID}');` : ""}

          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          ${META_PIXEL_ID ? `fbq('init', '${META_PIXEL_ID}'); fbq('track', 'PageView');` : ""}
        `}
      </Script>

      {/* Google Tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryGtagId}`}
        strategy="afterInteractive"
      />

      {/* Google Tag Manager (eğer tanımlıysa) */}
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      )}
    </>
  );
}
