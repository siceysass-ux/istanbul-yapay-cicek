import { CustomerSegments } from "@/components/shared/application-areas";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = { title: "Hakkımızda", description: "Dikey Yapay Bahçe — yapay dikey bahçe, yosun duvar, büyük yapay ağaç ve dekorasyon çözümleri." };

export default function HakkimizdaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold mb-6">Hakkımızda</h1>

      <div className="space-y-4 text-ink/80 leading-relaxed">
        <p>
          Profesyonel ve uzman ekibimiz, müşterilerimizin ihtiyaç ve isteklerine uygun
          çözümler önermek konusunda yılları aşan bir deneyime sahiptir. Tüm tasarım
          önerileri, derinlemesine çalışmaların sonuçlarına ve modern kanıtlanmış
          uygulamaların benimsenmesine dayanır.
        </p>
        <p>
          İlk yılımızdan itibaren iç ve dış mekanları yeşillendirdiğimiz, ara alanlar
          tasarladığımız, yapay dikey bahçeler oluşturduğumuz, yapay büyük ağaçları
          çeşitli tasarım saksılarla bezdiğimiz birçok projede yer aldık.
        </p>
        <p>
          İç mimarlardan proje firmalarına kadar birçok dekorasyon uzmanıyla direk
          temasında çalışıyor; yapay dikey bahçe, büyük yapay ağaç, yapay bambu,
          yosun duvar gibi uzmanlık alanımız olan tüm hizmetleri veriyoruz.
        </p>
      </div>

      <h2 className="font-serif text-xl font-semibold mt-10 mb-4">Uzmanlığımız</h2>
      <ul className="space-y-2 text-ink/80">
        <li>• Yapay dikey bahçe, çiçek ve kaplama dekorasyonları</li>
        <li>• Biyofilik tasarım</li>
        <li>• Proje üretimi, alan değerlendirmesi</li>
        <li>• Tasarım, kurulum, bakım ve revizyon</li>
      </ul>

      {/* Şirket bilgileri */}
      <div className="mt-10 rounded-2xl border border-primary/10 bg-white/60 p-6">
        <h2 className="font-serif text-xl font-semibold mb-4">İletişim Bilgileri</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium">Telefon</div>
              <a href="tel:+905078846603" className="text-sm text-muted hover:text-primary">0(507) 884 66 03</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium">E-posta</div>
              <a href="mailto:info@dikeyyapaybahce.com" className="text-sm text-muted hover:text-primary">info@dikeyyapaybahce.com</a>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:col-span-2">
            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium">Adres</div>
              <p className="text-sm text-muted">Nuripaşa Mah. Merve Cad. No:73/A, Zeytinburnu / İstanbul</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium">Çalışma Saatleri</div>
              <p className="text-sm text-muted">Pazartesi - Cumartesi, 09:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/kesif-talebi" className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-cream hover:bg-primary-dark transition-colors">
          Teklif Al
        </Link>
      </div>

      <CustomerSegments />
    </div>
  );
}
