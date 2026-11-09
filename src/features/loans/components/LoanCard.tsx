import { CalendarClock, Landmark } from "lucide-react";
import { Button, IconTile, Overline } from "@/shared/ui/primitives";
import { Progress } from "@/shared/ui/Progress";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { formatCurrency, type Loan } from "../data";

/** Portfolio card for one loan: balance, repayment progress, rate/EMI, next due date. */
export function LoanCard({
  loan,
  onOpen,
  onSchedule,
}: {
  loan: Loan;
  onOpen: () => void;
  onSchedule: () => void;
}) {
  return (
    <article
      onClick={onOpen}
      className="min-w-0 cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-card transition hover:-translate-y-px hover:border-primary-muted hover:shadow-raised sm:shadow-none"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.25 px-3.25 pt-3.25 pb-2.75">
        <IconTile>
          <Landmark size="1.1875rem" />
        </IconTile>
        <span className="flex min-w-0 flex-col gap-0.75">
          {/* The card is clickable; this button gives keyboard/screen-reader users the same action. */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            className="truncate text-left text-sm font-bold outline-none focus-visible:underline"
          >
            {loan.name}
          </button>
          <small className="text-2xs text-subtle-foreground">{loan.lender}</small>
        </span>
        <StatusBadge status={loan.status} />
      </div>

      <div className="flex flex-col border-y border-border bg-muted p-3.25">
        <Overline>Outstanding principal</Overline>
        <strong className="mt-1.25 text-3xl leading-6 tracking-tight">{formatCurrency(loan.outstanding)}</strong>
        <small className="mt-0.5 text-3xs text-subtle-foreground">of {formatCurrency(loan.original)}</small>
      </div>

      <div className="flex items-center gap-2.25 px-3.25 pt-3 pb-1">
        <Progress value={loan.progress} label={`${loan.name} repaid`} className="flex-1" />
        <span className="text-3xs whitespace-nowrap text-subtle-foreground">{loan.progress}% repaid</span>
      </div>

      <div className="grid grid-cols-2 px-3.25 pt-2.25 pb-3">
        <span className="flex flex-col gap-1">
          <small className="text-3xs text-subtle-foreground">Interest rate</small>
          <strong className="text-xs font-bold">{loan.rate}% p.a.</strong>
        </span>
        <span className="flex flex-col gap-1 border-l border-border pl-3">
          <small className="text-3xs text-subtle-foreground">Monthly EMI</small>
          <strong className="text-xs font-bold">{formatCurrency(loan.emi)}</strong>
        </span>
      </div>

      <div className="flex min-h-13.5 items-center justify-between gap-2 border-t border-border px-3.25 py-2.25">
        <span className="flex items-center gap-1.75 text-warning">
          <CalendarClock size="0.9375rem" />
          <span className="flex flex-col gap-0.5">
            <small className="text-3xs text-subtle-foreground">Next EMI due</small>
            <strong className="text-2xs text-foreground">{loan.due}</strong>
          </span>
        </span>
        <Button
          variant="ghost"
          className="h-auto py-1.25 text-3xs"
          onClick={(event) => {
            event.stopPropagation();
            onSchedule();
          }}
        >
          View schedule
        </Button>
      </div>
    </article>
  );
}
