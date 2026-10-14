import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { CareerForm } from "@/components/admin/CareerForm";
import { adminGetCareer } from "@/server/db/queries/careers";
import { updateCareerAction } from "@/server/actions/careers";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function EditCareerPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { error, success } = await searchParams;
  const career = await adminGetCareer(id);
  if (!career) notFound();

  const boundAction = updateCareerAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/careers" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-4">
        <ArrowLeft size={14} /> Back to careers
      </Link>
      <h1 className="font-serif text-2xl text-ink mb-6">{career.title}</h1>
      <Banner error={error} success={success} />
      <CareerForm career={career} action={boundAction} />
    </div>
  );
}
