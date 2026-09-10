"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * View Transitions API — sayfalar arası yumuşak geçiş
 * Link tıklamalarında document.startViewTransition çağırır
 */
export function ViewTransitions() {
  const router = useRouter();

  useEffect(() => {
    // View Transitions API desteklenmiyorsa hiçbir şey yapma
    if (!document.startViewTransition) return;

    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) {
        return;
      }

      // Aynı sayfadaysa atla
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      document.startViewTransition(() => {
        router.push(href);
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router]);

  return null;
}
