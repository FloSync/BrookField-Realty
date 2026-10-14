import { Star, Trash2 } from "lucide-react";
import type { AdminProperty } from "@/server/db/admin-types";
import {
  addPropertyImageAction,
  removePropertyImageAction,
  setPrimaryImageAction,
} from "@/server/actions/properties";

export function PropertyImageManager({ property }: { property: AdminProperty }) {
  return (
    <div className="border hairline p-6">
      <h2 className="font-serif text-xl text-ink mb-1">Images</h2>
      <p className="text-sm text-slate mb-5">
        The starred image is the cover photo shown on property cards. Images
        are stored as URLs — see the project&rsquo;s cost notes for the R2
        upload path once volume justifies it.
      </p>

      {property.images.length === 0 ? (
        <p className="text-sm text-slate mb-5">No images yet.</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {property.images.map((img) => (
            <div key={img.id} className="border hairline">
              <div className="relative aspect-[4/3] bg-parchment-dim overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-pasted URLs can be any host, so next/image's domain allowlist doesn't apply here */}
                <img
                  src={img.url}
                  alt={img.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {img.isPrimary && (
                  <span className="absolute top-2 left-2 bg-brass text-white text-[10px] px-2 py-0.5">
                    Cover
                  </span>
                )}
              </div>
              <div className="p-2 flex items-center justify-between gap-2">
                {!img.isPrimary && (
                  <form action={setPrimaryImageAction}>
                    <input type="hidden" name="propertyId" value={property.id} />
                    <input type="hidden" name="imageId" value={img.id} />
                    <button
                      type="submit"
                      title="Set as cover photo"
                      className="text-slate hover:text-brass"
                    >
                      <Star size={15} />
                    </button>
                  </form>
                )}
                <form action={removePropertyImageAction} className="ml-auto">
                  <input type="hidden" name="propertyId" value={property.id} />
                  <input type="hidden" name="imageId" value={img.id} />
                  <button
                    type="submit"
                    title="Remove image"
                    className="text-slate hover:text-red-700"
                  >
                    <Trash2 size={15} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <form action={addPropertyImageAction} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="propertyId" value={property.id} />
        <div className="flex-1 min-w-48">
          <label className="block text-[11px] text-slate mb-1">Image URL</label>
          <input
            type="url"
            name="url"
            required
            placeholder="https://…"
            className="w-full border hairline px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1 min-w-40">
          <label className="block text-[11px] text-slate mb-1">Alt text</label>
          <input
            type="text"
            name="alt"
            placeholder="Short description"
            className="w-full border hairline px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="border hairline px-4 py-2 text-sm hover:border-brass"
        >
          Add image
        </button>
      </form>
    </div>
  );
}
