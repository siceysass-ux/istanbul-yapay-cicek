import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/project-form";
import { ProjectList } from "@/components/admin/project-list";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Projeler</h1>
        <p className="text-sm text-muted">{projects.length} proje</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[480px_1fr]">
        <ProjectForm />
        <ProjectList projects={projects} />
      </div>
    </div>
  );
}
