import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { createPropertyAction } from "@/server/actions/properties";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewPropertyPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <div>
      <Link
        href="/admin/properties"
        className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-4"
      >
        <ArrowLeft size={14} /> Back to properties
      </Link>
      <h1 className="font-serif text-2xl text-ink mb-6">Add property</h1>
      <Banner error={error} />
      <PropertyForm action={createPropertyAction} />
    </div>
  );
}
