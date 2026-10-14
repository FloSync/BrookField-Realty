import type { AdminProject } from "@/server/db/admin-types";

export function ProjectForm({
  project,
  action,
}: {
  project?: AdminProject;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name" name="name" defaultValue={project?.name} required />
        <Field label="Slug (URL)" name="slug" defaultValue={project?.slug} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Location" name="location" defaultValue={project?.location} required />
        <div>
          <label htmlFor="status" className="block text-sm text-ink-soft mb-1.5">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={project?.status ?? "Coming Soon"}
            className="w-full border hairline bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brass"
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Coming Soon">Coming Soon</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm text-ink-soft mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={project?.description}
          required
          className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Image URL" name="imageUrl" defaultValue={project?.imageUrl} placeholder="https://…" />
        <Field
          label="Units info (optional)"
          name="unitsInfo"
          defaultValue={project?.unitsInfo}
          placeholder="e.g. 220 plots, 60% allocated"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? true}
          className="accent-brass"
        />
        Published (visible on site)
      </label>

      <button
        type="submit"
        className="bg-ink text-parchment px-6 py-3 text-sm font-medium hover:bg-ink-soft"
      >
        {project ? "Save changes" : "Create project"}
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
