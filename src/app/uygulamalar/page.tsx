import Image from "next/image";
import Link from "next/link";
import { applications } from "@/lib/applications";

export const metadata = { title: "Uygulamalar", description: "Yapay dikey bahçe, yosun duvar, büyük yapay ağaç, yapay gül duvar, yosun tablolar ve yapay bambu dekorasyonu." };

export default function UygulamalarPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Uygulamalar</h1>
        <p className="mt-2 text-muted">Birbirinden dekoratif uygulamalarımıza göz atın.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <Link
            key={app.slug}
            href={`/uygulamalar/${app.slug}`}
            className="group overflow-hidden rounded-3xl border border-primary/10 bg-white/60 transition-shadow hover:shadow-xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={app.heroImage}
                alt={app.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <h2 className="absolute bottom-4 left-4 font-serif text-xl font-semibold text-cream">{app.title}</h2>
            </div>
            <div className="p-5">
              <p className="text-sm text-ink/70 line-clamp-2">{app.intro}</p>
              <span className="mt-3 inline-block text-sm font-medium text-primary">Detaylar →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
