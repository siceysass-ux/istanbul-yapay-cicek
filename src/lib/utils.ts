import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, _currency = "TRY") {
  const num = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
  return `${num} ₺`;
}

export function slugify(text: string) {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i", ö: "o", Ö: "o",
    ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return text
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (m) => map[m] || m)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
