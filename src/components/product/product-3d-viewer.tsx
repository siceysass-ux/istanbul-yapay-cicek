"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ZoomIn,
  ZoomOut,
  Upload,
  X,
  Move,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageItem {
  id: string;
  url: string;
  alt: string;
}

interface Product3DViewerProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  images: ProductImageItem[];
}

const ROOM_PRESETS = [
  {
    id: "salon",
    label: "Modern Salon",
    bg: "linear-gradient(180deg, #e8e2d8 0%, #dcd4c6 68%, #b8a992 68.5%, #9e8d74 100%)",
    wallTone: "rgba(255,250,240,0.18)",
  },
  {
    id: "ofis",
    label: "Yönetici Ofisi",
    bg: "linear-gradient(180deg, #d6dadf 0%, #c5cbd2 68%, #6d655c 68.5%, #524b43 100%)",
    wallTone: "rgba(220,230,245,0.15)",
  },
  {
    id: "lobi",
    label: "Otel Lobisi",
    bg: "linear-gradient(180deg, #2b2621 0%, #1f1b17 68%, #3c342b 68.5%, #26201a 100%)",
    wallTone: "rgba(200,166,98,0.12)",
  },
];

export function Product3DViewer({
  isOpen,
  onClose,
  productName,
  images,
}: Product3DViewerProps) {
  const [cutoutSrc, setCutoutSrc] = useState<string>("");

  // AR / Room placement state
  const [arSource, setArSource] = useState<"preset" | "camera" | "upload">("preset");
  const [selectedPreset, setSelectedPreset] = useState(ROOM_PRESETS[0]);
  const [customRoomUrl, setCustomRoomUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [plantPos, setPlantPos] = useState({ x: 0, y: 16 });
  const [plantScale, setPlantScale] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const arDraggingRef = useRef(false);
  const arDragStartRef = useRef({ x: 0, y: 0, px: 0, py: 0 });

  const heightMatch = productName.match(/(\d{2,3})\s*cm/i);
  const heightCm = heightMatch ? Number(heightMatch[1]) : 165;

  useEffect(() => {
    if (!isOpen || images.length === 0) return;
    const primaryUrl = images[0].url;
    if (primaryUrl.startsWith("/products/") && primaryUrl.endsWith("/1.jpg")) {
      setCutoutSrc(primaryUrl.replace(/\/1\.jpg$/, "/cutout.webp"));
      return;
    }
    setCutoutSrc(primaryUrl);
  }, [isOpen, images]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen || arSource !== "camera") {
      stopCamera();
      return;
    }
    let cancelled = false;
    setCameraError(null);
    navigator.mediaDevices
      ?.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        setCameraError(
          "Kamera erişimi sağlanamadı. Hazır mekanlardan birini seçebilir veya kendi oda fotoğrafınızı yükleyebilirsiniz."
        );
        setArSource("preset");
      });

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [isOpen, arSource, stopCamera]);

  if (!isOpen) return null;

  const handleRoomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomRoomUrl(url);
    setArSource("upload");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-2 sm:p-6 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-primary/15 bg-white shadow-2xl"
        >
          {/* Üst Başlık */}
          <div className="flex items-center justify-between gap-3 border-b border-primary/10 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shrink-0">
                <Camera className="h-3.5 w-3.5" />
                Odamda Gör (AR)
              </span>
              <h2 className="truncate font-serif text-base font-semibold text-ink sm:text-lg">
                {productName}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-white text-ink transition-colors hover:bg-accent hover:text-white hover:border-accent"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ODAMDA GÖR (AR / MEKAN SİMÜLATÖRÜ) SAHNESİ */}
          <div
            onPointerMove={(e) => {
              if (!arDraggingRef.current) return;
              const dx = e.clientX - arDragStartRef.current.x;
              const dy = e.clientY - arDragStartRef.current.y;
              setPlantPos({
                x: arDragStartRef.current.px + dx,
                y: arDragStartRef.current.py + dy,
              });
            }}
            onPointerUp={() => {
              arDraggingRef.current = false;
            }}
            onPointerLeave={() => {
              arDraggingRef.current = false;
            }}
            className="relative flex flex-1 items-center justify-center overflow-hidden select-none"
            style={{
              background:
                arSource === "preset" ? selectedPreset.bg : "#1a1714",
            }}
          >
            {arSource === "camera" && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {arSource === "upload" && customRoomUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={customRoomUrl}
                alt="Oda görünümü"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {arSource === "preset" && (
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-[67.5%] h-2 bg-white/35 shadow-xs" />
                <div
                  style={{ background: selectedPreset.wallTone }}
                  className="absolute left-12 top-10 h-[52%] w-64 skew-x-[-6deg] rounded-sm blur-xl"
                />
              </div>
            )}

            <div
              onPointerDown={(e) => {
                arDraggingRef.current = true;
                arDragStartRef.current = {
                  x: e.clientX,
                  y: e.clientY,
                  px: plantPos.x,
                  py: plantPos.y,
                };
              }}
              style={{
                transform: `translate(${plantPos.x}px, ${plantPos.y}px) scale(${plantScale})`,
              }}
              className="group relative z-20 flex h-[72%] max-w-md cursor-move flex-col items-center justify-end"
            >
              <div className="mb-2 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-medium text-white opacity-90 backdrop-blur transition-opacity group-hover:opacity-100">
                <Move className="h-3 w-3 text-accent" />
                Fareyle / Parmağınızla Odanızda İstediğiniz Yere Taşıyın ({heightCm} cm)
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cutoutSrc}
                alt={productName}
                draggable={false}
                className="max-h-full w-auto object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.42)]"
              />

              <div className="-mt-3 h-6 w-32 rounded-full bg-black/40 blur-md" />
            </div>

            {cameraError && (
              <div className="absolute top-4 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-ink/85 px-4 py-2 text-xs text-white shadow-lg">
                {cameraError}
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-primary/10 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur">
              {ROOM_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setArSource("preset");
                    setSelectedPreset(preset);
                  }}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    arSource === "preset" && selectedPreset.id === preset.id
                      ? "bg-accent text-white"
                      : "bg-primary/8 text-ink hover:bg-primary/15"
                  )}
                >
                  {preset.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setArSource("camera")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  arSource === "camera"
                    ? "bg-accent text-white"
                    : "bg-primary/10 text-ink hover:bg-primary/20"
                )}
              >
                <Camera className="h-3.5 w-3.5" />
                Canlı Kamera
              </button>

              <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-primary/20">
                <Upload className="h-3.5 w-3.5" />
                Oda Fotoğrafı Yükle
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRoomUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-1 border-l border-primary/15 pl-2">
                <button
                  type="button"
                  onClick={() => setPlantScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)))}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-primary/10"
                  title="Küçült"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="text-[11px] font-semibold">Boyut</span>
                <button
                  type="button"
                  onClick={() => setPlantScale((s) => Math.min(1.6, +(s + 0.1).toFixed(2)))}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-primary/10"
                  title="Büyüt"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
