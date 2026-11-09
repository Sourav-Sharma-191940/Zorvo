import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

/** Page-level hero: large title + subtitle on the left, primary actions on the right. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div>
        <h1>{title}</h1>
        <p className="mt-1 max-w-80 text-md text-muted-foreground sm:max-w-none">{subtitle}</p>
      </div>
      {actions && (
        <div className="flex w-full items-center gap-2 *:flex-1 sm:w-auto sm:*:flex-none">
          {actions}
        </div>
      )}
    </div>
  );
}

/** Heading row at the top of a card section (title + subtitle, optional trailing action). */
export function CardHeader({
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
    <div
      className={cn(
        "flex min-h-13.5 items-center justify-between gap-4 px-3 py-2.5 sm:min-h-14.5 sm:px-4 sm:py-2.75",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h3>{title}</h3>
        {subtitle && <span className="text-2xs text-subtle-foreground">{subtitle}</span>}
      </div>
      {action}
    </div>
  );
}

/** Filter row under a page header, e.g. "Overview for [period]". */
export function PeriodRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-8.5 items-center gap-2.5 text-sm font-medium text-subtle-foreground">
      <span>{label}</span>
      {children}
    </div>
  );
}
