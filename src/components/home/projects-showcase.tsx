"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@prisma/client";

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      {/* Başlık — ortalanmış, sade */}
      <div className="mb-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl font-semibold sm:text-4xl"
        >
          Projeler
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-2 text-sm text-muted text-pretty"
        >
          Tamamlanan dikey bahçe ve peyzaj projelerimiz
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {projects.slice(0, 3).map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/projeler/${project.slug}`}
              className="group relative block overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-accent/30"
            >
              {/* Görsel */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

                {/* Üst sağ — süre rozeti */}
                {project.duration && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-cream backdrop-blur-sm">
                    <Clock className="h-3 w-3" />
                    {project.duration}
                  </div>
                )}

                {/* Alt içerik */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Proje tipi */}
                  {project.projectType && (
                    <span className="mb-2 inline-block rounded-full bg-accent/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
                      {project.projectType}
                    </span>
                  )}

                  {/* Konum */}
                  {project.location && (
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs text-cream/80">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </div>
                  )}

                  {/* Başlık */}
                  <h3 className="font-serif text-lg font-semibold leading-tight text-cream">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-1.5 text-sm text-cream/70 line-clamp-2">
                    {project.summary}
                  </p>

                  {/* Hover'da CTA */}
                  <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-accent opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Detayları gör
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/projeler">
            Tüm projeleri gör <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
