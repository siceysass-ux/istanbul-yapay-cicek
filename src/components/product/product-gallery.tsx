"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@prisma/client";

interface ProductGalleryProps {
  images: ProductImage[];
  productName?: string;
  model3dUrl?: string | null;
}

export function ProductGallery({
  images,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] sm:aspect-[3/5] rounded-2xl sm:rounded-3xl bg-primary/5 flex items-center justify-center">
        <p className="text-muted">Görsel yok</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-3 sm:space-y-4">
      {/* Ana görsel */}
      <div
        className="relative mx-auto w-full aspect-[4/5] max-h-[52vh] sm:max-h-none sm:aspect-[3/5] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#f4f3ef] border border-primary/8 cursor-zoom-in group"
        onClick={() => setZoomOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full w-full"
          >
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain sm:object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1 rounded-full bg-ink/65 px-2.5 py-1 text-[11px] text-cream backdrop-blur-xs sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <ZoomIn className="h-3 w-3" /> Büyüt
        </div>

        {/* Navigasyon okları */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i - 1 + images.length) % images.length);
              }}
              aria-label="Önceki görsel"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur sm:opacity-0 transition-opacity sm:group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i + 1) % images.length);
              }}
              aria-label="Sonraki görsel"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur sm:opacity-0 transition-opacity sm:group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail galeri */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-14 sm:h-20 sm:w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                activeIndex === i
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-transparent opacity-65 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom modal */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-3 sm:p-4"
          >
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              aria-label="Görseli kapat"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative h-full max-h-[88vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIndex].url}
                alt={images[activeIndex].alt}
                fill
                sizes="95vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
