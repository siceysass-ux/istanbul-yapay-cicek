/**
 * Kargo takip entegrasyonu
 *
 * Türkiye'deki yaygın kargo firmaları için takip URL şablonları.
 * Gerçek API entegrasyonu için her firmanın API dokümanına bakın.
 */

interface CargoProvider {
  name: string;
  trackingUrlTemplate: string;
  apiAvailable: boolean;
}

export const cargoProviders: Record<string, CargoProvider> = {
  yurtici: {
    name: "Yurtiçi Kargo",
    trackingUrlTemplate: "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?kod={code}",
    apiAvailable: true,
  },
  mng: {
    name: "MNG Kargo",
    trackingUrlTemplate: "https://www.mngkargo.com.tr/tr/kargo-takip?k={code}",
    apiAvailable: true,
  },
  aras: {
    name: "Aras Kargo",
    trackingUrlTemplate: "https://www.araskargo.com/tr/kargo-takip?k={code}",
    apiAvailable: true,
  },
  ptt: {
    name: "PTT Kargo",
    trackingUrlTemplate: "https://gonderitakip.ptt.gov.tr/Track/Tracking?k={code}",
    apiAvailable: false,
  },
  surat: {
    name: "Sürat Kargo",
    trackingUrlTemplate: "https://www.suratkargo.com.tr/kargo-takip?k={code}",
    apiAvailable: false,
  },
  ups: {
    name: "UPS Kargo",
    trackingUrlTemplate: "https://www.ups.com.tr/tr/Pages/Tracking.aspx?k={code}",
    apiAvailable: true,
  },
  standard: {
    name: "Standart Kargo",
    trackingUrlTemplate: "#",
    apiAvailable: false,
  },
};

/**
 * Kargo takip URL'si oluştur
 */
export function getCargoTrackingUrl(provider: string, code: string): string {
  const p = cargoProviders[provider] ?? cargoProviders.standard;
  return p.trackingUrlTemplate.replace("{code}", encodeURIComponent(code));
}

/**
 * Kargo firması adını al
 */
export function getCargoProviderName(provider: string): string {
  return cargoProviders[provider]?.name ?? provider;
}

/**
 * Tüm kargo firmalarını listele (admin için)
 */
export function getCargoProviderList() {
  return Object.entries(cargoProviders).map(([key, value]) => ({
    id: key,
    name: value.name,
    apiAvailable: value.apiAvailable,
  }));
}
