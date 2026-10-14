import type { Property } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function PropertyGrid({
  properties,
  prominent = false,
}: {
  properties: Property[];
  prominent?: boolean;
}) {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="No properties match your filters"
        description="Try adjusting your search or check back soon — new listings are added regularly."
      />
    );
  }

  return (
    <div
      className={
        prominent
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-stretch gap-8 md:gap-10 [&>*]:min-w-0"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch gap-6 [&>*]:min-w-0"
      }
    >
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} prominent={prominent} />
      ))}
    </div>
  );
}
