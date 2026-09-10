/**
 * SMS gönderme modülü (Netgsm)
 * https://www.netgsm.com.tr/
 *
 * Netgsm API anahtarı yoksa, SMS log'lanır (geliştirme modu).
 */

const NETGSM_USERNAME = process.env.NETGSM_USERNAME ?? "";
const NETGSM_PASSWORD = process.env.NETGSM_PASSWORD ?? "";
const NETGSM_SENDER = process.env.NETGSM_SENDER_NAME ?? "DIKEYCICEK";

const NETGSM_API_URL = "https://api.netgsm.com.tr/sms/send";

interface SmsParams {
  to: string;
  message: string;
}

/**
 * SMS gönder. Netgsm yapılandırılmamışsa log'lar.
 */
export async function sendSms({ to, message }: SmsParams): Promise<boolean> {
  // Telefon numarasını temizle
  const phone = to.replace(/\D/g, "");
  if (phone.length < 10) {
    console.error("Geçersiz telefon numarası:", to);
    return false;
  }

  // Türkiye formatı: 90XXXXXXXXXX
  const formattedPhone = phone.startsWith("90") ? phone : `90${phone}`;

  if (!NETGSM_USERNAME || !NETGSM_PASSWORD) {
    console.log(`[SMS-DEV] To: ${formattedPhone} | Message: ${message}`);
    return true;
  }

  try {
    const response = await fetch(NETGSM_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: NETGSM_USERNAME,
        password: NETGSM_PASSWORD,
        sender: NETGSM_SENDER,
        message,
        gsmno: formattedPhone,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Netgsm hatası:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("SMS gönderme hatası:", err);
    return false;
  }
}

/**
 * Sipariş onay SMS'i
 */
export async function sendOrderSms(
  phone: string,
  orderNumber: string,
  total: number
): Promise<boolean> {
  const message = `İstanbul Yapay Çiçek: Siparişiniz alındi. Sipariş No: ${orderNumber}. Tutar: ${total.toLocaleString("tr-TR")}₺. Teslimat 1-3 is gunu icinde yapilir.`;

  return sendSms({ to: phone, message });
}

/**
 * Kargo takip SMS'i
 */
export async function sendShippingSms(
  phone: string,
  orderNumber: string,
  cargoProvider: string,
  cargoCode: string
): Promise<boolean> {
  const message = `İstanbul Yapay Çiçek: ${orderNumber} numarali siparisiniz kargoya verildi. ${cargoProvider} - Takip No: ${cargoCode}`;

  return sendSms({ to: phone, message });
}

/**
 * Keşif talebi onay SMS'i
 */
export async function sendQuoteRequestSms(
  phone: string,
  name: string
): Promise<boolean> {
  const message = `İstanbul Yapay Çiçek: ${name}, kesif talebiniz alindi. Ekibimiz 24 saat icinde sizinle iletisime gececek.`;

  return sendSms({ to: phone, message });
}

export function isSmsConfigured(): boolean {
  return Boolean(NETGSM_USERNAME && NETGSM_PASSWORD);
}
