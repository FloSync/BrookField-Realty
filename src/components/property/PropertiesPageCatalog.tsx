"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/types";
import {
  getCommercialForSale,
  getLandAndHousesForSale,
} from "@/lib/properties-page";
import { PropertyGrid } from "./PropertyGrid";
import { SearchBar } from "./SearchBar";
import {
  FilterPanel,
  type AvailabilityFilter,
  type CategoryFilter,
  type PriceFilter,
} from "./FilterPanel";
import { filterPropertiesList } from "./PropertyFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export function PropertiesPageCatalog({
  properties,
}: {
  properties: Property[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [location, setLocation] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [price, setPrice] = useState<PriceFilter>("all");

  const landPool = useMemo(
    () => getLandAndHousesForSale(properties),
    [properties]
  );
  const commercialPool = useMemo(
    () => getCommercialForSale(properties),
    [properties]
  );

  const locations = useMemo(
    () => [...new Set(properties.map((p) => p.location))].sort(),
    [properties]
  );

  const filters = useMemo(
    () => ({ query, category, location, availability, price }),
    [query, category, location, availability, price]
  );

  const landListings = useMemo(
    () => filterPropertiesList(landPool, filters),
    [landPool, filters]
  );
  const commercialListings = useMemo(
    () => filterPropertiesList(commercialPool, filters),
    [commercialPool, filters]
  );

  const totalShown = landListings.length + commercialListings.length;
  const noneMatch = totalShown === 0;

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <SearchBar value={query} onChange={setQuery} />
      </div>
      <FilterPanel
        category={category}
        onCategoryChange={setCategory}
        location={location}
        onLocationChange={setLocation}
        locations={locations}
        availability={availability}
        onAvailabilityChange={setAvailability}
        price={price}
        onPriceChange={setPrice}
      />

      {noneMatch ? (
        <EmptyState
          title="No properties match your filters"
          description="Try adjusting your search or filters to see more listings."
          action={
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setLocation("all");
                setAvailability("all");
                setPrice("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <section className="mt-10 md:mt-14" aria-labelledby="land-houses-heading">
            <div className="border-b hairline pb-4 mb-8">
              <h2
                id="land-houses-heading"
                className="font-serif text-2xl sm:text-3xl font-bold text-ink"
              >
                Properties for Sale — Land &amp; Houses
              </h2>
              <p className="mt-2 text-slate text-sm sm:text-base max-w-3xl">
                Estate land, farmland, and verified houses for sale. Official flyers
                are shown in full so pricing and plot details stay readable.
              </p>
              <p className="mt-3 text-sm text-slate">
                {landListings.length}{" "}
                {landListings.length === 1 ? "listing" : "listings"}
              </p>
            </div>
            {landListings.length === 0 ? (
              <p className="text-sm text-slate mb-8">
                No land or house listings match your filters in this section.
              </p>
            ) : (
              <PropertyGrid properties={landListings} prominent />
            )}
          </section>

          <section
            className="mt-16 md:mt-20 pt-4"
            aria-labelledby="commercial-heading"
          >
            <div className="border-b hairline pb-4 mb-8">
              <h2
                id="commercial-heading"
                className="font-serif text-2xl sm:text-3xl font-bold text-ink"
              >
                Commercial Properties for Sale
              </h2>
              <p className="mt-2 text-slate text-sm sm:text-base max-w-3xl">
                Commercial and office listings published on brookfieldrealtorltd.com,
                including Beverly Homes.
              </p>
              <p className="mt-3 text-sm text-slate">
                {commercialListings.length}{" "}
                {commercialListings.length === 1 ? "listing" : "listings"}
              </p>
            </div>
            {commercialListings.length === 0 ? (
              <p className="text-sm text-slate">
                No commercial listings match your filters in this section.
              </p>
            ) : (
              <PropertyGrid properties={commercialListings} prominent />
            )}
          </section>
        </>
      )}
    </div>
  );
}
