import { CheckCircle2, AlertCircle } from "lucide-react";

export function Banner({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  if (!success && !error) return null;
  const isError = !!error;
  return (
    <div
      className={`mb-6 flex items-start gap-2.5 border px-4 py-3 text-sm ${
        isError
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-forest/30 bg-forest/5 text-forest"
      }`}
    >
      {isError ? (
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
      ) : (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
      )}
      <span>{error || success}</span>
    </div>
  );
}
