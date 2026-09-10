"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Öncesi",
  afterLabel = "Sonrası",
  alt = "Öncesi ve sonrası karşılaştırma",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      updatePosition(clientX);
    };
    const handleEnd = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full cursor-ew-resize overflow-hidden rounded-3xl select-none"
      onMouseDown={(e) => {
        setIsDragging(true);
        updatePosition(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        updatePosition(e.touches[0].clientX);
      }}
    >
      {/* After (arka plan, tam) */}
      <Image
        src={afterImage}
        alt={`${alt} — ${afterLabel}`}
        fill
        sizes="(max-width: 1024px) 100vw, 1024px"
        className="object-cover"
        priority
      />
      {/* After etiket */}
      <div className="absolute right-4 top-4 z-10 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-medium text-cream backdrop-blur">
        {afterLabel}
      </div>

      {/* Before (ön plan, clip ile) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt={`${alt} — ${beforeLabel}`}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
        {/* Before etiket */}
        <div className="absolute left-4 top-4 z-10 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-medium text-cream backdrop-blur">
          {beforeLabel}
        </div>
      </div>

      {/* Sürükleme çizgisi + handle */}
      <div
        className="absolute inset-y-0 z-20 flex items-center"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Çizgi */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-cream shadow-lg" />
        {/* Handle */}
        <div
          className={cn(
            "relative flex h-12 w-12 items-center justify-center rounded-full bg-cream shadow-xl transition-transform",
            isDragging && "scale-110"
          )}
        >
          <MoveHorizontal className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Alt ipucu */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-4 py-1.5 text-xs text-cream backdrop-blur">
        ← Kaydırarak karşılaştır →
      </div>
    </div>
  );
}
