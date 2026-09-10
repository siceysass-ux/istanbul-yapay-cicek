"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/shared/skeletons";
import type { ProductListItem } from "@/lib/types";
import type { Category } from "@prisma/client";

const PAGE_SIZE = 12;

interface ProductShowcaseProps {
  products: ProductListItem[];
  categories: Category[];
}

export function ProductShowcase({ products, categories }: ProductShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.categoryId === activeCategory);
  }, [products, activeCategory]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategoryChange = (catId: string) => {
    setLoading(true);
    setActiveCategory(catId);
    setPage(1);
    // Kısa süreli skeleton göster
    setTimeout(() => setLoading(false), 300);
  };

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setPage(newPage);
    window.scrollTo({ top: document.getElementById("urunler")?.offsetTop ?? 0 - 80, behavior: "smooth" });
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <section id="urunler" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      {/* Başlık — ortalanmış, sade */}
      <div className="mb-10 text-center">
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

      {/* Kategori filtre çipi — ortalanmış, wrap */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
            activeCategory === "all"
              ? "bg-primary text-cream"
              : "bg-primary/5 text-ink hover:bg-primary/10"
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
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-cream"
                  : "bg-primary/5 text-ink hover:bg-primary/10"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Ürün grid — skeleton veya ürünler */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ProductGridSkeleton count={PAGE_SIZE} />
          </motion.div>
        ) : (
          <motion.div
            key={`${activeCategory}-${page}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {paginated.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {paginated.map((product, i) => (
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

      {/* Sayfalama */}
      {totalPages > 1 && !loading && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 transition-colors hover:bg-primary/5 disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Önceki sayfa"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            // Çok sayfa varsa sadece yakını göster
            if (totalPages > 7 && Math.abs(pageNum - page) > 2 && pageNum !== 1 && pageNum !== totalPages) {
              // İlk ve son sayfa ile aktif sayfa arasında ... göster
              if (pageNum === 2 || pageNum === totalPages - 1) {
                return <span key={pageNum} className="px-1 text-muted">...</span>;
              }
              return null;
            }
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                  page === pageNum
                    ? "bg-primary text-cream"
                    : "border border-primary/15 hover:bg-primary/5"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 transition-colors hover:bg-primary/5 disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Sonraki sayfa"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Sayfa bilgisi */}
      {totalPages > 1 && !loading && (
        <p className="mt-4 text-center text-xs text-muted">
          Sayfa {page} / {totalPages} · {filtered.length} ürün
        </p>
      )}
    </section>
  );
}
