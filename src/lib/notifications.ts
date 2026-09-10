/**
 * Bildirim modülü — e-posta ve SMS gönderimini birleştirir.
 * Keşif talepleri ve iletişim formları için.
 */

import { sendEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";

/**
 * Keşif talebi alındı bildirimi (müşteriye)
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

export async function sendQuoteRequestSms(
  phone: string,
  name: string
): Promise<boolean> {
  const message = `İstanbul Yapay Çiçek: ${name}, kesif talebiniz alindi. Ekibimiz 24 saat icinde sizinle iletisime gececek.`;
  return sendSms({ to: phone, message });
}

/**
 * Keşif talebi — admin bildirimi
 */
export async function sendQuoteRequestAdminNotification(
  data: { name: string; phone: string; email: string; placeType?: string; area?: string; description?: string }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f5ede0;font-family:Georgia,serif">
      <div style="max-width:600px;margin:20px auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:#c0a060;padding:24px;text-align:center">
          <h1 style="color:#202010;margin:0;font-size:20px">Yeni Keşif Talebi</h1>
        </div>
        <div style="padding:24px">
          <table style="width:100%;font-size:14px;color:#202010">
            <tr><td style="padding:8px;color:#807060">Ad Soyad:</td><td style="padding:8px"><strong>${data.name}</strong></td></tr>
            <tr><td style="padding:8px;color:#807060">Telefon:</td><td style="padding:8px">${data.phone}</td></tr>
            <tr><td style="padding:8px;color:#807060">E-posta:</td><td style="padding:8px">${data.email}</td></tr>
            ${data.placeType ? `<tr><td style="padding:8px;color:#807060">Mekan:</td><td style="padding:8px">${data.placeType}</td></tr>` : ""}
            ${data.area ? `<tr><td style="padding:8px;color:#807060">Alan:</td><td style="padding:8px">${data.area} m²</td></tr>` : ""}
            ${data.description ? `<tr><td style="padding:8px;color:#807060">Açıklama:</td><td style="padding:8px">${data.description}</td></tr>` : ""}
          </table>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/kesif-talepleri"
             style="display:inline-block;margin-top:16px;background:#2a2520;color:#f5ede0;padding:10px 24px;border-radius:20px;text-decoration:none;font-size:13px">
            Admin Panel'de Görüntüle
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: "info@dikeyyapaybahce.com",
    subject: `Yeni Keşif Talebi — ${data.name}`,
    html,
  });
}

/**
 * İletişim mesajı — admin bildirimi
 */
export async function sendContactMessageAdminNotification(
  data: { name: string; phone?: string; email?: string; message: string }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f5ede0;font-family:Georgia,serif">
      <div style="max-width:600px;margin:20px auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:#c0a060;padding:24px;text-align:center">
          <h1 style="color:#202010;margin:0;font-size:20px">Yeni İletişim Mesajı</h1>
        </div>
        <div style="padding:24px">
          <table style="width:100%;font-size:14px;color:#202010">
            <tr><td style="padding:8px;color:#807060">Ad Soyad:</td><td style="padding:8px"><strong>${data.name}</strong></td></tr>
            ${data.phone ? `<tr><td style="padding:8px;color:#807060">Telefon:</td><td style="padding:8px">${data.phone}</td></tr>` : ""}
            ${data.email ? `<tr><td style="padding:8px;color:#807060">E-posta:</td><td style="padding:8px">${data.email}</td></tr>` : ""}
            <tr><td style="padding:8px;color:#807060;vertical-align:top">Mesaj:</td><td style="padding:8px">${data.message}</td></tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/mesajlar"
             style="display:inline-block;margin-top:16px;background:#2a2520;color:#f5ede0;padding:10px 24px;border-radius:20px;text-decoration:none;font-size:13px">
            Admin Panel'de Görüntüle
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: "info@dikeyyapaybahce.com",
    subject: `Yeni İletişim Mesajı — ${data.name}`,
    html,
  });
}
