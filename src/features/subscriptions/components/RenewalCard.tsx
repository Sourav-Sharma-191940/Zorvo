import { Button } from "@/shared/ui/primitives";
import { cn } from "@/shared/lib/utils";
import { formatCurrency, type Subscription } from "../data";
import { ServiceLogo } from "./ServiceLogo";

/** One upcoming payment. `urgent` highlights renewals due soonest. */
export function RenewalCard({
  item,
  urgent,
  dueLabel,
  onView,
}: {
  item: Subscription;
  urgent: boolean;
  dueLabel: string;
  onView: () => void;
}) {
  return (
    <article
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 rounded-lg border border-border bg-card p-3.25 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:gap-y-0",
        urgent && "border-warning-border bg-warning-row",
      )}
    >
      <ServiceLogo item={item} small />
      <span className="flex min-w-0 flex-col gap-0.75">
        <strong className="truncate text-sm font-bold">{item.name}</strong>
        <small className="truncate text-3xs text-subtle-foreground">
          {item.frequency} · {item.plan}
        </small>
      </span>
      <span className="flex flex-col gap-0.75 max-sm:col-start-2 max-sm:row-start-2 sm:text-right">
        <strong className="text-xs">{item.renewal.replace(" 2026", "")}</strong>
        <small className="text-3xs text-subtle-foreground">{dueLabel}</small>
      </span>
      <span className="flex flex-col items-end gap-0.75 max-sm:col-start-3 max-sm:row-span-2 max-sm:row-start-1">
        <strong className="text-sm">{formatCurrency(item.amount)}</strong>
        <Button variant="ghost" className="h-auto text-3xs" onClick={onView}>
          View details
        </Button>
      </span>
    </article>
  );
}
