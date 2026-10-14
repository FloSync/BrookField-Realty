import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProjectAction } from "@/server/actions/projects";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewProjectPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  return (
    <div>
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-4">
        <ArrowLeft size={14} /> Back to projects
      </Link>
      <h1 className="font-serif text-2xl text-ink mb-6">Add project</h1>
      <Banner error={error} />
      <ProjectForm action={createProjectAction} />
    </div>
  );
}
