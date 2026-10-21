"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Camera,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sun,
  Sunset,
  Moon,
  Upload,
  X,
  Move,
  Sparkles,
  Maximize2,
  Ruler,
  Layers,
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
  model3dUrl?: string | null;
  initialMode?: "3d" | "ar";
}

type StudioLight = "daylight" | "warm" | " dramatic";

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
  model3dUrl,
  initialMode = "3d",
}: Product3DViewerProps) {
  const [mode, setMode] = useState<"3d" | "ar" | "glb">(
    model3dUrl ? "glb" : initialMode
  );
  const [cutoutUrls, setCutoutUrls] = useState<Record<string, string>>({});
  const [processingCutout, setProcessingCutout] = useState(false);

  // 3D & 360° Turntable state
  const [angleDeg, setAngleDeg] = useState(0);
  const [tiltX, setTiltX] = useState(4);
  const [autoSpin, setAutoSpin] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [showRuler, setShowRuler] = useState(true);
  const [lightMode, setLightMode] = useState<StudioLight>("daylight");
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, angle: 0, tilt: 0 });

  // AR / Room placement state
  const [arSource, setArSource] = useState<"preset" | "camera" | "upload">("preset");
  const [selectedPreset, setSelectedPreset] = useState(ROOM_PRESETS[0]);
  const [customRoomUrl, setCustomRoomUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [plantPos, setPlantPos] = useState({ x: 0, y: 20 });
  const [plantScale, setPlantScale] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const arDraggingRef = useRef(false);
  const arDragStartRef = useRef({ x: 0, y: 0, px: 0, py: 0 });

  // Ürün isminden yaklaşık boyu (cm) çıkar (ör. "180 cm")
  const heightMatch = productName.match(/(\d{2,3})\s*cm/i);
  const heightCm = heightMatch ? Number(heightMatch[1]) : 165;

  useEffect(() => {
    if (isOpen) {
      setMode(model3dUrl && initialMode === "3d" ? "glb" : initialMode);
    }
  }, [isOpen, initialMode, model3dUrl]);

  // Görselin beyaz stüdyo arka planını gerçek zamanlı şeffaflaştır (Cutout Alpha Matting)
  const ensureCutout = useCallback(
    async (imgUrl: string) => {
      if (cutoutUrls[imgUrl]) return;
      setProcessingCutout(true);
      try {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = imgUrl;
        });

        const canvas = document.createElement("canvas");
        const w = img.naturalWidth || 800;
        const h = img.naturalHeight || 1200;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;

        // Köşe piksellerden stüdyo beyaz arka plan referansını al
        const bgR = 248,
          bgG = 247,
          bgB = 244;

        for (let i = 0; i < d.length; i += 4) {
          const pxIdx = i / 4;
          const x = pxIdx % w;
          const y = Math.floor(pxIdx / w);

          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];

          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const sat = maxC - minC;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          // Beyaz saksı bölgesini (merkez-alt) koru
          const inPotCore =
            y > h * 0.67 &&
            y < h * 0.96 &&
            x > w * 0.31 &&
            x < w * 0.69;

          const diffBg = Math.hypot(r - bgR, g - bgG, b - bgB);
          const isGreen = g > r + 6 && g > b + 4;
          const isFlower = r > g + 15 && sat > 18;

          if (!isGreen && !isFlower) {
            if (!inPotCore && lum > 224 && sat < 20 && diffBg < 36) {
              // Yumuşak kenar geçişi (anti-aliased alpha)
              const fade = Math.max(0, Math.min(1, (36 - diffBg) / 18));
              d[i + 3] = Math.round(255 * (1 - fade));
            } else if (inPotCore && lum > 236 && sat < 10 && diffBg < 16) {
              // Beyaz saksı dışındaki tam stüdyo fonu
              const distFromCenter = Math.abs(x - w * 0.5) / (w * 0.2);
              if (distFromCenter > 0.72) {
                const fade = Math.max(0, Math.min(1, (16 - diffBg) / 10));
                d[i + 3] = Math.round(255 * (1 - fade));
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        setCutoutUrls((prev) => ({ ...prev, [imgUrl]: dataUrl }));
      } catch {
        setCutoutUrls((prev) => ({ ...prev, [imgUrl]: imgUrl }));
      } finally {
        setProcessingCutout(false);
      }
    },
    [cutoutUrls]
  );

  useEffect(() => {
    if (!isOpen || images.length === 0) return;
    images.forEach((im) => {
      ensureCutout(im.url);
    });
  }, [isOpen, images, ensureCutout]);

  // Otomatik 360° salınım / dönüş animasyonu
  useEffect(() => {
    if (!isOpen || mode !== "3d" || !autoSpin) return;
    let raf: number;
    let t = 0;
    const animate = () => {
      t += 0.018;
      setAngleDeg((prev) => (prev + 0.45) % 360);
      setTiltX(Math.sin(t) * 5);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isOpen, mode, autoSpin]);

  // Kamera temizliği
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen || mode !== "ar" || arSource !== "camera") {
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
  }, [isOpen, mode, arSource, stopCamera]);

  if (!isOpen) return null;

  // 360° açıya göre aktif fotoğraf karesi ve 3D perspektif hesaplaması
  const count = Math.max(1, images.length);
  const normAngle = ((angleDeg % 360) + 360) % 360;
  const activeIdx = Math.floor((normAngle / 360) * count) % count;
  const activeImgUrl = images[activeIdx]?.url ?? "";
  const activeCutout = cutoutUrls[activeImgUrl] ?? activeImgUrl;

  // Her açı dilimi içinde gerçekçi 3D Y-ekseni perspektif dönüşü (-22° .. +22°)
  const sliceSpan = 360 / count;
  const sliceProgress = ((normAngle % sliceSpan) / sliceSpan) - 0.5; // -0.5 .. +0.5
  const rotateY3D = sliceProgress * 36; // -18deg .. +18deg
  const parallaxOffset = sliceProgress * 18;

  const handlePointerDown3D = (e: React.PointerEvent) => {
    setAutoSpin(false);
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      angle: angleDeg,
      tilt: tiltX,
    };
  };

  const handlePointerMove3D = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setAngleDeg(dragStartRef.current.angle + dx * 0.65);
    setTiltX(Math.max(-18, Math.min(18, dragStartRef.current.tilt - dy * 0.12)));
  };

  const handlePointerUp3D = () => {
    isDraggingRef.current = false;
  };

  const handleRoomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomRoomUrl(url);
    setArSource("upload");
  };

  const lightStyles: Record<StudioLight, { bg: string; glow: string; filter: string }> = {
    daylight: {
      bg: "radial-gradient(circle at 50% 35%, #fcfbf8 0%, #eeebe4 65%, #dfd9ce 100%)",
      glow: "rgba(255,255,255,0.65)",
      filter: "contrast(1.03) brightness(1.02)",
    },
    warm: {
      bg: "radial-gradient(circle at 50% 30%, #fbf3e4 0%, #eadbc3 65%, #d4be9e 100%)",
      glow: "rgba(255,215,150,0.45)",
      filter: "sepia(0.08) contrast(1.04) brightness(1.01)",
    },
    " dramatic": {
      bg: "radial-gradient(circle at 50% 35%, #342e27 0%, #1c1915 70%, #12100d 100%)",
      glow: "rgba(200,166,98,0.28)",
      filter: "contrast(1.08) drop-shadow(0 20px 35px rgba(0,0,0,0.6))",
    },
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
          className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-cream/15 bg-cream shadow-2xl"
        >
          {/* Üst Kontrol Çubuğu */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 bg-white/80 px-4 py-3.5 backdrop-blur sm:px-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="h-3 w-3 text-accent" />
                  3D ve AR Stüdyo
                </span>
                <span className="text-xs text-muted">Gerçek Fotoğraf Dokulu Model</span>
              </div>
              <h2 className="mt-0.5 truncate font-serif text-base font-semibold text-ink sm:text-lg">
                {productName}
              </h2>
            </div>

            {/* Mod Seçici Sekmeler */}
            <div className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-cream/80 p-1">
              <button
                type="button"
                onClick={() => setMode("3d")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                  mode === "3d"
                    ? "bg-primary text-cream shadow-xs"
                    : "text-ink/75 hover:text-primary"
                )}
              >
                <Box className="h-3.5 w-3.5" />
                3D / 360° Sahne
              </button>
              <button
                type="button"
                onClick={() => setMode("ar")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                  mode === "ar"
                    ? "bg-primary text-cream shadow-xs"
                    : "text-ink/75 hover:text-primary"
                )}
              >
                <Camera className="h-3.5 w-3.5" />
                Odamda Gör (AR)
              </button>
              {model3dUrl && (
                <button
                  type="button"
                  onClick={() => setMode("glb")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                    mode === "glb"
                      ? "bg-primary text-cream shadow-xs"
                      : "text-ink/75 hover:text-primary"
                  )}
                >
                  <Layers className="h-3.5 w-3.5" />
                  GLB 3D Mesh
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-white text-ink transition-colors hover:bg-primary hover:text-cream"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ANA SAHNE */}
          <div className="relative flex-1 overflow-hidden">
            {mode === "3d" && (
              <div
                onPointerDown={handlePointerDown3D}
                onPointerMove={handlePointerMove3D}
                onPointerUp={handlePointerUp3D}
                onPointerLeave={handlePointerUp3D}
                style={{ background: lightStyles[lightMode].bg }}
                className="relative flex h-full w-full cursor-grab items-center justify-center overflow-hidden select-none active:cursor-grabbing"
              >
                {/* Dinamik Stüdyo Işık Hüzmesi */}
                <div
                  style={{
                    background: `radial-gradient(circle, ${lightStyles[lightMode].glow} 0%, transparent 70%)`,
                    transform: `translate(${-parallaxOffset * 2.2}px, -40px)`,
                  }}
                  className="pointer-events-none absolute h-[520px] w-[520px] rounded-full blur-2xl transition-transform duration-75"
                />

                {/* 3D Perspektif Sahnesi */}
                <div
                  style={{
                    perspective: "1200px",
                    transform: `scale(${zoom})`,
                  }}
                  className="relative flex h-[78%] w-full max-w-lg items-center justify-center transition-transform duration-150"
                >
                  {/* 3D Döner Tabla (Turntable Platform) */}
                  <div
                    style={{
                      transform: `rotateX(${74 - tiltX * 0.35}deg) rotateZ(${normAngle}deg)`,
                    }}
                    className="pointer-events-none absolute bottom-4 h-56 w-56 rounded-full border-2 border-[#c8a662]/45 bg-gradient-to-br from-white/70 via-[#e9e2d4]/60 to-[#c8a662]/25 shadow-2xl sm:h-64 sm:w-64"
                  >
                    <div className="absolute inset-3 rounded-full border border-dashed border-[#9e7a32]/40" />
                    <div className="absolute inset-10 rounded-full border border-[#9e7a32]/20" />
                  </div>

                  {/* Gerçek Zamanlı Zemin Gölgesi */}
                  <div
                    style={{
                      transform: `translateX(${parallaxOffset * 0.6}px) scaleX(${1 + Math.abs(sliceProgress) * 0.18})`,
                    }}
                    className="pointer-events-none absolute bottom-8 h-9 w-40 rounded-full bg-black/22 blur-md"
                  />

                  {/* Yükseklik Cetveli (Gerçek Boyut Ölçeği) */}
                  {showRuler && (
                    <div
                      className={cn(
                        "pointer-events-none absolute left-4 top-6 bottom-12 flex flex-col items-center justify-between border-l border-dashed px-2 text-[10px] font-semibold sm:left-8",
                        lightMode === " dramatic"
                          ? "border-cream/35 text-cream/75"
                          : "border-primary/35 text-primary/75"
                      )}
                    >
                      <span>▲ {heightCm} cm</span>
                      <span className="-rotate-90 whitespace-nowrap rounded bg-accent/20 px-2 py-0.5 text-[9px] font-bold tracking-wider">
                        GERÇEK BOY ÖLÇEĞİ
                      </span>
                      <span>▼ 0 cm (Taban)</span>
                    </div>
                  )}

                  {/* Çok Katmanlı 3D Derinlik & Paralaks Ürün Modeli */}
                  <div
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `rotateX(${tiltX}deg) rotateY(${rotateY3D}deg)`,
                    }}
                    className="relative flex h-full w-full items-center justify-center"
                  >
                    {/* Arka Derinlik Katmanı (Hacim & Gövde Derinliği) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeCutout}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      style={{
                        transform: `translateZ(-18px) translateX(${-parallaxOffset * 0.55}px) scale(0.985)`,
                        filter: "brightness(0.82) blur(1px)",
                      }}
                      className="pointer-events-none absolute max-h-full max-w-full object-contain opacity-45"
                    />

                    {/* Ana Yüksek Çözünürlüklü Katman (%100 Orijinal Kamera Netliği) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeCutout}
                      alt={productName}
                      draggable={false}
                      style={{
                        transform: "translateZ(8px)",
                        filter: lightStyles[lightMode].filter,
                      }}
                      className="pointer-events-none relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]"
                    />

                    {/* Ön Yaprak / Çiçek Rölyef Paralaks Katmanı */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeCutout}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      style={{
                        transform: `translateZ(26px) translateX(${parallaxOffset * 0.45}px) scale(1.012)`,
                        clipPath: "inset(0% 8% 32% 8%)",
                      }}
                      className="pointer-events-none absolute z-20 max-h-full max-w-full object-contain opacity-90"
                    />
                  </div>
                </div>

                {/* Sol Üst: Açı & Bilgi Rozeti */}
                <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-ink/75 px-3.5 py-1.5 text-xs font-medium text-cream backdrop-blur">
                    <RotateCw className={cn("h-3.5 w-3.5 text-accent", autoSpin && "animate-spin")} />
                    <span>
                      Açı: {Math.round(normAngle)}° · Kare {activeIdx + 1}/{count}
                    </span>
                  </div>
                  {processingCutout && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/90 px-3 py-1 text-[11px] font-semibold text-ink">
                      3D Katmanlar Hazırlanıyor...
                    </div>
                  )}
                </div>

                {/* Sağ Üst: Stüdyo Işık & Ölçek Kontrolleri */}
                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-white/85 p-1 shadow-md backdrop-blur">
                    <button
                      type="button"
                      onClick={() => setLightMode("daylight")}
                      title="Gün Işığı Stüdyo"
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                        lightMode === "daylight" ? "bg-primary text-cream" : "text-ink/70 hover:bg-primary/10"
                      )}
                    >
                      <Sun className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightMode("warm")}
                      title="Sıcak Salon Işığı"
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                        lightMode === "warm" ? "bg-primary text-cream" : "text-ink/70 hover:bg-primary/10"
                      )}
                    >
                      <Sunset className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightMode(" dramatic")}
                      title="Gece / Kontrast Spot"
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                        lightMode === " dramatic" ? "bg-primary text-cream" : "text-ink/70 hover:bg-primary/10"
                      )}
                    >
                      <Moon className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowRuler((r) => !r)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur transition-colors",
                      showRuler ? "bg-primary text-cream" : "bg-white/85 text-ink"
                    )}
                  >
                    <Ruler className="h-3.5 w-3.5" />
                    Boy Ölçeği
                  </button>
                </div>

                {/* Alt 360° Kontrol Barı */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-primary/10 bg-white/90 px-4 py-2.5 shadow-xl backdrop-blur">
                  <button
                    type="button"
                    onClick={() => setAutoSpin((s) => !s)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      autoSpin ? "bg-primary text-cream" : "bg-primary/10 text-primary"
                    )}
                  >
                    <RotateCw className={cn("h-3.5 w-3.5", autoSpin && "animate-spin")} />
                    {autoSpin ? "360° Dönüyor" : "360° Döndür"}
                  </button>

                  {/* Açı Seçici Küçük Kareler */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-1.5 border-x border-primary/10 px-2.5">
                      {images.map((im, idx) => (
                        <button
                          key={im.id}
                          type="button"
                          onClick={() => {
                            setAutoSpin(false);
                            setAngleDeg((idx / images.length) * 360 + 10);
                          }}
                          className={cn(
                            "h-8 w-8 overflow-hidden rounded-lg border-2 transition-all",
                            activeIdx === idx
                              ? "border-primary scale-105"
                              : "border-transparent opacity-60 hover:opacity-100"
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={im.url} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.15).toFixed(2)))}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary/10"
                      aria-label="Uzaklaştır"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-xs font-semibold">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(2.0, +(z + 0.15).toFixed(2)))}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary/10"
                      aria-label="Yakınlaştır"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MOD 2: ODAMDA GÖR (AR / MEKAN SİMÜLATÖRÜ) */}
            {mode === "ar" && (
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
                className="relative flex h-full w-full items-center justify-center overflow-hidden select-none"
                style={{
                  background:
                    arSource === "preset" ? selectedPreset.bg : "#1a1714",
                }}
              >
                {/* Kamera Akışı */}
                {arSource === "camera" && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                {/* Yüklenen Oda Fotoğrafı */}
                {arSource === "upload" && customRoomUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={customRoomUrl}
                    alt="Oda görünümü"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                {/* Hazır Mekan Mimari Detay Çizgileri */}
                {arSource === "preset" && (
                  <div className="pointer-events-none absolute inset-0">
                    {/* Süpürgelik çizgisi */}
                    <div className="absolute inset-x-0 top-[67.5%] h-2 bg-white/35 shadow-xs" />
                    {/* Pencere ışığı efekti */}
                    <div
                      style={{ background: selectedPreset.wallTone }}
                      className="absolute left-12 top-10 h-[52%] w-64 skew-x-[-6deg] rounded-sm blur-xl"
                    />
                  </div>
                )}

                {/* Sürüklenebilir & Ölçeklenebilir Gerçekçi Ağaç/Çiçek Modeli */}
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
                  className="group relative z-20 flex h-[68%] max-w-md cursor-move flex-col items-center justify-end"
                >
                  {/* Sürükleme İpucu */}
                  <div className="mb-2 flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1 text-[11px] font-medium text-cream opacity-85 backdrop-blur transition-opacity group-hover:opacity-100">
                    <Move className="h-3 w-3 text-accent" />
                    Parmağınızla / Fareyle Odanızda İstediğiniz Yere Taşıyın ({heightCm} cm)
                  </div>

                  {/* Şeffaf Arka Planlı Ürün Görseli */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeCutout}
                    alt={productName}
                    draggable={false}
                    className="max-h-full w-auto object-contain drop-shadow-[0_22px_28px_rgba(0,0,0,0.42)]"
                  />

                  {/* Zemin Gölgesi */}
                  <div className="-mt-4 h-7 w-36 rounded-full bg-black/35 blur-md" />
                </div>

                {cameraError && (
                  <div className="absolute top-4 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-ink/85 px-4 py-2 text-xs text-cream shadow-lg">
                    {cameraError}
                  </div>
                )}

                {/* Alt AR Kontrol Çubuğu */}
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
                          ? "bg-primary text-cream"
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
                        ? "bg-accent text-ink"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Canlı Kamera
                  </button>

                  <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20">
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
            )}

            {/* MOD 3: GLB 3D MESH (Admin'den .glb yüklendiğinde) */}
            {mode === "glb" && model3dUrl && (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#f8f7f4] to-[#e9e4da] p-4">
                <iframe
                  title={`${productName} 3D Model`}
                  srcDoc={`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
  <style>
    html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; }
    model-viewer { width: 100%; height: 100%; --poster-color: transparent; }
  </style>
</head>
<body>
  <model-viewer
    src="${model3dUrl}"
    alt="${productName.replace(/"/g, "&quot;")}"
    ar
    ar-modes="webxr scene-viewer quick-look"
    camera-controls
    auto-rotate
    shadow-intensity="1.1"
    exposure="1.05"
  ></model-viewer>
</body>
</html>`}
                  className="h-full w-full border-0"
                  allow="xr-spatial-tracking; fullscreen"
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
