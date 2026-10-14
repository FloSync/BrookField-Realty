import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border hairline py-20 px-6 text-center">
      <p className="font-serif text-xl text-ink">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-slate">{description}</p>
      )}
      {action}
    </div>
  );
}
