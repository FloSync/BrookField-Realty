import { Banner } from "@/components/admin/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { adminListApplications } from "@/server/db/queries/applications";
import { adminUpdateApplicationStatusAction } from "@/server/actions/applications";

interface PageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function AdminApplicationsPage({ searchParams }: PageProps) {
  const { success, error } = await searchParams;
  const applications = await adminListApplications();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-ink">Career applications</h1>
        <p className="text-sm text-slate mt-1">
          {applications.length} total ·{" "}
          {applications.filter((a) => a.status === "new").length} new
        </p>
      </div>

      <Banner success={success} error={error} />

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Applications submitted through the Careers page will appear here."
        />
      ) : (
        <div className="border hairline divide-y hairline">
          {applications.map((a) => (
            <div key={a.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 ${
                        a.status === "new" ? "bg-brass/15 text-brass" : "bg-slate/15 text-slate"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <p className="font-medium text-ink mt-2">{a.name}</p>
                  <p className="text-xs text-brass mt-0.5">{a.job_title}</p>
                  <p className="text-xs text-slate mt-0.5">
                    {new Date(a.created_at).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <form action={adminUpdateApplicationStatusAction}>
                  <input type="hidden" name="id" value={a.id} />
                  <input
                    type="hidden"
                    name="status"
                    value={a.status === "new" ? "reviewed" : "new"}
                  />
                  <button type="submit" className="text-xs border hairline px-2.5 py-1.5 hover:border-brass">
                    Mark as {a.status === "new" ? "reviewed" : "new"}
                  </button>
                </form>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-3">
                <p>
                  <span className="text-slate">Phone:</span>{" "}
                  <a href={`tel:${a.phone}`} className="text-ink hover:text-brass">
                    {a.phone}
                  </a>
                </p>
                <p>
                  <span className="text-slate">Email:</span>{" "}
                  <a href={`mailto:${a.email}`} className="text-ink hover:text-brass">
                    {a.email}
                  </a>
                </p>
                {(a.resume_storage_key || a.resume_url || a.resume_filename) && (
                  <p className="sm:col-span-2">
                    <span className="text-slate">CV:</span>{" "}
                    <a
                      href={`/api/admin/applications/${a.id}/resume`}
                      className="text-brass hover:underline underline-offset-4"
                    >
                      {a.resume_filename ?? "Download"}
                    </a>
                  </p>
                )}
              </div>

              <p className="text-sm text-ink-soft bg-parchment-dim border hairline p-3">
                {a.cover_message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
