import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, projects, applications] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.project.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.project.findMany({
      where: { isActive: true },
      select: { slug: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/projeler`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/galeri`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/uygulamalar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/kesif-talebi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/sayfalar/mesafeli-satis-sozlesmesi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/sayfalar/gizlilik-politikasi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/sayfalar/iade-kosullari`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/sayfalar/kvkk-aydinlatma`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/sayfalar/cerez-politikasi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const applicationSlugs = [
    "yapay-dikey-bahce",
    "yosun-duvar",
    "buyuk-yapay-agac",
    "yapay-gul-duvar-kaplama",
    "yosun-tablolar",
    "yapay-bambu-dekorasyonu",
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/urun/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/kategori/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projeler/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const applicationRoutes: MetadataRoute.Sitemap = applicationSlugs.map((s) => ({
    url: `${SITE_URL}/uygulamalar/${s}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...projectRoutes, ...applicationRoutes];
}
