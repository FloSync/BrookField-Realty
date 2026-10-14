import Link from "next/link";
import { Plus } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { adminListCareers } from "@/server/db/queries/careers";
import { deleteCareerAction, setCareerStatusAction } from "@/server/actions/careers";

interface PageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

const statusStyles: Record<string, string> = {
  draft: "text-slate",
  published: "text-forest",
  closed: "text-brass",
  archived: "text-slate",
};

export default async function AdminCareersPage({ searchParams }: PageProps) {
  const { success, error } = await searchParams;
  const careers = await adminListCareers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-ink">Careers</h1>
          <p className="text-sm text-slate mt-1">{careers.length} total</p>
        </div>
        <Link
          href="/admin/careers/new"
          className="inline-flex items-center gap-2 bg-ink text-parchment px-4 py-2.5 text-sm font-medium hover:bg-ink-soft"
        >
          <Plus size={16} /> Add vacancy
        </Link>
      </div>

      <Banner success={success} error={error} />

      <div className="border hairline divide-y hairline">
        {careers.length === 0 && (
          <p className="p-6 text-sm text-slate">No vacancies yet.</p>
        )}
        {careers.map((job) => (
          <div key={job.id} className="p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href={`/admin/careers/${job.id}/edit`} className="font-medium text-ink hover:text-brass">
                {job.title}
              </Link>
              <p className="text-xs text-slate mt-0.5">
                {job.department} · {job.location} ·{" "}
                <span className={statusStyles[job.status]}>{job.status}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <form action={setCareerStatusAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={job.id} />
                <select
                  name="status"
                  defaultValue={job.status}
                  className="border hairline px-2.5 py-1.5 text-xs bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
                <button type="submit" className="text-xs border hairline px-2.5 py-1.5 hover:border-brass">
                  Update
                </button>
              </form>
              <form action={deleteCareerAction}>
                <input type="hidden" name="id" value={job.id} />
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
