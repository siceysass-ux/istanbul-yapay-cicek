import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getApplicationBySlug, applications } from "@/lib/applications";
import { FeatureList } from "@/components/shared/feature-list";
import { ArrowRight, Check } from "lucide-react";

export function generateStaticParams() {
  return applications.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApplicationBySlug(slug);
  if (!app) return { title: "Uygulama bulunamadı" };
  return { title: app.title, description: app.intro.slice(0, 160) };
}

export default async function ApplicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApplicationBySlug(slug);
  if (!app) notFound();

  return (
    <article>
      {/* Hero */}
      <section className="relative min-h-[40vh] overflow-hidden">
        <Image
          src={app.heroImage}
          alt={app.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-5xl px-4 pb-10 lg:px-8">
            <h1 className="font-serif text-3xl font-semibold text-cream sm:text-5xl">{app.title}</h1>
            <p className="mt-2 text-lg text-cream/80">{app.subtitle}</p>
            <div className="mt-6 flex gap-3">
              <Link href="/kesif-talebi" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-cream hover:bg-primary-dark transition-colors">
                Teklif Al
              </Link>
              <Link href="/projeler" className="rounded-full border border-cream/30 px-6 py-3 text-sm font-medium text-cream hover:bg-cream/10 transition-colors">
                Tamamlanan Projeler
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* İntro */}
      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <p className="text-lg leading-relaxed text-ink/80">{app.intro}</p>
      </section>

      {/* Bölümler */}
      {app.sections.map((s, i) => (
        <section key={s.heading} className={`px-4 py-10 lg:px-8 ${i % 2 === 1 ? "bg-cream-dark/40" : ""}`}>
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-semibold mb-4">{s.heading}</h2>
            <p className="leading-relaxed text-ink/75">{s.body}</p>
          </div>
        </section>
      ))}

      {/* Yosun türleri (sadece yosun duvar için) */}
      {app.mossTypes && app.mossTypes.length > 0 && (
        <section className="px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-semibold mb-6">Yosun Türleri</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {app.mossTypes.map((moss) => (
                <div key={moss.name} className="rounded-2xl border border-primary/10 bg-white/60 p-6">
                  <h3 className="font-serif text-lg font-semibold mb-2 text-primary">{moss.name}</h3>
                  <p className="text-sm leading-relaxed text-ink/70">{moss.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Özellikler */}
      <section className="bg-cream-dark/40 px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-2xl font-semibold mb-6">Özellikler</h2>
          <FeatureList items={app.features} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center lg:px-8">
        <h2 className="font-serif text-2xl font-semibold mb-3">Projeniz için teklif alın</h2>
        <p className="text-muted mb-6">Uzman ekibimiz mekanınıza özel tasarım oluşturur.</p>
        <Link href="/kesif-talebi" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-cream hover:bg-primary-dark transition-colors">
          Teklif Al <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
