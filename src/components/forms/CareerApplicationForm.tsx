"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  submitApplicationAction,
} from "@/server/actions/applications";
import { initialApplicationState } from "@/server/actions/form-state";
import { SubmitButton } from "./SubmitButton";
import { TurnstileWidget } from "./TurnstileWidget";

export interface CareerOption {
  id: string;
  title: string;
}

export function CareerApplicationForm({
  careers,
  preselected,
}: {
  careers: CareerOption[];
  preselected?: CareerOption;
}) {
  const [state, formAction] = useActionState(
    submitApplicationAction,
    initialApplicationState
  );
  // See the equivalent comment in EnquiryForm.tsx — must be set via a ref
  // after mount, not React state or a render-time value.
  const renderedAtRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renderedAtRef.current) renderedAtRef.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div className="border hairline bg-white p-6 flex items-start gap-3">
        <CheckCircle2 size={20} className="text-forest shrink-0 mt-0.5" />
        <p className="text-sm text-ink">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" encType="multipart/form-data">
      {state.status === "error" && state.message && (
        <div className="flex items-start gap-2.5 border border-red-300 bg-red-50 text-red-800 px-4 py-3 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <input type="hidden" name="renderedAt" defaultValue={0} ref={renderedAtRef} />

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="app-website">Website</label>
        <input type="text" id="app-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {preselected ? (
        <>
          <input type="hidden" name="careerId" value={preselected.id} />
          <input type="hidden" name="jobTitle" value={preselected.title} />
          <p className="text-sm text-slate">
            Applying for: <span className="text-ink">{preselected.title}</span>
          </p>
        </>
      ) : (
        <div>
          <label htmlFor="jobTitle" className="block text-sm text-ink-soft mb-1.5">
            Position
          </label>
          <select
            id="jobTitle"
            name="jobTitle"
            required
            defaultValue=""
            onChange={(e) => {
              const form = e.currentTarget.form;
              const opt = e.currentTarget.selectedOptions[0];
              const hidden = form?.elements.namedItem("careerId") as HTMLInputElement | null;
              if (hidden) hidden.value = opt?.dataset.id ?? "";
            }}
            className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
          >
            <option value="" disabled>
              Select a position
            </option>
            {careers.map((c) => (
              <option key={c.id} value={c.title} data-id={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <input type="hidden" name="careerId" />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" name="name" required />
        <Field label="Phone number" name="phone" type="tel" required />
      </div>
      <Field label="Email address" name="email" type="email" required />

      <div>
        <label htmlFor="coverMessage" className="block text-sm text-ink-soft mb-1.5">
          Cover message
        </label>
        <textarea
          id="coverMessage"
          name="coverMessage"
          required
          rows={5}
          placeholder="Tell us why you'd be a good fit for this role."
          className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
        />
      </div>

      <div>
        <label htmlFor="resume" className="block text-sm text-ink-soft mb-1.5">
          CV / resume (optional — PDF or Word, up to 5MB)
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="w-full border hairline bg-white px-4 py-2.5 text-sm text-ink file:mr-4 file:border-0 file:bg-parchment-dim file:px-3 file:py-1.5 file:text-xs"
        />
      </div>

      <TurnstileWidget />

      <SubmitButton label="Submit application" />
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
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
        required={required}
        className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
      />
    </div>
  );
}
