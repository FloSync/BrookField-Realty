import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { adminGetTeamMember } from "@/server/db/queries/team";
import { updateTeamMemberAction } from "@/server/actions/team";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function EditTeamMemberPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { error, success } = await searchParams;
  const member = await adminGetTeamMember(id);
  if (!member) notFound();

  const boundAction = updateTeamMemberAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/team" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-4">
        <ArrowLeft size={14} /> Back to team
      </Link>
      <h1 className="font-serif text-2xl text-ink mb-6">{member.name}</h1>
      <Banner error={error} success={success} />
      <TeamMemberForm member={member} action={boundAction} />
    </div>
  );
}
