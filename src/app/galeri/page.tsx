import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/queries";

export const metadata = { title: "Galeri", description: "Tamamladığımız projelerden bir seçki." };

export default async function GaleriPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Galeri</h1>
        <p className="mt-2 text-muted">Tamamladığımız projelerden bir seçki.</p>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projeler/${p.slug}`}
            className="group relative block break-inside-avoid overflow-hidden rounded-2xl"
          >
            <Image
              src={p.coverImage}
              alt={p.title}
              width={800}
              height={600}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 p-5">
              <h2 className="font-serif text-lg font-semibold text-cream">{p.title}</h2>
              {p.projectType && (
                <p className="text-sm text-cream/70">{p.projectType}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
