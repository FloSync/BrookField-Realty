import Link from "next/link";
import { MapPin } from "lucide-react";
import { OFFICE_ADDRESS, OFFICE_DIRECTIONS_URL, OFFICE_MAP_EMBED_URL } from "@/lib/company";

export function OfficeMap() {
  return (
    <div className="border hairline bg-white overflow-hidden">
      <div className="p-5 border-b hairline">
        <h3 className="font-serif text-xl text-ink flex items-center gap-2">
          <MapPin size={20} className="text-brass shrink-0" />
          Office location
        </h3>
        <p className="mt-2 text-sm text-slate leading-relaxed">{OFFICE_ADDRESS}</p>
        <Link
          href={OFFICE_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center bg-brass text-ink px-5 py-2.5 text-sm font-medium hover:bg-brass-light transition-colors"
        >
          Get directions
        </Link>
      </div>
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-parchment-dim">
        <iframe
          title="Map showing Brookfield Realty office location"
          src={OFFICE_MAP_EMBED_URL}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
