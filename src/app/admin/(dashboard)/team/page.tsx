import Link from "next/link";
import { Plus } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { adminListTeam } from "@/server/db/queries/team";
import { deleteTeamMemberAction, toggleTeamMemberPublishedAction } from "@/server/actions/team";

interface PageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function AdminTeamPage({ searchParams }: PageProps) {
  const { success, error } = await searchParams;
  const team = await adminListTeam();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-ink">Team</h1>
          <p className="text-sm text-slate mt-1">{team.length} total</p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center gap-2 bg-ink text-parchment px-4 py-2.5 text-sm font-medium hover:bg-ink-soft"
        >
          <Plus size={16} /> Add member
        </Link>
      </div>

      <Banner success={success} error={error} />

      <div className="border hairline divide-y hairline">
        {team.length === 0 && (
          <p className="p-6 text-sm text-slate">No team members yet.</p>
        )}
        {team.map((m) => (
          <div key={m.id} className="p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href={`/admin/team/${m.id}/edit`} className="font-medium text-ink hover:text-brass">
                {m.name}
              </Link>
              <p className="text-xs text-slate mt-0.5">
                {m.position} · order {m.displayOrder}
                {!m.published && <span className="ml-2 text-brass">Hidden</span>}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <form action={toggleTeamMemberPublishedAction}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="published" value={(!m.published).toString()} />
                <button type="submit" className="text-xs border hairline px-3 py-1.5 hover:border-brass">
                  {m.published ? "Hide" : "Show"}
                </button>
              </form>
              <form action={deleteTeamMemberAction}>
                <input type="hidden" name="id" value={m.id} />
                <button type="submit" className="text-xs text-slate hover:text-red-700">
                  Remove
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
