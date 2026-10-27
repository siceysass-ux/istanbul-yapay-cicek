"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/shared/skeletons";
import type { ProductListItem } from "@/lib/types";
import type { Category } from "@prisma/client";

const STEP_SIZE = 12;

interface ProductShowcaseProps {
  products: ProductListItem[];
  categories: Category[];
}

export function ProductShowcase({ products, categories }: ProductShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(STEP_SIZE);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.categoryId === activeCategory);
  }, [products, activeCategory]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const remaining = Math.max(0, filtered.length - visibleProducts.length);
  const progressPct =
    filtered.length > 0 ? Math.min(100, Math.round((visibleProducts.length / filtered.length) * 100)) : 100;

  const handleCategoryChange = (catId: string) => {
    setLoading(true);
    setActiveCategory(catId);
    setVisibleCount(STEP_SIZE);
    setTimeout(() => setLoading(false), 200);
  };

  return (
    <section id="urunler" className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Başlık */}
      <div className="mb-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl font-semibold sm:text-4xl"
        >
          Tüm Ürünler
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-2 text-sm text-muted text-pretty"
        >
          Kategori seçerek ürünleri filtreleyin
        </motion.p>
      </div>

      {/* Kategori filtre çipi */}
      <div className="mb-7 sm:mb-10 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap sm:justify-center">
        <button
          type="button"
          onClick={() => handleCategoryChange("all")}
          className={`shrink-0 rounded-full px-4 py-2 sm:px-5 text-xs sm:text-sm font-medium transition-all ${
            activeCategory === "all"
              ? "bg-accent text-white shadow-sm"
              : "bg-primary/6 text-ink hover:bg-accent/10 hover:text-accent"
          }`}
        >
          Tümü ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 sm:px-5 text-xs sm:text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-accent text-white shadow-sm"
                  : "bg-primary/6 text-ink hover:bg-accent/10 hover:text-accent"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Ürün grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ProductGridSkeleton count={STEP_SIZE} />
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-muted">Bu kategoride henüz ürün yok.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daha Fazla Ürün Göster */}
      {!loading && filtered.length > STEP_SIZE && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-48 overflow-hidden rounded-full bg-primary/10 h-1.5">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted">
            Toplam <strong className="text-ink">{filtered.length}</strong> üründen{" "}
            <strong className="text-ink">{visibleProducts.length}</strong> tanesi gösteriliyor
          </p>

          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(filtered.length, prev + STEP_SIZE))}
              className="mt-1 inline-flex items-center gap-2 rounded-full border-2 border-accent bg-white px-7 py-3 text-sm font-bold text-accent shadow-xs transition-all hover:bg-accent hover:text-white active:scale-98 cursor-pointer"
            >
              <span>Daha Fazla Ürün Göster (+{Math.min(STEP_SIZE, remaining)})</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
