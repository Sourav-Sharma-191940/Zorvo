import { StatusBadge } from "@/shared/ui/StatusBadge";
import { formatCurrency, type Subscription } from "../data";
import { ServiceLogo } from "./ServiceLogo";

/** Grid-view card for one subscription; the whole card opens the details drawer. */
export function SubscriptionGridCard({
  item,
  onOpen,
}: {
  item: Subscription;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex min-w-0 cursor-pointer flex-col gap-2 rounded-lg border border-border bg-card p-3.5 text-left shadow-card transition hover:-translate-y-px hover:border-primary-muted hover:shadow-raised focus-visible:border-primary-accent focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none sm:shadow-none"
    >
      <span className="flex items-center justify-between">
        <ServiceLogo item={item} />
        <StatusBadge status={item.status} dot={false} />
      </span>
      <strong className="truncate text-md font-bold">{item.name}</strong>
      <small className="text-2xs text-subtle-foreground">
        {item.plan} · {item.category}
      </small>
      <span className="mt-1 grid grid-cols-2 gap-2 border-t border-border pt-2.75">
        <span className="flex min-w-0 flex-col gap-0.75">
          <small className="text-3xs text-subtle-foreground">Billing</small>
          <strong className="text-xs font-bold text-foreground">
            {formatCurrency(item.amount)} / {item.frequency.toLowerCase()}
          </strong>
        </span>
        <span className="flex min-w-0 flex-col gap-0.75">
          <small className="text-3xs text-subtle-foreground">Renews</small>
          <strong className="text-xs font-bold text-foreground">{item.renewal}</strong>
        </span>
      </span>
    </button>
  );
}
