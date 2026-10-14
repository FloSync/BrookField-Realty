import Link from "next/link";
import { Plus } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { adminListProjects } from "@/server/db/queries/projects";
import { deleteProjectAction, toggleProjectPublishedAction } from "@/server/actions/projects";

interface PageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function AdminProjectsPage({ searchParams }: PageProps) {
  const { success, error } = await searchParams;
  const projects = await adminListProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-ink">Projects & estates</h1>
          <p className="text-sm text-slate mt-1">{projects.length} total</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-ink text-parchment px-4 py-2.5 text-sm font-medium hover:bg-ink-soft"
        >
          <Plus size={16} /> Add project
        </Link>
      </div>

      <Banner success={success} error={error} />

      <div className="border hairline divide-y hairline">
        {projects.length === 0 && (
          <p className="p-6 text-sm text-slate">No projects yet.</p>
        )}
        {projects.map((p) => (
          <div key={p.id} className="p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href={`/admin/projects/${p.id}/edit`} className="font-medium text-ink hover:text-brass">
                {p.name}
              </Link>
              <p className="text-xs text-slate mt-0.5">
                {p.location} · {p.status}
                {!p.published && <span className="ml-2 text-brass">Unpublished</span>}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <form action={toggleProjectPublishedAction}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="published" value={(!p.published).toString()} />
                <button type="submit" className="text-xs border hairline px-3 py-1.5 hover:border-brass">
                  {p.published ? "Unpublish" : "Publish"}
                </button>
              </form>
              <form action={deleteProjectAction}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="text-xs text-slate hover:text-red-700">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
