import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    return [
      // P2-5: Dev Çiçekler kategori adresi uyumu
      {
        source: "/kategori/yapay-guller",
        destination: "/kategori/dev-cicekler",
        permanent: true,
      },
      // P1-2: Eski Shopify URL'lerinin 301 yönlendirmeleri
      {
        source: "/cart",
        destination: "/sepet",
        permanent: true,
      },
      {
        source: "/collections/all",
        destination: "/kategori/yapay-agac",
        permanent: true,
      },
      {
        source: "/collections/yapay-agac",
        destination: "/kategori/yapay-agac",
        permanent: true,
      },
      {
        source: "/collections/yapay-cicekler",
        destination: "/kategori/yapay-cicek",
        permanent: true,
      },
      {
        source: "/collections/yapay-guller",
        destination: "/kategori/dev-cicekler",
        permanent: true,
      },
      {
        source: "/collections/saksili-bitkiler",
        destination: "/kategori/saksi",
        permanent: true,
      },
      {
        source: "/collections/:slug",
        destination: "/kategori/yapay-agac",
        permanent: true,
      },
      {
        source: "/pages/iletisim",
        destination: "/iletisim",
        permanent: true,
      },
      {
        source: "/pages/contact",
        destination: "/iletisim",
        permanent: true,
      },
      {
        source: "/pages/hakkimizda",
        destination: "/hakkimizda",
        permanent: true,
      },
      {
        source: "/pages/about-us",
        destination: "/hakkimizda",
        permanent: true,
      },
      {
        source: "/pages/:slug",
        destination: "/hakkimizda",
        permanent: true,
      },
      // P1-4: Kurumsal dikey bahçe sayfalarının sunucu taraflı 301 yönlendirmeleri
      {
        source: "/projeler",
        destination: "https://dikeyyapaybahce.com/projeler",
        permanent: true,
      },
      {
        source: "/projeler/:slug",
        destination: "https://dikeyyapaybahce.com/projeler/:slug",
        permanent: true,
      },
      {
        source: "/galeri",
        destination: "https://dikeyyapaybahce.com/projeler",
        permanent: true,
      },
      {
        source: "/uygulamalar",
        destination: "https://dikeyyapaybahce.com/",
        permanent: true,
      },
      {
        source: "/uygulamalar/:slug",
        destination: "https://dikeyyapaybahce.com/",
        permanent: true,
      },
      {
        source: "/kesif-talebi",
        destination: "https://dikeyyapaybahce.com/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
