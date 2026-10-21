"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Camera,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Upload,
  X,
  Move,
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
  const [cutoutSrc, setCutoutSrc] = useState<string>("");

  // 3D & 360° Volumetric Turntable state
  const [angleDeg, setAngleDeg] = useState(0);
  const [tiltX, setTiltX] = useState(3);
  const [autoSpin, setAutoSpin] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [showRuler, setShowRuler] = useState(true);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, angle: 0, tilt: 0 });

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

  // Ürün isminden yaklaşık boyu (cm) çıkar
  const heightMatch = productName.match(/(\d{2,3})\s*cm/i);
  const heightCm = heightMatch ? Number(heightMatch[1]) : 165;

  useEffect(() => {
    if (isOpen) {
      setMode(model3dUrl && initialMode === "3d" ? "glb" : initialMode);
    }
  }, [isOpen, initialMode, model3dUrl]);

  // Tam boy ana görselden üretilmiş yüksek kaliteli AI cutout.webp modelini yükle
  // (Admin panelden yeni yüklenen harici bir URL ise istemci tarafında arka planı temizle)
  useEffect(() => {
    if (!isOpen || images.length === 0) return;
    const primaryUrl = images[0].url;
    if (primaryUrl.startsWith("/products/") && primaryUrl.endsWith("/1.jpg")) {
      const prebuiltCutout = primaryUrl.replace(/\/1\.jpg$/, "/cutout.webp");
      setCutoutSrc(prebuiltCutout);
      return;
    }
    setCutoutSrc(primaryUrl);
  }, [isOpen, images]);

  // Otomatik 360° dönüş animasyonu
  useEffect(() => {
    if (!isOpen || mode !== "3d" || !autoSpin) return;
    let raf: number;
    const animate = () => {
      setAngleDeg((prev) => (prev + 0.45) % 360);
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

  const normAngle = ((angleDeg % 360) + 360) % 360;
  const rad = (normAngle * Math.PI) / 180;

  // 360° Hacimsel (Volumetric) 3D Sentezleme:
  // Yakın çekim 2.jpg karelerine ASLA atlamaz; tam boy AI cutout modelini 360° silindirik/hacimsel
  // 4 eksenli derinlik düzlemiyle (0°, 60°, 120°, 180°) döndürerek her açıda dolgun 3D hacim verir.
  const volumePlanes = [0, 60, 120].map((planeAngle) => {
    const relRad = rad + (planeAngle * Math.PI) / 180;
    const cosVal = Math.cos(relRad);
    const sinVal = Math.sin(relRad);
    const absCos = Math.abs(cosVal);
    // Düzlemin kameraya bakan yüzü (arka yüz döndüğünde simetrik yaprak/dal dokusu tamamlanır)
    const mirror = cosVal < 0 ? -1 : 1;
    // Yan açılarda kağıt gibi incelmemesi için minimum %52 hacim genişliği korunur
    const scaleX = mirror * (0.52 + 0.48 * absCos);
    const translateZ = sinVal * 26;
    const translateX = sinVal * 14;
    // Kameraya en yakın düzlem en parlak ve tam net, arka hacim düzlemleri derinlik gölgeli
    const weight = 0.25 + 0.75 * Math.pow(absCos, 1.3);
    const brightness = 0.88 + 0.14 * absCos;
    return {
      planeAngle,
      zOrder: Math.round(absCos * 100),
      scaleX,
      translateZ,
      translateX,
      opacity: planeAngle === 0 ? Math.max(0.85, weight) : weight * 0.72,
      brightness,
    };
  }).sort((a, b) => a.zOrder - b.zOrder);

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
    setTiltX(Math.max(-10, Math.min(10, dragStartRef.current.tilt - dy * 0.08)));
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
          className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-cream/15 bg-cream shadow-2xl"
        >
          {/* Üst Başlık & Mod Seçici — Tek Satır Düzen */}
          <div className="flex items-center justify-between gap-3 border-b border-primary/10 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-serif text-base font-semibold text-ink sm:text-lg">
                {productName}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 rounded-full border border-primary/15 bg-cream/80 p-1">
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
                    GLB 3D
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-white text-ink transition-colors hover:bg-primary hover:text-cream"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ANA SAHNE */}
          <div className="relative flex-1 overflow-hidden">
            {mode === "3d" && (
              <div
                onPointerDown={handlePointerDown3D}
                onPointerMove={handlePointerMove3D}
                onPointerUp={handlePointerUp3D}
                onPointerLeave={handlePointerUp3D}
                style={{
                  background:
                    "radial-gradient(circle at 50% 42%, #ffffff 0%, #f5f2eb 58%, #e6dfd2 100%)",
                }}
                className="relative flex h-full w-full cursor-grab items-center justify-center overflow-hidden select-none active:cursor-grabbing"
              >
                {/* Stüdyo Zemin Ufuk Çizgisi */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[#ddd4c3]/60 to-transparent" />

                {/* 3D Sahne Konteyneri */}
                <div
                  style={{
                    perspective: "1400px",
                    transform: `scale(${zoom})`,
                  }}
                  className="relative flex h-[80%] w-full max-w-xl flex-col items-center justify-end pb-8 transition-transform duration-150"
                >
                  {/* Yükseklik Cetveli (Gerçek Boyut Ölçeği) */}
                  {showRuler && (
                    <div className="pointer-events-none absolute left-4 top-4 bottom-10 flex flex-col items-center justify-between border-l border-dashed border-primary/35 px-2 text-[10px] font-semibold text-primary/75 sm:left-8">
                      <span>▲ {heightCm} cm</span>
                      <span className="-rotate-90 whitespace-nowrap rounded bg-accent/25 px-2 py-0.5 text-[9px] font-bold tracking-wider text-ink">
                        GERÇEK BOY ÖLÇEĞİ
                      </span>
                      <span>▼ 0 cm</span>
                    </div>
                  )}

                  {/* 360° Hacimsel (Volumetric) 3D Tam Boy Model:
                      Üst kısım (yaprak/çiçek tacı) çok eksenli 3D hacimle dönerken,
                      alt kısım (saksı) silindirik formunu ve sabit merkezini korur */}
                  <div
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `rotateX(${tiltX}deg)`,
                    }}
                    className="relative z-10 flex h-full w-full items-end justify-center"
                  >
                    {/* 1. Üst Taç / Dal Hacim Katmanları (360° kesintisiz 3D dolgunluk) */}
                    {volumePlanes.map((vp) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={vp.planeAngle}
                        src={cutoutSrc}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        style={{
                          transform: `translateX(${vp.translateX}px) translateZ(${vp.translateZ}px) scaleX(${vp.scaleX})`,
                          opacity: vp.opacity,
                          filter: `brightness(${vp.brightness})`,
                          clipPath: "inset(0% 0% 22% 0%)",
                        }}
                        className="pointer-events-none absolute bottom-0 max-h-full w-auto object-contain"
                      />
                    ))}

                    {/* 2. Silindirik Saksı & Taban Katmanı (Merkezde sabit, silindirik 3D gölgeli) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cutoutSrc}
                      alt={productName}
                      draggable={false}
                      style={{
                        transform: `scaleX(${Math.cos(rad) >= 0 ? 1 : -1})`,
                        clipPath: "inset(76% 0% 0% 0%)",
                      }}
                      className="pointer-events-none relative z-30 max-h-full w-auto object-contain drop-shadow-[0_14px_22px_rgba(32,28,20,0.22)]"
                    />
                  </div>

                  {/* Saksı Tabanının Tam Altında Duran 3D Döner Tabla (Turntable Pedestal) */}
                  <div className="pointer-events-none relative -mt-5 z-0 flex items-center justify-center">
                    <div
                      style={{
                        transform: `rotateX(76deg) rotateZ(${normAngle}deg)`,
                      }}
                      className="h-36 w-36 rounded-full border-2 border-[#b89244]/55 bg-gradient-to-br from-white via-[#f0eadf] to-[#d8cbb8] shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:h-44 sm:w-44"
                    >
                      <div className="absolute inset-2.5 rounded-full border border-dashed border-[#9e7a32]/45" />
                    </div>
                    <div className="absolute h-5 w-28 rounded-full bg-black/25 blur-md" />
                  </div>
                </div>

                {/* Sol Üst: 360° Açı Rozeti */}
                <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-ink/80 px-3.5 py-1.5 text-xs font-medium text-cream backdrop-blur">
                    <RotateCw className={cn("h-3.5 w-3.5 text-accent", autoSpin && "animate-spin")} />
                    <span>360° 3D Model · Açı: {Math.round(normAngle)}°</span>
                  </div>
                </div>

                {/* Sağ Üst: Boy Ölçeği Butonu */}
                <div className="absolute right-4 top-4">
                  <button
                    type="button"
                    onClick={() => setShowRuler((r) => !r)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-md backdrop-blur transition-colors",
                      showRuler ? "bg-primary text-cream" : "bg-white/90 text-ink"
                    )}
                  >
                    <Ruler className="h-3.5 w-3.5" />
                    Boy Ölçeği ({heightCm} cm)
                  </button>
                </div>

                {/* Alt 360° Kontrol Barı */}
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-primary/10 bg-white/95 px-4 py-2 shadow-xl backdrop-blur">
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

                  {/* Hızlı Açı Butonları (0°, 90°, 180°, 270°) */}
                  <div className="flex items-center gap-1 border-x border-primary/10 px-2.5">
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => {
                          setAutoSpin(false);
                          setAngleDeg(deg);
                        }}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                          Math.abs(normAngle - deg) < 22
                            ? "bg-accent text-ink"
                            : "bg-primary/5 text-ink/70 hover:bg-primary/15"
                        )}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>

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
                      onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}
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
                  <div className="mb-2 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-medium text-cream opacity-90 backdrop-blur transition-opacity group-hover:opacity-100">
                    <Move className="h-3 w-3 text-accent" />
                    Fareyle / Parmağınızla Odanızda İstediğiniz Yere Taşıyın ({heightCm} cm)
                  </div>

                  {/* %100 Opak Saksılı ve Temiz Kesimli AI Cutout Modeli */}
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
                  <div className="absolute top-4 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-ink/85 px-4 py-2 text-xs text-cream shadow-lg">
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

            {/* MOD 3: GLB 3D MESH */}
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
