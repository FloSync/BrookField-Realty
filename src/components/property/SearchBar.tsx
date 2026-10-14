"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by name or location",
}: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search properties"
        className="w-full border hairline bg-white pl-10 pr-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
      />
    </div>
  );
}
