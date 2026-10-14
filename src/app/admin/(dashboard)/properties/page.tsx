import Link from "next/link";
import { Plus } from "lucide-react";
import { Banner } from "@/components/admin/Banner";
import { adminListProperties } from "@/server/db/queries/properties";
import { formatPrice } from "@/lib/utils";
import {
  deletePropertyAction,
  quickUpdateAvailabilityAction,
  quickUpdatePriceAction,
} from "@/server/actions/properties";

interface PageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const { success, error } = await searchParams;
  const properties = await adminListProperties();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-ink">Properties</h1>
          <p className="text-sm text-slate mt-1">{properties.length} total</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 bg-ink text-parchment px-4 py-2.5 text-sm font-medium hover:bg-ink-soft"
        >
          <Plus size={16} /> Add property
        </Link>
      </div>

      <Banner success={success} error={error} />

      <div className="border hairline divide-y hairline">
        {properties.length === 0 && (
          <p className="p-6 text-sm text-slate">No properties yet.</p>
        )}
        {properties.map((p) => (
          <div key={p.id} className="p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link
                  href={`/admin/properties/${p.id}/edit`}
                  className="font-medium text-ink hover:text-brass"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-slate mt-0.5">
                  {p.location}, {p.state} · {p.category}
                  {!p.published && (
                    <span className="ml-2 text-brass">Unpublished</span>
                  )}
                </p>
              </div>
              <form action={deletePropertyAction}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  className="text-xs text-slate hover:text-red-700"
                >
                  Delete
                </button>
              </form>
            </div>

            <div className="flex flex-wrap gap-6">
              <form action={quickUpdatePriceAction} className="flex items-end gap-2">
                <input type="hidden" name="id" value={p.id} />
                <div>
                  <label className="block text-[11px] text-slate mb-1">
                    Price ({formatPrice(p.price, p.currency)})
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={p.price}
                    min={1}
                    className="w-40 border hairline px-2.5 py-1.5 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="border hairline px-3 py-1.5 text-xs hover:border-brass"
                >
                  Update price
                </button>
              </form>

              <form
                action={quickUpdateAvailabilityAction}
                className="flex items-end gap-2"
              >
                <input type="hidden" name="id" value={p.id} />
                <div>
                  <label className="block text-[11px] text-slate mb-1">
                    Availability
                  </label>
                  <select
                    name="availability"
                    defaultValue={p.availability}
                    className="w-36 border hairline px-2.5 py-1.5 text-sm bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="border hairline px-3 py-1.5 text-xs hover:border-brass"
                >
                  Update status
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
