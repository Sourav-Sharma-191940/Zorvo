import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/**
 * Compact filter/sort dropdown for toolbars. Deliberately a native <select>:
 * phones get the OS picker, and it costs no JavaScript. `className` styles the
 * wrapper (width, flex); the select fills it.
 */
export function Select({
  value,
  onChange,
  children,
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <label className={cn("relative inline-flex h-8.5 items-center text-muted-foreground", className)}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="h-full w-full min-w-29 cursor-pointer appearance-none rounded-sm border border-border bg-card pr-7.25 pl-2.5 text-2xs font-semibold text-inherit outline-none transition focus:border-primary-accent focus:ring-3 focus:ring-ring"
      >
        {children}
      </select>
      <ChevronDown size="0.875rem" className="pointer-events-none absolute right-2.25" />
    </label>
  );
}
