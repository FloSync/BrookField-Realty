"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitEnquiryAction } from "@/server/actions/enquiries";
import { initialEnquiryState } from "@/server/actions/form-state";
import { SubmitButton } from "./SubmitButton";
import { TurnstileWidget } from "./TurnstileWidget";

export interface EnquiryPropertyOption {
  slug: string;
  title: string;
}

interface EnquiryFormProps {
  mode: "general" | "property" | "inspection" | "investment";
  property?: EnquiryPropertyOption;
  /** Contact page only: lets the visitor optionally name a property of
   * interest when they didn't arrive from that property's page. */
  propertyOptions?: EnquiryPropertyOption[];
  /** Contact page: visitor chooses enquiry type (general, property, etc.). */
  showEnquiryTypePicker?: boolean;
  title?: string;
  submitLabel?: string;
  /** Pre-filled message body (property detail pages). */
  defaultMessage?: string;
}

export function EnquiryForm({
  mode,
  property,
  propertyOptions,
  showEnquiryTypePicker = false,
  title,
  submitLabel = "Submit enquiry",
  defaultMessage,
}: EnquiryFormProps) {
  const [state, formAction] = useActionState(submitEnquiryAction, initialEnquiryState);
  // Set purely client-side after mount via a ref, not React state — this
  // page can be served from a 5-minute ISR cache, so a value baked in at
  // render time (or set via setState in an effect) would either reflect
  // the last build/revalidation rather than the actual visitor's
  // page-load time (defeating the timing check in
  // src/server/spam-guard.ts) or trigger a hydration mismatch.
  const renderedAtRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renderedAtRef.current) renderedAtRef.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div className="border hairline bg-white p-6 flex items-start gap-3">
        <CheckCircle2 size={20} className="text-forest shrink-0 mt-0.5" />
        <p className="text-sm text-ink">
          {state.message ??
            "Thank you. Your enquiry has been received. A member of the Brookfield team will contact you shortly."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {title && <h3 className="font-serif text-xl text-ink">{title}</h3>}

      {state.status === "error" && state.message && (
        <div className="flex items-start gap-2.5 border border-red-300 bg-red-50 text-red-800 px-4 py-3 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {showEnquiryTypePicker ? (
        <div>
          <label htmlFor="enquiryType" className="block text-sm text-ink-soft mb-1.5">
            Enquiry type
          </label>
          <select
            id="enquiryType"
            name="enquiryType"
            defaultValue="general"
            className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
            required
          >
            <option value="general">General enquiry</option>
            <option value="property">Property enquiry</option>
            <option value="investment">Investment enquiry</option>
          </select>
        </div>
      ) : (
        <input type="hidden" name="enquiryType" value={mode} />
      )}
      <input type="hidden" name="renderedAt" defaultValue={0} ref={renderedAtRef} />
      {property && <input type="hidden" name="propertySlug" value={property.slug} />}

      {/* Honeypot — visually hidden, never filled by a real visitor */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {property && (
        <p className="text-sm text-slate">
          Regarding: <span className="text-ink">{property.title}</span>
        </p>
      )}

      {!property && propertyOptions && propertyOptions.length > 0 && (
        <div>
          <label htmlFor="propertySlug-picker" className="block text-sm text-ink-soft mb-1.5">
            Property of interest (optional)
          </label>
          <select
            id="propertySlug-picker"
            name="propertySlug"
            defaultValue=""
            className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
          >
            <option value="">Not property-specific</option>
            {propertyOptions.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full name" name="name" required />
        <Field label="Phone number" name="phone" type="tel" required />
      </div>
      <Field label="Email address" name="email" type="email" required />

      {mode === "inspection" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label="Preferred date"
            name="preferredInspectionDate"
            type="date"
            required
          />
          <Field label="Preferred time" name="preferredInspectionTime" type="time" />
        </div>
      )}

      <div>
        <label htmlFor={`message-${mode}`} className="block text-sm text-ink-soft mb-1.5">
          {mode === "inspection" ? "Additional message (optional)" : "Message"}
        </label>
        <textarea
          id={`message-${mode}`}
          name="message"
          required={mode !== "inspection"}
          rows={4}
          defaultValue={defaultMessage}
          placeholder={
            mode === "inspection"
              ? "Anything else Brookfield should know before the visit."
              : undefined
          }
          className="w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass"
        />
      </div>

      <TurnstileWidget />

      <SubmitButton
        label={submitLabel ?? (mode === "inspection" ? "Request inspection" : "Send enquiry")}
      />
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
