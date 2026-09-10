"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ProductListItem } from "@/lib/types";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  accent?: string;
  number?: string;
  products: ProductListItem[];
  viewAllHref?: string;
}

export function ProductSection({
  title,
  subtitle,
  accent,
  number,
  products,
  viewAllHref,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-10 flex items-end justify-between gap-4">
        <SectionHeading
          number={number}
          accent={accent}
          title={title}
          subtitle={subtitle}
        />
        {viewAllHref && (
          <Button variant="outline" asChild className="hidden sm:flex shrink-0 mb-10">
            <Link href={viewAllHref}>
              Tümünü Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {viewAllHref && (
        <div className="mt-10 flex justify-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href={viewAllHref}>
              Tümünü Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
