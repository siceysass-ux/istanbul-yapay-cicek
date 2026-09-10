/**
 * Görsel optimizasyon scripti
 * İndirilen görselleri optimize eder, WebP'ye dönüştürür, farklı boyutlar oluşturur.
 * Çalıştırma: npx tsx scripts/optimize-images.ts
 */

import sharp from "sharp";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";

const SRC = join(process.cwd(), "public", "site");
const OUT = join(process.cwd(), "public", "site", "optimized");

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

interface OptimizeTask {
  input: string;
  output: string;
  width?: number;
  height?: number;
  quality?: number;
  format: "webp" | "jpg" | "png";
}

const tasks: OptimizeTask[] = [
  // Hero — ana görsel (dikey yeşil duvar)
  { input: "hero.jpg", output: "hero-large.webp", width: 1200, quality: 80, format: "webp" },
  { input: "hero.jpg", output: "hero-medium.webp", width: 800, quality: 75, format: "webp" },
  { input: "hero.jpg", output: "hero-small.webp", width: 480, quality: 70, format: "webp" },
  { input: "hero.jpg", output: "hero-original.webp", quality: 85, format: "webp" },

  // Content — yatay yeşil duvar
  { input: "content.webp", output: "content-large.webp", width: 1440, quality: 80, format: "webp" },
  { input: "content.webp", output: "content-medium.webp", width: 800, quality: 75, format: "webp" },
  { input: "content.webp", output: "content-small.webp", width: 480, quality: 70, format: "webp" },

  // OG image — sosyal medya
  { input: "og-image.png", output: "og-image.jpg", width: 1200, height: 630, quality: 85, format: "jpg" },
  { input: "og-image.png", output: "og-image.webp", width: 1200, height: 630, quality: 85, format: "webp" },

  // Logo
  { input: "logo.png", output: "logo.webp", quality: 90, format: "webp" },
  { input: "logo.png", output: "logo@2x.webp", width: 700, quality: 90, format: "webp" },

  // Favicon
  { input: "favicon.png", output: "favicon-32.png", width: 32, height: 32, format: "png" },
  { input: "favicon.png", output: "favicon-16.png", width: 16, height: 16, format: "png" },
  { input: "apple-touch-icon.png", output: "apple-touch-icon.webp", width: 180, height: 180, quality: 90, format: "webp" },
];

async function optimize() {
  console.log("Görsel optimizasyon başlıyor...\n");

  for (const task of tasks) {
    const inputPath = join(SRC, task.input);
    const outputPath = join(OUT, task.output);

    if (!existsSync(inputPath)) {
      console.log(`SKIP: ${task.input} bulunamadı`);
      continue;
    }

    try {
      let pipeline = sharp(inputPath);

      if (task.width || task.height) {
        pipeline = pipeline.resize({
          width: task.width,
          height: task.height,
          fit: "cover",
          position: "center",
        });
      }

      if (task.format === "webp") {
        pipeline = pipeline.webp({ quality: task.quality ?? 80, effort: 4 });
      } else if (task.format === "jpg") {
        pipeline = pipeline.jpeg({ quality: task.quality ?? 85, mozjpeg: true });
      } else if (task.format === "png") {
        pipeline = pipeline.png({ quality: task.quality ?? 90, compressionLevel: 9 });
      }

      await pipeline.toFile(outputPath);

      const inputSize = (await sharp(inputPath).metadata()).size ?? 0;
      const outputStats = await sharp(outputPath).metadata();
      const outputSize = outputStats.size ?? 0;
      const reduction = inputSize > 0 ? Math.round((1 - outputSize / inputSize) * 100) : 0;

      console.log(
        `OK: ${task.output} — ${outputStats.width}x${outputStats.height} (${(outputSize / 1024).toFixed(1)}KB${reduction > 0 ? `, -${reduction}%` : ""})`
      );
    } catch (err) {
      console.error(`FAIL: ${task.output} — ${err}`);
    }
  }

  console.log("\nOptimizasyon tamamlandı!");
}

optimize().catch(console.error);
