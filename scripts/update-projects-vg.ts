/**
 * Projeleri vg-optimized görselleriyle güncelle
 * 27 mevcut proje, 39 proje görseli
 * İlk 27 görsel coverImage, kalan 12 gallery'ler için
 */

import { PrismaClient } from "@prisma/client";
import { readdir } from "fs/promises";

const prisma = new PrismaClient();

async function main() {
  const dir = "public/vg-optimized";
  const allImages = (await readdir(dir))
    .filter((f) => f.startsWith("vg-project-"))
    .sort();

  console.log(`Toplam proje görseli: ${allImages.length}\n`);

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "asc" },
  });

  console.log(`Mevcut proje sayısı: ${projects.length}\n`);

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const coverImage = `/vg-optimized/${allImages[i]}`;

    // Gallery için 2-3 görsel daha ekle
    const galleryStart = projects.length + (i * 2) % (allImages.length - projects.length);
    const galleryImages = [
      `/vg-optimized/${allImages[galleryStart % allImages.length]}`,
      `/vg-optimized/${allImages[(galleryStart + 1) % allImages.length]}`,
    ];

    await prisma.project.update({
      where: { id: project.id },
      data: {
        coverImage,
        gallery: JSON.stringify(galleryImages),
      },
    });

    console.log(`✓ ${project.title}`);
    console.log(`  cover: ${coverImage}`);
    console.log(`  gallery: ${galleryImages.length} görsel`);
  }

  console.log(`\n=== Tamamlandı: ${projects.length} proje güncellendi ===`);
}

main()
  .catch((err) => {
    console.error("Hata:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
