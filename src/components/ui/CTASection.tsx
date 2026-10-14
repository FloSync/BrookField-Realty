import { Button } from "./Button";

interface CTASectionProps {
  title: string;
  description?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="bg-ink text-parchment">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="max-w-lg">
          <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
          {description && (
            <p className="mt-3 text-parchment/70 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Button href={primaryHref} variant="primary" className="!bg-brass !text-ink hover:!bg-brass-light">
            {primaryLabel}
          </Button>
          {secondaryLabel && secondaryHref && (
            <Button
              href={secondaryHref}
              variant="secondary"
              className="!border-parchment/40 !text-parchment hover:!bg-parchment hover:!text-ink"
            >
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
