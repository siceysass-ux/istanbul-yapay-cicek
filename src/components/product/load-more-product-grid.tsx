"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { ProductListItem } from "@/lib/types";

export function LoadMoreProductGrid({
  products,
  step = 12,
}: {
  products: ProductListItem[];
  step?: number;
}) {
  const [visibleCount, setVisibleCount] = useState(step);

  useEffect(() => {
    setVisibleCount(step);
  }, [products, step]);

  const visibleProducts = products.slice(0, visibleCount);
  const remaining = Math.max(0, products.length - visibleProducts.length);
  const progressPct =
    products.length > 0 ? Math.min(100, Math.round((visibleProducts.length / products.length) * 100)) : 100;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {visibleProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} imagePriority={i < 8} />
        ))}
      </div>

      {products.length > step && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-48 overflow-hidden rounded-full bg-primary/10 h-1.5">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted">
            Toplam <strong className="text-ink">{products.length}</strong> üründen{" "}
            <strong className="text-ink">{visibleProducts.length}</strong> tanesi gösteriliyor
          </p>

          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(products.length, prev + step))}
              className="mt-1 inline-flex items-center gap-2 rounded-full border-2 border-accent bg-white px-7 py-3 text-sm font-bold text-accent shadow-xs transition-all hover:bg-accent hover:text-white active:scale-98 cursor-pointer"
            >
              <span>Daha Fazla Ürün Göster (+{Math.min(step, remaining)})</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
