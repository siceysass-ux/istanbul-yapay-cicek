import { ProjectsSkeleton } from "@/components/shared/skeletons";

export default function ProjectsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto h-10 w-48 animate-pulse rounded-lg bg-primary/10" />
        <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded bg-primary/5" />
      </div>
      <ProjectsSkeleton />
    </div>
  );
}
