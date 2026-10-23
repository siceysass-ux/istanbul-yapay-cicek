"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowRight, FolderOpen, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  categoryName: string;
  image: string;
}

interface SearchCategory {
  name: string;
  slug: string;
  count: number;
}

const POPULAR_TERMS = [
  "Zeytin Ağacı",
  "Bonsai",
  "Sakura",
  "Starliçe",
  "Bambu",
  "Monstera",
  "Begonvil",
  "Dev Çiçek",
];

export function SearchBar({
  onNavigate,
  autoFocus = false,
  className = "",
}: {
  onNavigate?: () => void;
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const [totalMatched, setTotalMatched] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [autoFocus]);

  // Dışarı tıklanınca açılır listeyi kapat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Canlı veritabanı araması (debounce 160ms)
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((r) => r.json())
        .then((data) => {
          setProducts(data.products ?? []);
          setCategories(data.categories ?? []);
          setTotalMatched(data.totalMatched ?? data.products?.length ?? 0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 160);

    return () => clearTimeout(timer);
  }, [query, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setOpen(false);
    onNavigate?.();
    if (trimmed) {
      router.push(`/arama?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/arama");
    }
  };

  const handleSelect = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="flex h-10 sm:h-11 w-full items-stretch overflow-hidden rounded-lg border border-primary/20 bg-white shadow-2xs transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
      >
        <input
          ref={inputRef}
          type="search"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Ürün veya kategori ara"
          aria-label="Ürün veya kategori ara"
          className="min-w-0 flex-1 bg-transparent px-3.5 text-sm text-ink placeholder:text-muted/75 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Aramayı temizle"
            className="flex items-center justify-center px-2 text-muted hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="submit"
          aria-label="Ara"
          className="flex w-11 sm:w-12 shrink-0 items-center justify-center bg-accent text-white transition-colors hover:bg-[#d9560b] active:scale-98"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </form>

      {/* Canlı Arama Sonuçları Açılır Paneli */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[75vh] overflow-y-auto rounded-2xl border border-primary/15 bg-white p-3.5 shadow-2xl">
          {/* Popüler Aramalar (Sorgu boşken) */}
          {!query.trim() && (
            <div className="mb-3 border-b border-primary/10 pb-3">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Popüler Aramalar</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      setOpen(true);
                    }}
                    className="rounded-full border border-primary/12 bg-cream-dark/60 px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Eşleşen Kategoriler */}
          {categories.length > 0 && (
            <div className="mb-3 border-b border-primary/10 pb-2.5">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                Kategoriler
              </p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/kategori/${cat.slug}`}
                    onClick={handleSelect}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary/5 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-accent hover:text-white"
                  >
                    <FolderOpen className="h-3.5 w-3.5 text-accent group-hover:text-white" />
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70">({cat.count})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Eşleşen Ürünler */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                {query.trim() ? `Eşleşen Ürünler (${totalMatched})` : "Öne Çıkan Ürünler"}
              </p>
              {loading && (
                <span className="text-[11px] text-accent animate-pulse">Aranıyor...</span>
              )}
            </div>

            {products.length === 0 && !loading ? (
              <div className="py-6 text-center">
                <p className="text-sm font-medium text-ink">
                  &ldquo;{query}&rdquo; için eşleşen ürün bulunamadı.
                </p>
                <p className="mt-1 text-xs text-muted">
                  Farklı bir kelime (örn. Zeytin, Bonsai, Sakura, Bambu) deneyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/urun/${p.slug}`}
                    onClick={handleSelect}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-cream-dark"
                  >
                    <div className="h-13 w-11 shrink-0 overflow-hidden rounded-lg border border-primary/10 bg-[#f6f5f2]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-medium text-ink">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-muted">{p.categoryName}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="font-price text-xs sm:text-sm font-extrabold text-accent">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {query.trim() && totalMatched > 0 && (
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent/10 py-2.5 text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-white"
              >
                <span>Tüm Sonuçları Gör ({totalMatched} ürün)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
