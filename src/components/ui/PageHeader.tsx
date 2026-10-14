import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  crumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={`border-b hairline bg-parchment-dim${className ? ` ${className}` : ""}`}
    >
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-slate">
            {crumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="text-slate" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ink max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base md:text-lg text-slate leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
