"use client";

import type { PropertyAvailability, PropertyCategory } from "@/lib/types";

export type CategoryFilter = PropertyCategory | "all";
export type AvailabilityFilter = PropertyAvailability | "all";
export type PriceFilter = "all" | "under-50m" | "50m-150m" | "150m-plus";

const categories: { label: string; value: CategoryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Building", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Service plot", value: "land" },
  { label: "Investment", value: "investment" },
];

const availabilityOptions: { label: string; value: AvailabilityFilter }[] = [
  { label: "Any status", value: "all" },
  { label: "Available", value: "available" },
  { label: "Reserved", value: "reserved" },
  { label: "Sold", value: "sold" },
];

const priceOptions: { label: string; value: PriceFilter }[] = [
  { label: "Any price", value: "all" },
  { label: "Under ₦50M", value: "under-50m" },
  { label: "₦50M – ₦150M", value: "50m-150m" },
  { label: "Above ₦150M", value: "150m-plus" },
];

interface FilterPanelProps {
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  location: string;
  onLocationChange: (value: string) => void;
  locations: string[];
  availability: AvailabilityFilter;
  onAvailabilityChange: (value: AvailabilityFilter) => void;
  price: PriceFilter;
  onPriceChange: (value: PriceFilter) => void;
}

export function FilterPanel({
  category,
  onCategoryChange,
  location,
  onLocationChange,
  locations,
  availability,
  onAvailabilityChange,
  price,
  onPriceChange,
}: FilterPanelProps) {
  const selectClass =
    "border hairline bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brass min-w-[140px]";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onCategoryChange(c.value)}
            aria-pressed={category === c.value}
            className={`px-4 py-2 text-sm border ${
              category === c.value
                ? "bg-ink text-parchment border-ink"
                : "hairline text-ink-soft hover:border-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="sr-only" htmlFor="filter-location">
          Location
        </label>
        <select
          id="filter-location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className={selectClass}
        >
          <option value="all">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="filter-availability">
          Availability
        </label>
        <select
          id="filter-availability"
          value={availability}
          onChange={(e) =>
            onAvailabilityChange(e.target.value as AvailabilityFilter)
          }
          className={selectClass}
        >
          {availabilityOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="filter-price">
          Price range
        </label>
        <select
          id="filter-price"
          value={price}
          onChange={(e) => onPriceChange(e.target.value as PriceFilter)}
          className={selectClass}
        >
          {priceOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function matchesPriceFilter(price: number, filter: PriceFilter): boolean {
  if (filter === "all") return true;
  if (filter === "under-50m") return price < 50_000_000;
  if (filter === "50m-150m") return price >= 50_000_000 && price <= 150_000_000;
  return price > 150_000_000;
}
