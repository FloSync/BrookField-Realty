"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
export interface ContactFormProps {
  defaultSubject?: string;
  defaultMessage?: string;
  submitLabel?: string;
}

interface FormFields {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function validate(fields: FormFields): Partial<Record<keyof FormFields, string>> {
  const errors: Partial<Record<keyof FormFields, string>> = {};
  if (!fields.name.trim()) errors.name = "Please enter your name.";
  if (!fields.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!fields.phone.trim()) errors.phone = "Please enter a phone number.";
  if (!fields.subject.trim()) errors.subject = "Please enter a subject.";
  if (!fields.message.trim()) errors.message = "Please enter a message.";
  return errors;
}

export function ContactForm({
  defaultSubject = "",
  defaultMessage = "",
  submitLabel = "Send message",
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    subject: defaultSubject,
    message: defaultMessage,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border hairline bg-white p-6 flex items-start gap-3">
        <CheckCircle2 size={20} className="text-forest shrink-0 mt-0.5" />
        <div className="text-sm text-ink space-y-2">
          <p>
            Thank you. Your message has been captured for this demo preview.
            Brookfield will connect this form to email or CRM in a later phase.
          </p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border hairline bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-brass";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 noValidate">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name" id="contact-name" error={errors.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Email" id="contact-email" error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Phone" id="contact-phone" error={errors.phone}>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={fields.phone}
          onChange={(e) => setFields((f) => ({ ...f, phone: e.target.value }))}
          className={inputClass}
        />
      </Field>
      <Field label="Subject" id="contact-subject" error={errors.subject}>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={fields.subject}
          onChange={(e) => setFields((f) => ({ ...f, subject: e.target.value }))}
          className={inputClass}
        />
      </Field>
      <Field label="Message" id="contact-message" error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={fields.message}
          onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
          className={`${inputClass} resize-y min-h-[120px]`}
        />
      </Field>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-ink text-parchment px-6 py-3 text-sm font-medium hover:bg-ink-soft transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-slate mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
