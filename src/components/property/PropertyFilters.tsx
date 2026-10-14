"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/types";
import { PropertyGrid } from "./PropertyGrid";
import { SearchBar } from "./SearchBar";
import {
  FilterPanel,
  matchesPriceFilter,
  type AvailabilityFilter,
  type CategoryFilter,
  type PriceFilter,
} from "./FilterPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export type PropertyListFilters = {
  query: string;
  category: CategoryFilter;
  location: string;
  availability: AvailabilityFilter;
  price: PriceFilter;
};

export function filterPropertiesList(
  properties: Property[],
  {
    query,
    category,
    location,
    availability,
    price,
  }: PropertyListFilters
): Property[] {
  return properties.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const matchesLocation = location === "all" || p.location === location;
    const matchesAvailability =
      availability === "all" || p.availability === availability;
    const matchesPrice = matchesPriceFilter(p.price, price);
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.propertyType.toLowerCase().includes(q);
    return (
      matchesCategory &&
      matchesLocation &&
      matchesAvailability &&
      matchesPrice &&
      matchesQuery
    );
  });
}

export function PropertyFilters({ properties }: { properties: Property[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [location, setLocation] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [price, setPrice] = useState<PriceFilter>("all");

  const locations = useMemo(
    () => [...new Set(properties.map((p) => p.location))].sort(),
    [properties]
  );

  const filtered = useMemo(
    () =>
      filterPropertiesList(properties, {
        query,
        category,
        location,
        availability,
        price,
      }),
    [properties, query, category, location, availability, price]
  );

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

      <p className="text-sm text-slate mt-8 mb-6">
        {filtered.length} {filtered.length === 1 ? "property" : "properties"}
      </p>

      {filtered.length === 0 ? (
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
        <PropertyGrid properties={filtered} />
      )}
    </div>
  );
}
