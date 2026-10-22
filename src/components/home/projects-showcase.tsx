"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@prisma/client";

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="mb-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl font-semibold sm:text-4xl"
        >
          Kurumsal Dikey Bahçe Projeleri
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-2 text-sm text-muted text-pretty"
        >
          Otel, ofis, restoran, AVM ve kurumsal mekanlarda tamamladığımız yüksek metrajlı dikey yapay bahçe ve yosun duvar uygulamalarımız
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
            <a
              href={`https://dikeyyapaybahce.com/projeler/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-accent/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {project.projectType && (
                    <span className="mb-2 inline-block rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {project.projectType}
                    </span>
                  )}

                  {project.location && (
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs text-white/80">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </div>
                  )}

                  <h3 className="font-serif text-lg font-semibold leading-tight text-white">
                    {project.title}
                  </h3>

                  <p className="mt-1.5 text-sm text-white/75 line-clamp-2">
                    {project.summary}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-accent opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Proje detayını incele
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button variant="outline" size="lg" asChild>
          <a href="https://dikeyyapaybahce.com/projeler" target="_blank" rel="noopener noreferrer">
            Tüm Kurumsal Projeleri İncele (dikeyyapaybahce.com) <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}
