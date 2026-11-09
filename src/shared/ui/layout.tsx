"use client";

import type { ReactNode } from "react";
import { Grid2X2, List, Search, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { IconTile } from "./primitives";

/**
 * Root container for every feature page: one column that may shrink below its
 * content's width (so long text can't push the page past the screen on
 * phones), with consistent vertical rhythm from the theme.
 */
export function PageStack({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-(--page-gap) *:min-w-0", className)}>
      {children}
    </div>
  );
}

/** Empty / no-results state for a card section. `compact` for small panels. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-t border-border text-center",
        compact ? "min-h-47.5 text-subtle-foreground" : "min-h-70 p-7.5",
        className,
      )}
    >
      {compact ? (
        <Icon size="1.375rem" />
      ) : (
        <IconTile size="lg" className="mb-3">
          <Icon size="1.375rem" />
        </IconTile>
      )}
      <strong className={cn("text-foreground", compact ? "mt-2 text-sm" : "text-md")}>{title}</strong>
      {description && (
        <p
          className={cn(
            "max-w-77.5 text-subtle-foreground",
            compact ? "mt-1 text-2xs" : "mt-1.25 mb-3.5 text-xs leading-4",
          )}
        >
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

/** Search box used in feature toolbars. */
export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Accessible name; defaults to the placeholder. */
  label?: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex h-9 items-center gap-2 rounded-sm border border-border bg-muted px-2.5 text-subtle-foreground transition focus-within:border-primary-accent focus-within:bg-card focus-within:ring-3 focus-within:ring-ring",
        className,
      )}
    >
      <Search size="1rem" className="shrink-0" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className="w-full min-w-0 bg-transparent text-xs text-foreground outline-none placeholder:text-subtle-foreground [&::-webkit-search-cancel-button]:hidden"
      />
    </label>
  );
}

export type ViewMode = "list" | "grid";

/** List / grid view switch. */
export function ViewToggle({
  value,
  onChange,
  label = "Change view",
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  label?: string;
}) {
  const options: { mode: ViewMode; icon: LucideIcon; text: string }[] = [
    { mode: "list", icon: List, text: "List view" },
    { mode: "grid", icon: Grid2X2, text: "Grid view" },
  ];
  return (
    <div role="group" aria-label={label} className="flex h-8.5 rounded-sm border border-border bg-muted p-0.75">
      {options.map(({ mode, icon: Icon, text }) => (
        <button
          key={mode}
          type="button"
          aria-label={text}
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={cn(
            "grid w-7.25 place-items-center rounded-xs text-subtle-foreground transition",
            value === mode && "bg-card text-primary shadow-card",
          )}
        >
          <Icon size="0.875rem" />
        </button>
      ))}
    </div>
  );
}

/** Small label/value box, e.g. "Monthly EMI ₹28,450". */
export function InfoTile({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("flex flex-col gap-1.25 rounded-md border border-border bg-muted px-3 py-2.75", className)}>
      <small className="text-3xs text-subtle-foreground">{label}</small>
      <strong className="text-sm">{value}</strong>
    </span>
  );
}

/** Single-choice filter chips, e.g. "All · Upcoming · Paid". Scrolls sideways on phones. */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex max-w-full gap-1 overflow-x-auto [scrollbar-width:none]", className)}
    >
      {options.map((option) => (
        <button
          type="button"
          key={option}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "h-7 shrink-0 rounded-sm px-2.25 text-3xs font-semibold whitespace-nowrap text-muted-foreground transition hover:text-foreground",
            value === option && "bg-primary-soft text-primary-strong hover:text-primary-strong",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/** "Showing x of y" row with pager, at the bottom of a list card. */
export function TableFooter({ shown, total, noun }: { shown: number; total: number; noun: string }) {
  return (
    <div className="flex min-h-11.25 items-center justify-between border-t border-border px-4 text-2xs text-subtle-foreground">
      <span>
        Showing {shown} of {total} {noun}
      </span>
      <div className="flex items-center gap-2">
        <button type="button" disabled className="disabled:opacity-60">
          Previous
        </button>
        <span className="grid size-6 place-items-center rounded-xs bg-primary-soft font-semibold text-primary-strong">
          1
        </span>
        <button type="button" disabled className="disabled:opacity-60">
          Next
        </button>
      </div>
    </div>
  );
}
