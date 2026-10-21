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
  className,
}: BrandLogoProps) {
  const isDark = variant === "dark";

  const sizeClasses = {
    sm: "h-9 w-auto",
    md: "h-12 sm:h-13 w-auto",
    lg: "h-16 sm:h-18 w-auto",
  };

  return (
    <div className={cn("inline-flex items-center select-none", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={isDark ? "/logo-dark.svg" : "/logo.svg"}
        alt="Çiçek Yapay"
        className={cn("object-contain transition-transform duration-300", sizeClasses[size])}
      />
    </div>
  );
}
