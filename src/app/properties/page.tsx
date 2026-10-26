import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PropertiesPageCatalog } from "@/components/property/PropertiesPageCatalog";
import { getPublishedProperties } from "@/server/db/queries/properties";

export const metadata: Metadata = {
  title: "Properties | Brookfield Realty & Investment Ltd.",
  description:
    "Browse land, houses, and commercial properties for sale across Lagos, Oyo, and Brookfield estates.",
};

export const revalidate = 300;

export default async function PropertiesPage() {
  const forSale = (await getPublishedProperties()).filter((p) => p.listingType !== "rent");

  return (
    <>
      <PageHeader
        title="Properties"
        description="Official estate flyers, land plots, houses, and commercial listings from Brookfield Realty."
        crumbs={[{ label: "Home", href: "/" }, { label: "Properties" }]}
      />
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <PropertiesPageCatalog properties={forSale} />
      </section>
    </>
  );
}
