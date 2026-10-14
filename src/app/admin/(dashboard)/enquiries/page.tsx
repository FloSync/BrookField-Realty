import { Banner } from "@/components/admin/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { adminListEnquiries } from "@/server/db/queries/enquiries";
import { adminUpdateEnquiryStatusAction } from "@/server/actions/enquiries";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

const typeLabels: Record<string, string> = {
  general: "General",
  property: "Property",
  inspection: "Inspection",
  investment: "Investment",
};

const statusStyles: Record<string, string> = {
  new: "bg-brass/15 text-brass",
  contacted: "bg-forest/10 text-forest",
  in_progress: "bg-forest/10 text-forest",
  completed: "bg-slate/15 text-slate",
  closed: "bg-slate/15 text-slate",
};

export default async function AdminEnquiriesPage({ searchParams }: PageProps) {
  const { success, error } = await searchParams;
  const enquiries = await adminListEnquiries();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-ink">Enquiries</h1>
        <p className="text-sm text-slate mt-1">
          {enquiries.length} total · {enquiries.filter((e) => e.status === "new").length} new
        </p>
      </div>

      <Banner success={success} error={error} />

      {enquiries.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          description="Enquiries and inspection requests submitted from the website will appear here."
        />
      ) : (
        <div className="border hairline divide-y hairline">
          {enquiries.map((e) => (
            <div key={e.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs border hairline px-2 py-0.5 text-ink-soft">
                      {typeLabels[e.enquiry_type] ?? e.enquiry_type}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 ${statusStyles[e.status] ?? "text-slate"}`}
                    >
                      {e.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-medium text-ink mt-2">{e.name}</p>
                  <p className="text-xs text-slate mt-0.5">
                    {new Date(e.created_at).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <form action={adminUpdateEnquiryStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={e.id} />
                  <select
                    name="status"
                    defaultValue={e.status}
                    className="border hairline px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button type="submit" className="text-xs border hairline px-2.5 py-1.5 hover:border-brass">
                    Update
                  </button>
                </form>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-3">
                <p>
                  <span className="text-slate">Phone:</span>{" "}
                  <a href={`tel:${e.phone}`} className="text-ink hover:text-brass">
                    {e.phone}
                  </a>
                </p>
                <p>
                  <span className="text-slate">Email:</span>{" "}
                  <a href={`mailto:${e.email}`} className="text-ink hover:text-brass">
                    {e.email}
                  </a>
                </p>
                {e.property_title && (
                  <p className="sm:col-span-2">
                    <span className="text-slate">Property:</span>{" "}
                    <span className="text-ink">
                      {e.property_title}
                      {e.property_location && ` — ${e.property_location}`}
                      {e.property_price_snapshot && e.property_currency_snapshot && (
                        <span className="text-slate">
                          {" "}
                          ({formatPrice(
                            e.property_price_snapshot,
                            e.property_currency_snapshot as "NGN" | "USD"
                          )}{" "}
                          at time of enquiry)
                        </span>
                      )}
                    </span>
                  </p>
                )}
                {e.preferred_inspection_date && (
                  <p className="sm:col-span-2">
                    <span className="text-slate">Preferred inspection:</span>{" "}
                    <span className="text-ink">
                      {e.preferred_inspection_date}
                      {e.preferred_inspection_time && ` at ${e.preferred_inspection_time}`}
                    </span>
                  </p>
                )}
              </div>

              <p className="text-sm text-ink-soft bg-parchment-dim border hairline p-3">
                {e.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
