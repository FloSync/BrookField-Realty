import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { PropertyImageManager } from "@/components/admin/PropertyImageManager";
import { adminGetProperty } from "@/server/db/queries/properties";
import { updatePropertyAction } from "@/server/actions/properties";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function EditPropertyPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { error, success } = await searchParams;
  const property = await adminGetProperty(id);

  if (!property) notFound();

  const boundAction = updatePropertyAction.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/properties"
        className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-4"
      >
        <ArrowLeft size={14} /> Back to properties
      </Link>
      <h1 className="font-serif text-2xl text-ink mb-6">{property.title}</h1>
      <Banner error={error} success={success} />

      <div className="space-y-10">
        <PropertyForm property={property} action={boundAction} />
        <PropertyImageManager property={property} />
      </div>
    </div>
  );
}
