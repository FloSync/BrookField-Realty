import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-parchment hover:bg-ink-soft focus-visible:outline-brass",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-parchment focus-visible:outline-brass",
  ghost:
    "bg-transparent text-ink hover:text-brass underline underline-offset-4 decoration-line focus-visible:outline-brass",
};

const base =
  "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export function Button({
  children,
  variant = "primary",
  className = "",
  href,
  ...rest
}: BaseProps & { href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${base} ${variantClasses[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
