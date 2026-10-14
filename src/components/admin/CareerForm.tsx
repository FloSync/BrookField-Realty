import type { AdminCareer } from "@/server/db/admin-types";

export function CareerForm({
  career,
  action,
}: {
  career?: AdminCareer;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Job title" name="title" defaultValue={career?.title} required />
        <Field label="Department" name="department" defaultValue={career?.department} required />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Location" name="location" defaultValue={career?.location} required />
        <div>
          <label htmlFor="employmentType" className="block text-sm text-ink-soft mb-1.5">
            Employment type
          </label>
          <select
            id="employmentType"
            name="employmentType"
            defaultValue={career?.employmentType ?? "Full-time"}
            className="w-full border hairline bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brass"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm text-ink-soft mb-1.5">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={career?.status ?? "draft"}
            className="w-full border hairline bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brass"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm text-ink-soft mb-1.5">
          Job description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={career?.description}
          required
          className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
        />
      </div>

      <div>
        <label htmlFor="requirements" className="block text-sm text-ink-soft mb-1.5">
          Requirements (one per line)
        </label>
        <textarea
          id="requirements"
          name="requirements"
          rows={4}
          defaultValue={career?.requirements.join("\n")}
          className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Application contact (optional)"
          name="applicationContact"
          defaultValue={career?.applicationContact}
          placeholder="careers@brookfieldrealty.ng"
        />
        <Field
          label="Application instructions (optional)"
          name="applicationInstructions"
          defaultValue={career?.applicationInstructions}
        />
      </div>

      <button
        type="submit"
        className="bg-ink text-parchment px-6 py-3 text-sm font-medium hover:bg-ink-soft"
      >
        {career ? "Save changes" : "Create vacancy"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full border hairline bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brass"
      />
    </div>
  );
}
