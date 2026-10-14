import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { CareerForm } from "@/components/admin/CareerForm";
import { createCareerAction } from "@/server/actions/careers";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewCareerPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  return (
    <div>
      <Link href="/admin/careers" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-4">
        <ArrowLeft size={14} /> Back to careers
      </Link>
      <h1 className="font-serif text-2xl text-ink mb-6">Add vacancy</h1>
      <Banner error={error} />
      <CareerForm action={createCareerAction} />
    </div>
  );
}
