import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { adminGetProject } from "@/server/db/queries/projects";
import { updateProjectAction } from "@/server/actions/projects";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function EditProjectPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { error, success } = await searchParams;
  const project = await adminGetProject(id);
  if (!project) notFound();

  const boundAction = updateProjectAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-4">
        <ArrowLeft size={14} /> Back to projects
      </Link>
      <h1 className="font-serif text-2xl text-ink mb-6">{project.name}</h1>
      <Banner error={error} success={success} />
      <ProjectForm project={project} action={boundAction} />
    </div>
  );
}
