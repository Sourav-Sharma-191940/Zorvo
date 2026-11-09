"use client";

import { ArrowDownRight, ArrowUpRight, Copy, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { DetailsDrawer } from "@/components/ui/DetailsDrawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, type Transaction } from "../data";

export function TransactionDrawer({
  transaction,
  onClose,
  onDelete,
}: {
  transaction: Transaction;
  onClose: () => void;
  onDelete: () => void;
}) {
  const isIncome = transaction.type === "Income";
  return (
    <DetailsDrawer
      label={`${transaction.description} details`}
      icon={
        <span className={`drawer-icon ${isIncome ? "positive" : ""}`.trim()}>
          {isIncome ? <ArrowUpRight size="1.375rem" /> : <ArrowDownRight size="1.375rem" />}
        </span>
      }
      title={transaction.description}
      badges={
        <>
          <span className="badge badge-slate">{transaction.category}</span>
          <StatusBadge
            status={transaction.type}
            tone={isIncome ? "emerald" : "indigo"}
            dot={false}
          />
        </>
      }
      detailsTitle="Transaction information"
      details={[
        { label: "Merchant", value: transaction.merchant },
        { label: "Date", value: transaction.date },
        { label: "Payment method", value: transaction.payment },
        { label: "Category", value: transaction.category },
      ]}
      notes={transaction.notes || "No notes were added to this transaction."}
      onClose={onClose}
      actions={
        <>
          <Button>
            <Pencil size="0.9375rem" />
            Edit transaction
          </Button>
          <Button variant="secondary">
            <Copy size="0.9375rem" />
            Duplicate
          </Button>
          <Button variant="ghost" className="danger-text" onClick={onDelete}>
            <Trash2 size="0.9375rem" />
            Delete
          </Button>
        </>
      }
    >
      <div className={`drawer-amount ${isIncome ? "positive" : ""}`.trim()}>
        {isIncome ? "+" : "−"} {formatCurrency(transaction.amount)}
      </div>
    </DetailsDrawer>
  );
}
