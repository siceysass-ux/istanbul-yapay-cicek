"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@prisma/client";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-3xl bg-primary/5 flex items-center justify-center">
        <p className="text-muted">Görsel yok</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Ana görsel */}
      <div
        className="relative aspect-square overflow-hidden rounded-3xl bg-primary/5 cursor-zoom-in group"
        onClick={() => setZoomOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-3 w-3" /> Büyüt
        </div>

        {/* 3D rozeti */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-accent/90 px-3 py-1.5 text-xs font-medium text-ink">
          <Box className="h-3 w-3" /> 360° Görünüm
        </div>

        {/* Navigasyon okları */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i - 1 + images.length) % images.length);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-cream/80 backdrop-blur opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i + 1) % images.length);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-cream/80 backdrop-blur opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail galeri */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                activeIndex === i
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent opacity-60 hover:opacity-100"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative h-full max-h-[90vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIndex].url}
                alt={images[activeIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
