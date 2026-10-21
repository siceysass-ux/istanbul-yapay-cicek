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

  const titleSizes = {
    sm: "text-[15px] tracking-[0.22em]",
    md: "text-[19px] sm:text-[21px] tracking-[0.24em]",
    lg: "text-2xl sm:text-[28px] tracking-[0.26em]",
  };

  return (
    <div
      className={cn(
        "group inline-flex flex-col justify-center select-none leading-none",
        className
      )}
    >
      {/* Düz, sade, geometrik premium etiket tipografisi (Garet) */}
      <div
        style={{ fontFamily: '"Garet", var(--font-sans), sans-serif' }}
        className={cn("inline-flex items-center uppercase", titleSizes[size])}
      >
        <span
          className={cn(
            "font-extrabold transition-colors",
            isDark ? "text-cream" : "text-[#1d1a16]"
          )}
        >
          ÇİÇEK
        </span>
        <span
          className={cn(
            "mx-2 h-3.5 w-[1.5px] rounded-full transition-colors",
            size === "sm" && "mx-1.5 h-3",
            size === "lg" && "mx-2.5 h-5",
            isDark ? "bg-[#c8a662]/50" : "bg-[#b08d44]/45"
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "font-normal transition-colors",
            isDark ? "text-[#d8bc7e]" : "text-[#9a7830]"
          )}
        >
          YAPAY
        </span>
      </div>

      {showTagline && (
        <div
          style={{ fontFamily: '"Garet", var(--font-sans), sans-serif' }}
          className={cn(
            "mt-1.5 flex items-center gap-2 text-[8.5px] font-normal uppercase tracking-[0.34em]",
            isDark ? "text-cream/45" : "text-[#1d1a16]/45"
          )}
        >
          <span
            className={cn(
              "h-px flex-1 transition-all duration-300",
              isDark ? "bg-cream/15" : "bg-[#1d1a16]/12"
            )}
          />
          <span>BOTANİK &amp; DEKORASYON</span>
          <span
            className={cn(
              "h-px flex-1 transition-all duration-300",
              isDark ? "bg-cream/15" : "bg-[#1d1a16]/12"
            )}
          />
        </div>
      )}
    </div>
  );
}
