/**
 * E-posta gönderme modülü (Resend)
 * https://resend.com/docs
 *
 * Resend API anahtarı yoksa, e-posta log'lanır (geliştirme modu).
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? "İstanbul Yapay Çiçek <noreply@dikeyyapaybahce.com>";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * E-posta gönder. Resend yapılandırılmamışsa log'lar.
 */
export async function sendEmail({ to, subject, html }: EmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[EMAIL-DEV] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL-DEV] Body: ${html.substring(0, 200)}...`);
    return true;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend hatası:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("E-posta gönderme hatası:", err);
    return false;
  }
}

/**
 * Sipariş onay e-postası
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  total: number,
  items: { name: string; price: number; quantity: number }[]
): Promise<boolean> {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #e0d0b0">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #e0d0b0;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #e0d0b0;text-align:right">${(item.price * item.quantity).toLocaleString("tr-TR")}₺</td>
        </tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#f5ede0;font-family:Georgia,serif">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px">
        <div style="background:#2a2520;padding:32px;text-align:center">
          <h1 style="color:#f5ede0;margin:0;font-size:24px">Siparişiniz Alındı</h1>
          <p style="color:#e0c896;margin:8px 0 0">İstanbul Yapay Çiçek</p>
        </div>
        <div style="padding:32px">
          <p style="color:#202010;font-size:16px">Merhaba,</p>
          <p style="color:#807060;font-size:14px;line-height:1.6">
            Siparişiniz başarıyla alındı. Sipariş numaranız:
            <strong style="color:#2a2520">${orderNumber}</strong>
          </p>

          <table style="width:100%;margin:24px 0;border-collapse:collapse">
            <thead>
              <tr style="background:#e0d0b0">
                <th style="padding:12px;text-align:left;font-size:13px;color:#202010">Ürün</th>
                <th style="padding:12px;text-align:center;font-size:13px;color:#202010">Adet</th>
                <th style="padding:12px;text-align:right;font-size:13px;color:#202010">Tutar</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;text-align:right;font-weight:bold;color:#202010">Toplam</td>
                <td style="padding:12px;text-align:right;font-weight:bold;color:#2a2520;font-size:16px">${total.toLocaleString("tr-TR")}₺</td>
              </tr>
            </tfoot>
          </table>

          <div style="background:#e0d0b0;border-radius:12px;padding:16px;margin:24px 0">
            <p style="margin:0;color:#807060;font-size:13px">
              Siparişiniz 1-3 iş günü içinde kargoya verilecektir.
              Kargo takip numarası hazır olduğunda ayrı bir e-posta gönderilecektir.
            </p>
          </div>

          <div style="text-align:center;margin:32px 0">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/siparis/${orderNumber}"
               style="background:#2a2520;color:#f5ede0;padding:12px 32px;border-radius:24px;text-decoration:none;font-size:14px;display:inline-block">
              Siparişi Görüntüle
            </a>
          </div>

          <div style="border-top:1px solid #e0d0b0;padding-top:24px;margin-top:24px">
            <p style="color:#807060;font-size:12px;text-align:center">
              İstanbul Yapay Çiçek<br>
              Nuripaşa Mah. Merve Cad. No:73/A, Zeytinburnu / İstanbul<br>
              0(507) 884 66 03 · info@dikeyyapaybahce.com
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Sipariş Onayı — ${orderNumber}`,
    html,
  });
}

/**
 * Kargo takip e-postası
 */
export async function sendShippingEmail(
  email: string,
  orderNumber: string,
  cargoProvider: string,
  cargoCode: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f5ede0;font-family:Georgia,serif">
      <div style="max-width:600px;margin:20px auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:#2a2520;padding:32px;text-align:center">
          <h1 style="color:#f5ede0;margin:0;font-size:22px">Kargoya Verildi</h1>
        </div>
        <div style="padding:32px">
          <p style="color:#202010">Merhaba,</p>
          <p style="color:#807060;font-size:14px;line-height:1.6">
            <strong style="color:#2a2520">${orderNumber}</strong> numaralı siparişiniz kargoya verildi.
          </p>
          <div style="background:#e0d0b0;border-radius:12px;padding:16px;margin:24px 0">
            <p style="margin:0;color:#807060;font-size:13px">Kargo Firması: <strong>${cargoProvider}</strong></p>
            <p style="margin:8px 0 0;color:#807060;font-size:13px">Takip No: <strong>${cargoCode}</strong></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Kargo Bilgisi — ${orderNumber}`,
    html,
  });
}

/**
 * Keşif talebi alındı e-postası
 */
export async function sendQuoteRequestEmail(
  email: string,
  name: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f5ede0;font-family:Georgia,serif">
      <div style="max-width:600px;margin:20px auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:#2a2520;padding:32px;text-align:center">
          <h1 style="color:#f5ede0;margin:0;font-size:22px">Keşif Talebiniz Alındı</h1>
        </div>
        <div style="padding:32px">
          <p style="color:#202010">Merhaba ${name},</p>
          <p style="color:#807060;font-size:14px;line-height:1.6">
            Keşif talebiniz başarıyla alındı. Ekibimiz 24 saat içinde sizinle iletişime geçecek.
          </p>
          <div style="background:#e0d0b0;border-radius:12px;padding:16px;margin:24px 0">
            <p style="margin:0;color:#807060;font-size:13px">
              Sorularınız için: 0(507) 884 66 03 · info@dikeyyapaybahce.com
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Keşif Talebi Alındı — İstanbul Yapay Çiçek",
    html,
  });
}
