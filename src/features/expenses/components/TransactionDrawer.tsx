"use client";

import { ArrowDownRight, ArrowUpRight, Copy, Pencil, Trash2 } from "lucide-react";
import { Badge, Button, IconTile } from "@/shared/ui/primitives";
import { DetailsDrawer } from "@/shared/ui/DetailsDrawer";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { cn } from "@/shared/lib/utils";
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
        <IconTile tone={isIncome ? "emerald" : "indigo"} size="lg">
          {isIncome ? <ArrowUpRight size="1.375rem" /> : <ArrowDownRight size="1.375rem" />}
        </IconTile>
      }
      title={transaction.description}
      badges={
        <>
          <Badge tone="slate">{transaction.category}</Badge>
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
          <Button variant="danger-ghost" onClick={onDelete}>
            <Trash2 size="0.9375rem" />
            Delete
          </Button>
        </>
      }
    >
      <div
        className={cn(
          "mt-5.5 rounded-md p-4 text-4xl font-bold tracking-tight",
          isIncome ? "bg-success-soft text-success" : "bg-muted text-foreground",
        )}
      >
        {isIncome ? "+" : "−"} {formatCurrency(transaction.amount)}
      </div>
    </DetailsDrawer>
  );
}
