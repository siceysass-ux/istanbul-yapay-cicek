interface LocalBusinessData {
  name: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function LocalBusinessJsonLd({ data }: { data: LocalBusinessData }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    name: data.name,
    telephone: data.phone,
    email: data.email,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address,
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.9798,
      longitude: 28.9024,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "₺₺",
    sameAs: [
      "https://instagram.com/dikeyyapaybahce",
      "https://facebook.com/dikeyyapaybahce",
      "https://youtube.com/@dikeyyapaybahce",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ProductData {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  sku: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export function ProductJsonLd({ product }: { product: ProductData }) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.image,
    url: `${SITE_URL}/urun/${product.slug}`,
    brand: { "@type": "Brand", name: "İstanbul Yapay Çiçek" },
    offers: {
      "@type": "Offer",
      price: product.discountPrice ?? product.price,
      priceCurrency: "TRY",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/urun/${product.slug}`,
      seller: { "@type": "Organization", name: "İstanbul Yapay Çiçek" },
    },
  };

  if (product.rating > 0 && product.reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
