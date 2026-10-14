"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 bg-ink text-parchment px-6 py-3 text-sm font-medium hover:bg-ink-soft disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Sending…" : label}
    </button>
  );
}
