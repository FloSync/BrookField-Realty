import type { AdminProperty } from "@/server/db/admin-types";

export function PropertyForm({
  property,
  action,
}: {
  property?: AdminProperty;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Title" name="title" defaultValue={property?.title} required />
        <Field label="Slug (URL)" name="slug" defaultValue={property?.slug} required />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field
          label="Property type"
          name="propertyType"
          defaultValue={property?.propertyType}
          placeholder="e.g. 4-Bedroom Detached Duplex"
          required
        />
        <SelectField
          label="Category"
          name="category"
          defaultValue={property?.category ?? "residential"}
          options={[
            ["residential", "Residential"],
            ["commercial", "Commercial"],
            ["land", "Land"],
            ["investment", "Investment"],
          ]}
        />
        <SelectField
          label="Availability"
          name="availability"
          defaultValue={property?.availability ?? "available"}
          options={[
            ["available", "Available"],
            ["reserved", "Reserved"],
            ["sold", "Sold"],
          ]}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Location" name="location" defaultValue={property?.location} required />
        <Field label="State" name="state" defaultValue={property?.state} required />
        <Field label="Address (optional)" name="address" defaultValue={property?.address} />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field
          label="Price"
          name="price"
          type="number"
          defaultValue={property?.price}
          required
        />
        <SelectField
          label="Currency"
          name="currency"
          defaultValue={property?.currency ?? "NGN"}
          options={[
            ["NGN", "NGN"],
            ["USD", "USD"],
          ]}
        />
        <Field
          label="Price note (optional)"
          name="priceNote"
          defaultValue={property?.priceNote}
          placeholder="e.g. per plot"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm text-ink-soft mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={property?.description}
          required
          className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
        />
      </div>

      <div className="grid sm:grid-cols-4 gap-5">
        <Field
          label="Bedrooms"
          name="bedrooms"
          type="number"
          defaultValue={property?.bedrooms}
        />
        <Field
          label="Bathrooms"
          name="bathrooms"
          type="number"
          defaultValue={property?.bathrooms}
        />
        <Field
          label="Land size"
          name="landSize"
          defaultValue={property?.landSize}
          placeholder="e.g. 600 sqm"
        />
        <Field
          label="Building size"
          name="buildingSize"
          defaultValue={property?.buildingSize}
        />
      </div>

      <div>
        <label htmlFor="features" className="block text-sm text-ink-soft mb-1.5">
          Features (one per line)
        </label>
        <textarea
          id="features"
          name="features"
          rows={4}
          defaultValue={property?.features.join("\n")}
          className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
        />
      </div>

      <div>
        <label htmlFor="paymentPlan" className="block text-sm text-ink-soft mb-1.5">
          Payment plan (optional)
        </label>
        <textarea
          id="paymentPlan"
          name="paymentPlan"
          rows={2}
          defaultValue={property?.paymentPlan}
          className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <Checkbox label="Featured on homepage" name="featured" defaultChecked={property?.featured} />
        <Checkbox label="Published (visible on site)" name="published" defaultChecked={property?.published ?? true} />
        <Checkbox
          label="Inspections available"
          name="inspectionAvailable"
          defaultChecked={property?.inspectionAvailable ?? true}
        />
      </div>

      <button
        type="submit"
        className="bg-ink text-parchment px-6 py-3 text-sm font-medium hover:bg-ink-soft"
      >
        {property ? "Save changes" : "Create property"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-ink-soft mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full border hairline bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brass"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: [string, string][];
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-ink-soft mb-1.5">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full border hairline bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brass"
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="accent-brass" />
      {label}
    </label>
  );
}
