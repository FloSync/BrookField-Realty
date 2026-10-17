import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, BedDouble, Bath, Ruler, CheckCircle2, Phone, Mail } from "lucide-react";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PageHeader } from "@/components/ui/PageHeader";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import {
  getAllPropertySlugs,
  getPublishedPropertyBySlug,
} from "@/server/db/queries/properties";
import { formatPrice, availabilityLabel } from "@/lib/utils";
import {
  buildPropertyWhatsAppLink,
  PHONE_NUMBER,
  PHONE_NUMBER_TEL,
  EMAIL_ADDRESS,
} from "@/lib/nav-links";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPublishedPropertyBySlug(slug);
  return {
    title: property
      ? `${property.title} | Brookfield Realty & Investment Ltd.`
      : "Property not found",
    description: property?.description,
  };
}

const availabilityStyles: Record<string, string> = {
  available: "bg-forest/10 text-forest",
  reserved: "bg-brass/15 text-brass",
  sold: "bg-slate/15 text-slate",
};

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPublishedPropertyBySlug(slug);

  if (!property) notFound();

  const propertyOption = { slug: property.slug, title: property.title };

  return (
    <>
      <PageHeader
        title={property.title}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: property.title },
        ]}
      />

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 grid lg:grid-cols-[1.6fr_1fr] gap-12">
        <div>
          <PropertyGallery images={property.images} />

          <div className="mt-10 flex items-center gap-3 flex-wrap">
            <span
              className={`px-2.5 py-1 text-xs font-medium ${availabilityStyles[property.availability]}`}
            >
              {availabilityLabel(property.availability)}
            </span>
            <span className="text-xs text-brass">{property.propertyType}</span>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-slate">
            <MapPin size={16} />
            {property.location}, {property.state}
          </p>

          <div className="mt-6 flex flex-wrap gap-6 border-y hairline py-6">
            {property.bedrooms !== undefined && (
              <Stat icon={<BedDouble size={18} />} label="Bedrooms" value={String(property.bedrooms)} />
            )}
            {property.bathrooms !== undefined && (
              <Stat icon={<Bath size={18} />} label="Bathrooms" value={String(property.bathrooms)} />
            )}
            {property.landSize && (
              <Stat icon={<Ruler size={18} />} label="Land size" value={property.landSize} />
            )}
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-2xl text-ink mb-3">Description</h2>
            <p className="text-slate leading-relaxed">{property.description}</p>
          </div>

          {property.features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-2xl text-ink mb-4">Features</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {property.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-ink-soft">
                    <CheckCircle2 size={16} className="text-brass shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {property.paymentPlan && (
            <div className="mt-8">
              <h2 className="font-serif text-2xl text-ink mb-3">Payment plan</h2>
              <p className="text-slate leading-relaxed">{property.paymentPlan}</p>
            </div>
          )}

          <div id="enquire" className="mt-14 pt-10 border-t hairline scroll-mt-24">
            <h2 className="font-serif text-2xl text-ink mb-4">Make an enquiry</h2>
            <EnquiryForm
              mode="property"
              property={propertyOption}
              defaultMessage={`I would like more information about ${property.title} in ${property.location}.`}
              submitLabel="Make an enquiry"
            />
          </div>

          <div id="inspect" className="mt-14 pt-10 border-t hairline scroll-mt-24">
            <h2 className="font-serif text-2xl text-ink mb-4">Request an inspection</h2>
            <EnquiryForm
              mode="inspection"
              property={propertyOption}
              defaultMessage={`I would like to schedule an inspection for ${property.title}.`}
              submitLabel="Request an inspection"
            />
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 h-fit border hairline bg-white p-6">
          <p className="text-2xl font-serif text-ink">
            {formatPrice(property.price, property.currency)}
          </p>
          {property.priceNote && (
            <p className="text-sm text-slate mt-0.5">{property.priceNote}</p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="#inspect"
              className="inline-flex items-center justify-center gap-2 bg-ink text-parchment px-6 py-3 text-sm font-medium hover:bg-ink-soft"
            >
              Request an inspection
            </a>
            <a
              href={buildPropertyWhatsAppLink(property.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-forest text-white px-6 py-3 text-sm font-medium hover:bg-forest/90"
            >
              Chat on WhatsApp
            </a>
            <a
              href="#enquire"
              className="inline-flex items-center justify-center gap-2 border border-ink text-ink px-6 py-3 text-sm font-medium hover:bg-ink hover:text-parchment"
            >
              Make an enquiry
            </a>
          </div>

          <div className="mt-6 pt-6 border-t hairline flex flex-col gap-2 text-sm">
            <a href={`tel:${PHONE_NUMBER_TEL}`} className="inline-flex items-center gap-2 text-ink-soft hover:text-brass">
              <Phone size={14} /> {PHONE_NUMBER}
            </a>
            <a href={`mailto:${EMAIL_ADDRESS}`} className="inline-flex items-center gap-2 text-ink-soft hover:text-brass">
              <Mail size={14} /> {EMAIL_ADDRESS}
            </a>
          </div>

          <div className="mt-6 pt-6 border-t hairline text-xs text-slate space-y-1.5">
            <p>Listing ID: BRK-{property.id.padStart(4, "0")}</p>
            <p>
              Updated{" "}
              {new Date(property.updatedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-brass">{icon}</span>
      <div>
        <p className="text-sm text-ink font-medium leading-none">{value}</p>
        <p className="text-xs text-slate mt-1">{label}</p>
      </div>
    </div>
  );
}
