"use client";

import { ChevronRight, FileClock, Landmark, Pencil, ReceiptIndianRupee, Trash2 } from "lucide-react";
import { Badge, Button, IconTile, Overline } from "@/shared/ui/primitives";
import { DetailsDrawer } from "@/shared/ui/DetailsDrawer";
import { InfoTile } from "@/shared/ui/layout";
import { Progress } from "@/shared/ui/Progress";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { formatCurrency, type Loan } from "../data";

export function LoanDrawer({
  loan,
  onClose,
  onSchedule,
  onRepay,
  onDelete,
}: {
  loan: Loan;
  onClose: () => void;
  onSchedule: () => void;
  onRepay: () => void;
  onDelete: () => void;
}) {
  return (
    <DetailsDrawer
      label={`${loan.name} details`}
      icon={
        <IconTile size="lg">
          <Landmark size="1.4375rem" />
        </IconTile>
      }
      title={loan.name}
      subtitle={loan.lender}
      badges={
        <>
          <Badge tone="indigo">{loan.type}</Badge>
          <StatusBadge status={loan.status} />
        </>
      }
      detailsTitle="Loan information"
      details={[
        { label: "Original principal", value: formatCurrency(loan.original) },
        { label: "Annual interest rate", value: `${loan.rate}% p.a.` },
        { label: "Monthly EMI", value: formatCurrency(loan.emi) },
        { label: "Loan period", value: `${loan.start} – ${loan.end}` },
        { label: "Tenure", value: loan.tenure },
        { label: "Next EMI due", value: loan.due },
      ]}
      footer={
        <>
          <div className="mt-4 grid grid-cols-2 gap-2.25">
            <InfoTile label="Principal repaid" value={formatCurrency(loan.original - loan.outstanding)} />
            <InfoTile label="Next payment" value={formatCurrency(loan.emi)} />
          </div>
          <button
            type="button"
            onClick={onSchedule}
            className="mt-2.5 grid min-h-14.5 w-full grid-cols-[auto_1fr_auto] items-center gap-2.25 rounded-md border border-border bg-card px-2.5 py-2 text-left text-subtle-foreground transition hover:border-primary-muted hover:bg-primary-soft"
          >
            <IconTile className="size-8">
              <FileClock size="1.0625rem" />
            </IconTile>
            <span className="flex flex-col gap-0.75">
              <strong className="text-2xs text-foreground">View EMI schedule</strong>
              <small className="text-3xs">Installments, components, and payment status</small>
            </span>
            <ChevronRight size="1rem" />
          </button>
        </>
      }
      notes={loan.notes}
      onClose={onClose}
      actions={
        <>
          <Button onClick={onRepay}>
            <ReceiptIndianRupee size="0.9375rem" />
            Record repayment
          </Button>
          <Button variant="secondary">
            <Pencil size="0.9375rem" />
            Edit loan
          </Button>
          <Button variant="danger-ghost" onClick={onDelete}>
            <Trash2 size="0.9375rem" />
            Delete loan
          </Button>
        </>
      }
    >
      <div className="mt-5 flex flex-col rounded-md bg-muted p-3.75">
        <Overline>Outstanding principal</Overline>
        <strong className="mt-1.25 mb-2.5 text-4xl tracking-tight">{formatCurrency(loan.outstanding)}</strong>
        <Progress value={loan.progress} label={`${loan.name} repaid`} />
        <small className="mt-1.5 text-3xs text-subtle-foreground">
          {loan.progress}% repaid · {loan.remaining} installments remaining
        </small>
      </div>
    </DetailsDrawer>
  );
}
