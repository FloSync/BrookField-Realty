import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { createTeamMemberAction } from "@/server/actions/team";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewTeamMemberPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  return (
    <div>
      <Link href="/admin/team" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-4">
        <ArrowLeft size={14} /> Back to team
      </Link>
      <h1 className="font-serif text-2xl text-ink mb-6">Add team member</h1>
      <Banner error={error} />
      <TeamMemberForm action={createTeamMemberAction} />
    </div>
  );
}
