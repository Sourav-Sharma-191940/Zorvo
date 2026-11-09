"use client";

import { ChevronDown, FileClock, Landmark, Pencil, ReceiptIndianRupee, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/primitives";
import { DetailsDrawer } from "@/shared/ui/DetailsDrawer";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { formatCurrency, type Loan } from "../data";
import { ProgressBar } from "./ProgressBar";

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
        <span className="drawer-icon">
          <Landmark size="1.4375rem" />
        </span>
      }
      title={loan.name}
      subtitle={loan.lender}
      badges={
        <>
          <span className="badge badge-indigo">{loan.type}</span>
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
          <div className="loan-repayment-summary">
            <span>
              <small>Principal repaid</small>
              <strong>{formatCurrency(loan.original - loan.outstanding)}</strong>
            </span>
            <span>
              <small>Next payment</small>
              <strong>{formatCurrency(loan.emi)}</strong>
            </span>
          </div>
          <button type="button" className="loan-schedule-entry" onClick={onSchedule}>
            <span className="icon-tile icon-indigo">
              <FileClock size="1.0625rem" />
            </span>
            <span>
              <strong>View EMI schedule</strong>
              <small>Installments, components, and payment status</small>
            </span>
            <ChevronDown size="1rem" />
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
          <Button variant="ghost" className="danger-text" onClick={onDelete}>
            <Trash2 size="0.9375rem" />
            Delete loan
          </Button>
        </>
      }
    >
      <div className="loan-balance-panel">
        <span>Outstanding principal</span>
        <strong>{formatCurrency(loan.outstanding)}</strong>
        <div>
          <ProgressBar progress={loan.progress} />
        </div>
        <small>
          {loan.progress}% repaid · {loan.remaining} installments remaining
        </small>
      </div>
    </DetailsDrawer>
  );
}
