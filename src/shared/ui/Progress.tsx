import { cn } from "@/shared/lib/utils";

/** Thin progress bar (0–100). Width is inline so any value renders exactly. */
export function Progress({
  value,
  label,
  className,
}: {
  value: number;
  /** Accessible name, e.g. "Home Loan repaid". */
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("block h-1.25 w-full overflow-hidden rounded-xs bg-secondary", className)}
    >
      <span className="block h-full rounded-xs bg-primary-accent" style={{ width: `${clamped}%` }} />
    </span>
  );
}
