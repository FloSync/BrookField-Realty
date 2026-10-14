import type { AdminTeamMember } from "@/server/db/admin-types";

export function TeamMemberForm({
  member,
  action,
}: {
  member?: AdminTeamMember;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name" name="name" defaultValue={member?.name} required />
        <Field label="Position" name="position" defaultValue={member?.position} required />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm text-ink-soft mb-1.5">
          Biography
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={member?.bio}
          required
          className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Photo URL" name="photoUrl" defaultValue={member?.photoUrl} placeholder="https://…" />
        <Field
          label="Display order"
          name="displayOrder"
          type="number"
          defaultValue={member?.displayOrder ?? 0}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="published"
          defaultChecked={member?.published ?? true}
          className="accent-brass"
        />
        Published (visible on site)
      </label>

      <button
        type="submit"
        className="bg-ink text-parchment px-6 py-3 text-sm font-medium hover:bg-ink-soft"
      >
        {member ? "Save changes" : "Add team member"}
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
