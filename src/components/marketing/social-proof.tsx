"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, MapPin, X } from "lucide-react";

type ProductItem = {
  name: string;
  slug: string;
  image?: string;
};

type Notification = {
  id: number;
  name: string;
  city: string;
  product: ProductItem;
  action: string;
  time: string;
};

const names = [
  "Ayşe K.", "Mehmet D.", "Zeynep A.", "Mustafa Y.", "Elif Ş.",
  "Burak T.", "Selin Ö.", "Ahmet R.", "Deniz B.", "Ceren M.",
  "Emre Ç.", "Gizem K.", "Onur P.", "Buse N.", "Kerem F.",
  "Dilara S.", "Tolga A.", "Merve Y.", "Serkan D.", "Ece G.",
  "Hakan U.", "Pınar E.", "Kaan B.", "Neslihan T.", "Oğuzhan S.",
  "Seda K.", "Volkan M.", "Gökçe A.", "Sinan Ç.", "Tuğba Ö.",
  "Barış K.", "Damla Y.", "Cemre H.", "Furkan L.", "İrem N.",
  "Murat V.", "Hande S.", "Alperen K.", "Melis B.", "Cihan E.",
  "Derya T.", "Koray A.", "Yasemin G.", "Uğur Ş.", "Aslıhan D.",
  "Levent K.", "Nihan M.", "Berkay C.", "Şeyma R.", "Tamer Ö.",
  "Mimar Selin T.", "Mimar Caner A.", "İç Mimarpelin K.".replace("Mimarpelin", "Mimar Pelin"),
  "Dr. Kerem S.", "Dt. Ezgi Y.", "Av. Mert B.", "Ecz. Hilal C.",
  "Fulya D.", "Tuna G.", "Başak Ö.", "Erdem H.", "Nazlı Ç.",
  "Doruk A.", "Çağla M.", "Yiğit K.", "Sinem V.",
];

const cities = [
  "Kadıköy / İstanbul", "Beşiktaş / İstanbul", "Şişli / İstanbul",
  "Ataşehir / İstanbul", "Sarıyer / İstanbul", "Bakırköy / İstanbul",
  "Üsküdar / İstanbul", "Göktürk / İstanbul", "Başakşehir / İstanbul",
  "Beykoz / İstanbul", "Florya / İstanbul", "Etiler / İstanbul",
  "Çankaya / Ankara", "Çayyolu / Ankara", "İncek / Ankara",
  "Karşıyaka / İzmir", "Alsancak / İzmir", "Urla / İzmir", "Çeşme / İzmir",
  "Nilüfer / Bursa", "Bademli / Bursa", "Mudanya / Bursa",
  "Lara / Antalya", "Konyaaltı / Antalya", "Alanya / Antalya",
  "Bodrum / Muğla", "Fethiye / Muğla", "Marmaris / Muğla",
  "İzmit / Kocaeli", "Sapanca / Sakarya", "Merkez / Eskişehir",
  "Meram / Konya", "Şehitkamil / Gaziantep", "Seyhan / Adana",
  "Yenişehir / Mersin", "Melikgazi / Kayseri", "Atakum / Samsun",
  "Pamukkale / Denizli", "Ortahisar / Trabzon", "Süleymanpaşa / Tekirdağ",
  "Kuşadası / Aydın", "Ayvalık / Balıkesir", "Merkez / Çanakkale",
  "Merkez / Edirne", "Yunusemre / Manisa", "İskenderun / Hatay",
];

const catalogProducts: ProductItem[] = [
  { name: "Doğal Ahşap Gövdeli Meyveli Yapay Zeytin Ağacı – 185 cm", slug: "dogal-ahsap-govdeli-meyveli-yapay-zeytin-agaci-185-cm" },
  { name: "Doğal Çok Gövdeli Yosun Tabanlı Meyveli Yapay Zeytin Ağacı – 175 cm", slug: "dogal-cok-govdeli-meyveli-yapay-zeytin-agaci-175-cm" },
  { name: "Gri Asimetrik Taş Saksıda Kıvrımlı Gövdeli Yapay Çam Bonsai Ağacı – 155 cm", slug: "gri-tas-saksida-kivrimli-govdeli-yapay-cam-bonsai-agaci-155-cm" },
  { name: "Doğal Ahşap Gövdeli Pudra Pembe Sarkık Sakura (Kiraz Çiçeği) Ağacı – 180 cm", slug: "dogal-govdeli-pudra-pembe-sarkik-sakura-yapay-agac-180-cm" },
  { name: "Doğal Ahşap Gövdeli Beyaz Bahar Dalı (Sakura) Yapay Ağaç – 180 cm", slug: "dogal-govdeli-beyaz-bahar-dali-kiraz-cicegi-yapay-agac-180-cm" },
  { name: "Siyah Oluklu Saksıda Dev Yapraklı Yapay Starliçe (Strelitzia) Ağacı – 180 cm", slug: "siyah-oluklu-saksida-dev-yaprakli-yapay-starlice-agaci-180-cm" },
  { name: "Gerçek Bambu Gövdeli Çok Dallı Yapay Bambu Ağacı – 180 cm", slug: "gercek-bambu-govdeli-cok-dalli-yapay-bambu-agaci-180-cm" },
  { name: "Beyaz Geometrik Origami Saksıda Doğal Gövdeli Alacalı Benjamin Ağacı – 185 cm", slug: "beyaz-geometrik-saksida-alacali-yapay-benjamin-agaci-185-cm" },
  { name: "Beyaz Geometrik Origami Saksıda Yapay Şeflera (Schefflera) Ağacı – 160 cm", slug: "beyaz-geometrik-origami-saksida-yapay-seflera-agaci-160-cm" },
  { name: "Gold Şeritli Siyah Saksıda Doğal Gövdeli Yapay Araokarya (Çam) Ağacı – 175 cm", slug: "siyah-gold-seritli-saksida-dogal-govdeli-yapay-araokarya-cam-agaci-175-cm" },
  { name: "Doğal Ahşap Gövdeli Sarkık Beyaz Salkım (Wisteria) Yapay Ağaç – 180 cm", slug: "dogal-govdeli-beyaz-salkim-wisteria-yapay-agac-180-cm" },
  { name: "Doğal Ahşap Gövdeli Kırmızı Sarkık Begonvil Yapay Ağaç – 165 cm", slug: "dogal-govdeli-kirmizi-sarkik-begonvil-yapay-agac-165-cm" },
  { name: "Vizon Saksıda Doğal Gövdeli Fuşya Begonvil Yapay Ağaç – 180 cm", slug: "vizon-saksida-dogal-govdeli-fusya-begonvil-yapay-agac-180-cm" },
  { name: "Yoğun Yapraklı Yapay Muz ve Starliçe Tropikal Salon Ağacı – 175 cm", slug: "dev-yaprakli-yapay-muz-starlice-tropikal-salon-agaci-175-cm" },
  { name: "Yosunlu Sütun Gövdeli Yoğun Yapraklı Yapay Monstera (Deve Tabanı) – 170 cm", slug: "yosunlu-sutun-govdeli-yapay-monstera-deve-tabani-agaci-170-cm" },
  { name: "Krem Saksıda Uzun Dallı Yapay Monstera (Deve Tabanı) Bitkisi – 150 cm", slug: "krem-saksida-uzun-dalli-yapay-monstera-deve-tabani-150-cm" },
  { name: "Terracotta Saksıda Uzun Dallı Yapay Monstera (Deve Tabanı) Bitkisi – 150 cm", slug: "terracotta-saksida-uzun-dalli-yapay-monstera-deve-tabani-150-cm" },
  { name: "Üç Gövdeli Doğal Dokulu Yapay Sikas (Cycas) Palmiye Ağacı – 125 cm", slug: "cok-govdeli-yapay-sikas-cycas-palmiye-agaci-125-cm" },
  { name: "Krem Saksıda Kıvrımlı Doğal Gövdeli Kırmızı Bahar Dalı Ağacı – 145 cm", slug: "krem-saksida-kivrimli-govdeli-kirmizi-bahar-dali-agaci-145-cm" },
  { name: "Krem Saksıda Çok Gövdeli Doğal Yapay Ficus Benjamin Ağacı – 175 cm", slug: "krem-saksida-dogal-govdeli-yapay-ficus-benjamin-agaci-175-cm" },
  { name: "Beyaz Küre Seramik Saksıda Dekoratif Yapay Sedir Bonsai Ağacı – 95 cm", slug: "beyaz-kure-seramik-saksida-yapay-sedir-bonsai-agaci-95-cm" },
  { name: "Doğal Ahşap Gövdeli Sarkık Yapraklı Yapay Söğüt Ağacı – 180 cm", slug: "dogal-govdeli-sarkik-yaprakli-yapay-sogut-agaci-180-cm" },
  { name: "Uzun Antrasit Taş Dokulu Saksıda Yapay Şeflera (Schefflera) Ağacı – 160 cm", slug: "uzun-antrasit-tas-saksida-yapay-seflera-agaci-160-cm" },
  { name: "Uzun Antrasit Taş Dokulu Saksıda Kıvrımlı Yapay Çam Bonsai – 120 cm", slug: "uzun-antrasit-tas-saksida-yapay-cam-bonsai-agaci-120-cm" },
  { name: "Uzun Antrasit Saksıda Sanatsal Kıvrımlı Dal Yapay Ardıç ve Çam Ağacı – 145 cm", slug: "uzun-antrasit-saksida-kivrimli-dal-yapay-ardic-bonsai-145-cm" },
  { name: "Siyah Oluklu Silindir Saksıda Kıvrımlı Yapay Çam Bonsai Ağacı – 110 cm", slug: "siyah-oluklu-silindir-saksida-yapay-cam-bonsai-110-cm" },
  { name: "Siyah Oluklu Silindir Saksıda Yapay Şeflera (Schefflera) Bitkisi – 135 cm", slug: "siyah-oluklu-silindir-saksida-yapay-seflera-bitkisi-135-cm" },
  { name: "Krem Oluklu Saksıda Doğal Gövdeli Kırmızı Meyveli Yapay Ağaç – 175 cm", slug: "krem-oluklu-saksida-kirmizi-meyveli-yapay-kiraz-agaci-175-cm" },
  { name: "Krem Saksıda Dikey Formlu Kırmızı Yapay Bahar Dalı (Sakura) Ağacı – 165 cm", slug: "krem-saksida-dikey-formlu-kirmizi-bahar-dali-agaci-165-cm" },
  { name: "Siyah Saksıda Dikey Formlu Pembe Yapay Bahar Dalı (Sakura) Ağacı – 165 cm", slug: "siyah-saksida-dikey-formlu-pembe-bahar-dali-agaci-165-cm" },
  { name: "Yeşil Oluklu Saksıda Doğal Gövdeli Pembe Şeftali Çiçeği Yapay Ağaç – 160 cm", slug: "yesil-oluklu-saksida-pembe-seftali-cicegi-yapay-agac-160-cm" },
  { name: "Dev Ayaklı Mercan ve Gül Kurusu Dekoratif Lotus Çiçeği – 170 cm", slug: "dev-ayakli-mercan-gul-kurusu-dekoratif-lotus-cicegi-170-cm" },
  { name: "Dev Ayaklı Altın Uçlu Krem-Beyaz Dekoratif Şakayık ve Lotus Çiçeği – 175 cm", slug: "dev-ayakli-altin-uclu-krem-beyaz-dekoratif-sakayik-cicegi-175-cm" },
  { name: "Dev Ayaklı Pudra Pembe Katmerli Dekoratif Şakayık (Peony) Çiçeği – 170 cm", slug: "dev-ayakli-pudra-pembe-katmerli-dekoratif-sakayik-cicegi-170-cm" },
  { name: "Dev Ayaklı Pembe Göbekli Krem Dekoratif Manolya ve Hibiskus Çiçeği – 165 cm", slug: "dev-ayakli-pembe-gobekli-krem-dekoratif-manolya-cicegi-165-cm" },
  { name: "Dev Ayaklı Somon-Pembe Katmerli Dekoratif Gül ve Kamelya Çiçeği – 170 cm", slug: "dev-ayakli-somon-pembe-dekoratif-gul-kamelya-cicegi-170-cm" },
  { name: "Dev Ayaklı Altın Damarlı Kırmızı Dekoratif Gelincik ve Hibiskus Çiçeği – 165 cm", slug: "dev-ayakli-altin-damarli-kirmizi-dekoratif-gelincik-cicegi-165-cm" },
  { name: "Antrasit Petek Dokulu Küre Saksıda Yapay Philodendron Selloum – 160 cm", slug: "antrasit-petek-saksida-dev-yaprakli-yapay-philodendron-selloum-160-cm" },
  { name: "Beyaz Küre Saksıda Doğal Gövdeli Bordo-Kırmızı Yapay Çam Bonsai – 140 cm", slug: "beyaz-saksida-dogal-govdeli-bordo-kirmizi-yapay-cam-bonsai-140-cm" },
  { name: "Antrasit Petek Dokulu Saksıda Doğal Gövdeli Bordo Yapay Çam Bonsai – 140 cm", slug: "antrasit-kure-saksida-dogal-govdeli-bordo-yapay-cam-bonsai-140-cm" },
  { name: "Mat Siyah Saksıda İnce Yapraklı Yapay Starliçe (Heliconia) Bitkisi – 165 cm", slug: "siyah-saksida-ince-yaprakli-yapay-starlice-heliconia-165-cm" },
  { name: "Beyaz Küre Saksıda İnce Yapraklı Yapay Starliçe (Heliconia) Bitkisi – 165 cm", slug: "beyaz-saksida-ince-yaprakli-yapay-starlice-heliconia-165-cm" },
  { name: "Beyaz Saksıda Doğal Sarmaşık Gövdeli Yapay Ficus ve Okaliptus Ağacı – 160 cm", slug: "beyaz-saksida-dogal-govdeli-yapay-okaliptus-ficus-agaci-160-cm" },
];

const actions = [
  "sipariş verdi",
  "satın aldı",
  "2 adet sipariş verdi",
  "siparişini tamamladı",
  "ofisi için sipariş verdi",
];

const times = [
  "Az önce",
  "1 dakika önce",
  "3 dakika önce",
  "5 dakika önce",
  "8 dakika önce",
  "11 dakika önce",
  "14 dakika önce",
  "19 dakika önce",
  "24 dakika önce",
  "32 dakika önce",
  "45 dakika önce",
  "1 saat önce",
  "2 saat önce",
  "3 saat önce",
];

function pickDifferent<T>(arr: T[], lastIndex: number): { item: T; index: number } {
  if (arr.length <= 1) return { item: arr[0], index: 0 };
  let idx = Math.floor(Math.random() * arr.length);
  if (idx === lastIndex) {
    idx = (idx + 1 + Math.floor(Math.random() * (arr.length - 1))) % arr.length;
  }
  return { item: arr[idx], index: idx };
}

export function SocialProof() {
  const [current, setCurrent] = useState<Notification | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const productsRef = useRef<ProductItem[]>(catalogProducts);

  const lastNameIdx = useRef(-1);
  const lastCityIdx = useRef(-1);
  const lastProductIdx = useRef(-1);
  const seqRef = useRef(0);

  // Veritabanındaki aktif ürünleri (yeni eklenenler dahil) canlı çek
  useEffect(() => {
    fetch("/api/social-proof")
      .then((res) => res.json())
      .then((data: { items?: ProductItem[] }) => {
        if (Array.isArray(data.items) && data.items.length > 0) {
          productsRef.current = data.items;
        }
      })
      .catch(() => {});
  }, []);

  const nextNotification = (): Notification => {
    const pool = productsRef.current.length > 0 ? productsRef.current : catalogProducts;
    const n = pickDifferent(names, lastNameIdx.current);
    const c = pickDifferent(cities, lastCityIdx.current);
    const p = pickDifferent(pool, lastProductIdx.current);
    lastNameIdx.current = n.index;
    lastCityIdx.current = c.index;
    lastProductIdx.current = p.index;
    seqRef.current += 1;

    return {
      id: seqRef.current,
      name: n.item,
      city: c.item,
      product: p.item,
      action: actions[Math.floor(Math.random() * actions.length)],
      time: times[Math.floor(Math.random() * times.length)],
    };
  };

  useEffect(() => {
    if (dismissed) return;

    const firstTimer = setTimeout(() => {
      setCurrent(nextNotification());
      setVisible(true);
    }, 4500);

    return () => clearTimeout(firstTimer);
  }, [dismissed]);

  useEffect(() => {
    if (!visible || !current) return;

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 5500);

    return () => clearTimeout(hideTimer);
  }, [visible, current]);

  useEffect(() => {
    if (dismissed) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(nextNotification());
        setVisible(true);
      }, 700);
    }, 16000 + Math.random() * 6000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-20 left-3 z-40 lg:bottom-4 lg:left-4">
      <AnimatePresence mode="wait">
        {visible && current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -40, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -40, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-[325px] overflow-hidden rounded-2xl border border-primary/15 bg-white/95 p-3 shadow-2xl shadow-primary/15 backdrop-blur-lg"
          >
            {/* Kapat */}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/5 hover:text-ink"
              aria-label="Bildirimleri kapat"
            >
              <X className="h-3 w-3" />
            </button>

            <Link
              href={`/urun/${current.product.slug}`}
              className="flex items-center gap-3 pr-4 group"
            >
              {/* Ürün mini fotoğrafı (DB'den gelen kapak görseli) */}
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl border border-primary/15 bg-cream-dark shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.product.image || `/products/${current.product.slug}/1.jpg`}
                  alt={current.product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* İçerik */}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] leading-snug text-ink">
                  <span className="font-semibold">{current.name}</span>{" "}
                  <span className="inline-flex items-center gap-0.5 text-muted">
                    (<MapPin className="h-2.5 w-2.5 text-accent" />
                    {current.city})
                  </span>{" "}
                  {current.action}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold text-accent group-hover:underline">
                  {current.product.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted">
                  <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0" />
                  <span>{current.time} · Doğrulanmış sipariş</span>
                </p>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
