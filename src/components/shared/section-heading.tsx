"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  accent?: string;
  number?: string;
  align?: "left" | "center";
  viewAllHref?: string;
  viewAllLabel?: string;
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  subtitle,
  accent,
  number,
  align = "left",
  viewAllHref,
  viewAllLabel = "Tümünü gör",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={`mb-10 ${isCenter ? "text-center" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`flex items-center gap-3 ${isCenter ? "justify-center" : ""}`}
      >
        {number && (
          <span className="font-serif text-sm font-bold text-accent/60">{number}</span>
        )}
        {accent && (
          <>
            <span className="font-script text-xl text-accent">{accent}</span>
            <span className="h-px w-8 bg-accent/40" />
          </>
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-serif text-2xl font-semibold sm:text-3xl mt-2"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-2 text-sm text-muted text-pretty"
        >
          {subtitle}
        </motion.p>
      )}

      {viewAllHref && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`mt-4 ${isCenter ? "" : "hidden"}`}
        >
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
          >
            {viewAllLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
