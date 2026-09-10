import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, CheckCircle2 } from "lucide-react";
import { getProjectBySlug } from "@/lib/queries";
import { BeforeAfterSlider } from "@/components/project/before-after-slider";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl mb-8">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
          priority
        />
      </div>

      {project.location && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted">
          <MapPin className="h-4 w-4" /> {project.location}
        </div>
      )}

      <h1 className="font-serif text-4xl font-semibold text-balance mb-4">{project.title}</h1>
      <p className="text-lg text-muted mb-8 text-pretty">{project.summary}</p>

      {/* Before/After Slider */}
      <div className="mb-10">
        <h2 className="font-serif text-2xl font-semibold mb-4">Öncesi & Sonrası</h2>
        <BeforeAfterSlider
          beforeImage="/projects/project-5.jpg"
          afterImage={project.coverImage}
          beforeLabel="Öncesi"
          afterLabel="Sonrası"
          alt={project.title}
        />
      </div>

      {/* Proje detayı */}
      <div className="prose prose-lg max-w-none mb-10">
        <p className="text-ink/80 leading-relaxed whitespace-pre-line">{project.content}</p>
      </div>

      {/* Proje özellikleri */}
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        {[
          { label: "Proje Tipi", value: project.projectType ?? "Dikey Bahçe" },
          { label: "Süre", value: project.duration ?? "2 Hafta" },
          { label: "Konum", value: project.location ?? "İstanbul" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-primary/10 bg-white/60 p-5">
            <p className="text-xs text-muted mb-1">{item.label}</p>
            <p className="font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 text-center text-cream">
        <h2 className="font-serif text-xl font-semibold mb-2">Benzer bir proje mi var?</h2>
        <a
          href="/kesif-talebi"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-ink hover:bg-accent-light transition-colors"
        >
          <CheckCircle2 className="h-4 w-4" /> Keşif Talebi
        </a>
      </div>
    </article>
  );
}
