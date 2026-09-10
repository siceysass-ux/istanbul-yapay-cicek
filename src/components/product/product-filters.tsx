"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@prisma/client";
import type { ProductWithRelations } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";

interface ProductFiltersProps {
  category: Category & { children: Category[] };
  products?: ProductWithRelations[];
}

type SortOption = "default" | "price-asc" | "price-desc" | "newest" | "rating";

export function ProductFilters({ category }: ProductFiltersProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showOnlyStock, setShowOnlyStock] = useState(false);
  const [showOnlyDiscount, setShowOnlyDiscount] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "default", label: "Varsayılan" },
    { value: "price-asc", label: "Fiyat: Artan" },
    { value: "price-desc", label: "Fiyat: Azalan" },
    { value: "newest", label: "En Yeniler" },
    { value: "rating", label: "Puana Göre" },
  ];

  return (
    <>
      {/* Mobil filtre buton */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrele & Sırala
        </Button>
      </div>

      {/* Filtre paneli */}
      <aside
        className={cn(
          "space-y-6",
          mobileOpen ? "block" : "hidden lg:block"
        )}
      >
        <div className="rounded-2xl border border-primary/10 bg-white/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Filtreler</h3>
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sıralama */}
          <div className="mb-6">
            <h4 className="mb-2 text-sm font-medium">Sıralama</h4>
            <div className="space-y-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    sortBy === opt.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5"
                  )}
                >
                  {opt.label}
                  {sortBy === opt.value && <ChevronDown className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Fiyat aralığı */}
          <div className="mb-6">
            <h4 className="mb-2 text-sm font-medium">Fiyat Aralığı</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full rounded-lg border border-primary/15 px-3 py-2 text-sm"
                placeholder="Min"
              />
              <span className="text-muted">—</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full rounded-lg border border-primary/15 px-3 py-2 text-sm"
                placeholder="Max"
              />
            </div>
            <div className="mt-2 text-xs text-muted">
              {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
            </div>
          </div>

          {/* Diğer filtreler */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Diğer</h4>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyStock}
                onChange={(e) => setShowOnlyStock(e.target.checked)}
                className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
              />
              Stoktakiler
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyDiscount}
                onChange={(e) => setShowOnlyDiscount(e.target.checked)}
                className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
              />
              İndirimli Ürünler
            </label>
          </div>

          {/* Alt kategoriler (eğer var) */}
          {category.children.length > 0 && (
            <div className="mt-6 border-t border-primary/10 pt-4">
              <h4 className="mb-2 text-sm font-medium">Alt Kategoriler</h4>
              <div className="flex flex-wrap gap-2">
                {category.children.map((child) => (
                  <a
                    key={child.id}
                    href={`/kategori/${child.slug}`}
                    className="rounded-full bg-primary/5 px-3 py-1 text-xs hover:bg-primary/10"
                  >
                    {child.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
