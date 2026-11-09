import type { ComponentProps, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

/** Semantic colour tones shared by badges, icon tiles and status labels. */
export type Tone = "indigo" | "amber" | "rose" | "emerald" | "slate";

/* ── Button ──────────────────────────────────────────────────────────────── */

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.75 whitespace-nowrap rounded-md text-md font-semibold transition duration-150 disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "h-9.5 px-3.5 bg-primary text-primary-foreground shadow-card hover:-translate-y-px hover:bg-primary-hover",
        secondary:
          "h-8.5 px-2.5 border border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
        ghost: "h-7.5 px-0 bg-transparent text-primary hover:text-primary-strong",
        icon: "relative size-9.5 border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground max-sm:size-11",
        danger: "h-9.5 px-3.5 bg-destructive text-destructive-foreground hover:opacity-90",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

export function Button({
  variant,
  className,
  ariaLabel,
  type = "button",
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Shorthand for aria-label (icon-only buttons must have one). */
    ariaLabel?: string;
    /** Render the styles on the child element instead, e.g. a <Link>. */
    asChild?: boolean;
  }) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      type={asChild ? undefined : type}
      aria-label={ariaLabel ?? props["aria-label"]}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

/* ── Card ────────────────────────────────────────────────────────────────── */

export function Card({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-lg border border-border bg-card text-card-foreground shadow-card", className)}
      {...props}
    />
  );
}

/* ── Badge ───────────────────────────────────────────────────────────────── */

export const badgeVariants = cva(
  "inline-flex w-fit items-center justify-center gap-0.75 whitespace-nowrap text-2xs leading-3 font-semibold",
  {
    variants: {
      tone: {
        indigo: "bg-primary-soft text-primary-strong",
        amber: "bg-warning-soft text-warning",
        rose: "bg-destructive-soft text-destructive",
        emerald: "bg-success-soft text-success",
        slate: "bg-secondary text-muted-foreground",
      },
      shape: {
        rounded: "rounded-xs px-1.75 py-1",
        pill: "rounded-full px-2.25 py-1",
      },
    },
    defaultVariants: { tone: "slate", shape: "rounded" },
  },
);

export function Badge({
  tone,
  shape,
  className,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, shape }), className)} {...props} />;
}

/* ── Icon tile (coloured square behind an icon) ──────────────────────────── */

export const iconTileVariants = cva("grid shrink-0 place-items-center", {
  variants: {
    tone: {
      indigo: "bg-primary-soft text-primary",
      amber: "bg-warning-soft text-warning",
      rose: "bg-destructive-soft text-destructive",
      emerald: "bg-success-soft text-success",
      slate: "bg-secondary text-muted-foreground",
    },
    size: {
      sm: "size-7.25 rounded-sm",
      md: "size-9 rounded-md",
      lg: "size-11.5 rounded-lg",
    },
  },
  defaultVariants: { tone: "indigo", size: "md" },
});

export function IconTile({
  tone,
  size,
  className,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof iconTileVariants>) {
  return <span className={cn(iconTileVariants({ tone, size }), className)} {...props} />;
}

/* ── Section header (title + subtitle + optional action, used inside cards) ─ */

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-9.5 items-start justify-between gap-4 max-sm:min-h-8.5", className)}>
      <div>
        <h3>{title}</h3>
        {subtitle && <p className="mt-0.75 text-xs text-subtle-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
