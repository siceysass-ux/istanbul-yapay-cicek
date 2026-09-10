/**
 * Projelerin coverImage'ını yerel görsellerle güncelle
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const localImages = [
  "/projects/project-1.webp",
  "/projects/project-2.webp",
  "/projects/project-3.jpg",
  "/projects/project-4.jpg",
  "/projects/project-5.jpg",
  "/projects/project-6.webp",
];

async function main() {
  console.log("=== Proje görselleri güncelleniyor ===\n");

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "asc" },
  });

  console.log(`Toplam ${projects.length} proje bulundu\n`);

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const imageUrl = localImages[i % localImages.length];

    await prisma.project.update({
      where: { id: project.id },
      data: { coverImage: imageUrl },
    });

    console.log(`✓ ${project.title} → ${imageUrl}`);
  }

  console.log(`\n=== Tamamlandı: ${projects.length} proje güncellendi ===`);
}

main()
  .catch((err) => {
    console.error("Hata:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
