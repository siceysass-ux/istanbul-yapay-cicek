import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({
  variant = "light",
  size = "md",
  showTagline = true,
  className,
}: BrandLogoProps) {
  const isDark = variant === "dark";

  const iconSizes = {
    sm: "h-9 w-9",
    md: "h-11 w-11 sm:h-12 sm:w-12",
    lg: "h-14 w-14",
  };

  const titleSizes = {
    sm: "text-base tracking-[0.12em]",
    md: "text-xl sm:text-[22px] tracking-[0.14em]",
    lg: "text-2xl sm:text-3xl tracking-[0.15em]",
  };

  return (
    <div
      className={cn(
        "group inline-flex items-center gap-3 select-none",
        className
      )}
    >
      {/* Botanik Altın Madalyon Amblem (Saf Vektör SVG) */}
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full transition-transform duration-500 ease-out group-hover:scale-105",
          iconSizes[size],
          isDark
            ? "bg-gradient-to-br from-[#2d2720] to-[#1a1712] shadow-md shadow-black/30 ring-1 ring-[#c0a060]/40"
            : "bg-gradient-to-br from-[#26211b] to-[#171410] shadow-md shadow-[#2a2520]/15 ring-1 ring-[#c0a060]/50"
        )}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full p-1.5"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cyGoldGrad" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f0dca8" />
              <stop offset="45%" stopColor="#c8a662" />
              <stop offset="100%" stopColor="#9c7a38" />
            </linearGradient>
            <linearGradient id="cyPetalGrad" x1="20" y1="12" x2="44" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f9f1de" />
              <stop offset="65%" stopColor="#dfc488" />
              <stop offset="100%" stopColor="#b59048" />
            </linearGradient>
          </defs>

          {/* İnce dış altın halka */}
          <circle
            cx="32"
            cy="32"
            r="28.5"
            stroke="url(#cyGoldGrad)"
            strokeWidth="1"
            strokeOpacity="0.55"
          />
          {/* Noktalı iç botanik çerçeve */}
          <circle
            cx="32"
            cy="32"
            r="25"
            stroke="url(#cyGoldGrad)"
            strokeWidth="0.75"
            strokeDasharray="2 3"
            strokeOpacity="0.4"
          />

          {/* Sol & sağ zarif zeytin/defne yaprak dalı */}
          <path
            d="M17 44C13.5 38.5 13.5 29.5 17.5 23.5"
            stroke="url(#cyGoldGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M47 44C50.5 38.5 50.5 29.5 46.5 23.5"
            stroke="url(#cyGoldGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Merkezde stilize manolya / lotus çiçeği */}
          {/* Arka sol ve sağ taç yapraklar */}
          <path
            d="M32 38C23 37 18 29.5 20.5 21.5C25.5 23.5 29.5 28.5 32 38Z"
            fill="url(#cyGoldGrad)"
            fillOpacity="0.35"
            stroke="url(#cyGoldGrad)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M32 38C41 37 46 29.5 43.5 21.5C38.5 23.5 34.5 28.5 32 38Z"
            fill="url(#cyGoldGrad)"
            fillOpacity="0.35"
            stroke="url(#cyGoldGrad)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Orta ana taç yaprak */}
          <path
            d="M32 39C26.5 32.5 26.2 21.5 32 14C37.8 21.5 37.5 32.5 32 39Z"
            fill="url(#cyPetalGrad)"
            fillOpacity="0.9"
            stroke="url(#cyGoldGrad)"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />

          {/* Çiçek içi ince damar */}
          <path
            d="M32 20V37"
            stroke="#26211b"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* Alt kavisli yaprak kaidesi ve sap */}
          <path
            d="M21 41.5C25.5 44.5 38.5 44.5 43 41.5"
            stroke="url(#cyGoldGrad)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M25 46.5C29 48.2 35 48.2 39 46.5"
            stroke="url(#cyGoldGrad)"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="32" cy="10.5" r="1.3" fill="url(#cyGoldGrad)" />
        </svg>
      </div>

      {/* Tipografik Marka İsmi */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "font-serif font-bold uppercase transition-colors",
              titleSizes[size],
              isDark ? "text-cream" : "text-ink"
            )}
          >
            Çiçek
          </span>
          <span
            className={cn(
              "font-serif font-light italic tracking-[0.06em]",
              size === "sm" ? "text-base" : size === "lg" ? "text-2xl sm:text-3xl" : "text-xl sm:text-[22px]",
              isDark
                ? "bg-gradient-to-r from-[#e8d29c] via-[#c8a662] to-[#e0c896] bg-clip-text text-transparent"
                : "bg-gradient-to-r from-[#9e7a32] via-[#b89244] to-[#8a6824] bg-clip-text text-transparent font-medium"
            )}
          >
            Yapay
          </span>
        </div>

        {showTagline && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className={cn(
                "h-px w-4 transition-all duration-300 group-hover:w-6",
                isDark ? "bg-accent/60" : "bg-accent"
              )}
            />
            <span
              className={cn(
                "text-[9px] font-semibold uppercase tracking-[0.28em]",
                isDark ? "text-cream/60" : "text-ink/55"
              )}
            >
              Botanik &amp; Dekorasyon
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
