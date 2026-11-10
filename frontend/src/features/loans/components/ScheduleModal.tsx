"use client";

import { useState } from "react";
import { FileClock } from "lucide-react";
import { FormModal } from "@/shared/ui/FormModal";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { EmptyState, FilterChips, InfoTile } from "@/shared/ui/layout";
import { DataTable, TBody, TD, TH, THead, TR } from "@/shared/ui/table";
import { formatCurrency, type Loan } from "../data";
import { useLoanSchedule } from "../hooks";

const filters = ["All installments", "Upcoming", "Paid", "Overdue"] as const;
type Filter = (typeof filters)[number];

export function ScheduleModal({ loan, onClose }: { loan: Loan; onClose: () => void }) {
  const [filter, setFilter] = useState<Filter>("All installments");
  const { data: schedule = [], isLoading } = useLoanSchedule(loan.id);

  const shown = schedule.filter((item) =>
    filter === "All installments"
      ? true
      : filter === "Upcoming"
        ? ["Upcoming", "Due soon"].includes(item.status)
        : item.status === filter,
  );

  return (
    <FormModal
      title="EMI schedule"
      subtitle={`${loan.name} · ${loan.lender}`}
      label={`${loan.name} EMI schedule`}
      size="lg"
      onClose={onClose}
    >
      <div className="mb-3.5 grid grid-cols-2 gap-2.25 sm:grid-cols-3">
        <InfoTile label="Monthly EMI" value={formatCurrency(loan.emi)} />
        <InfoTile label="Outstanding" value={formatCurrency(loan.outstanding)} />
        <InfoTile label="Remaining" value={`${loan.remaining} installments`} className="max-sm:col-span-full" />
      </div>

      <div className="flex flex-col items-start gap-3 border-t border-border py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips options={filters} value={filter} onChange={setFilter} label="Filter installments" />
        <small className="text-3xs text-subtle-foreground">Illustrative allocations until calculated by the backend.</small>
      </div>

      <div className="overflow-hidden rounded-md border border-border">
        {isLoading ? (
          <div aria-label="Loading schedule" className="grid min-h-64 content-start">
            {[1, 2, 3, 4].map((row) => (
              <span key={row} className="mx-3 h-13 animate-pulse border-b border-border bg-muted" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <EmptyState
            compact
            icon={FileClock}
            title={`No ${filter.toLowerCase()} installments`}
            description="There are no schedule entries with this status."
            className="border-t-0"
          />
        ) : (
          <DataTable className="sm:min-w-197.5 sm:[&_td]:h-12.75">
            <THead>
              <TH>Installment</TH>
              <TH>Due date</TH>
              <TH>Principal</TH>
              <TH>Interest</TH>
              <TH>Total EMI</TH>
              <TH>Balance</TH>
              <TH>Status</TH>
            </THead>
            <TBody>
              {shown.map((item) => (
                <TR key={item.number}>
                  <TD primary className="font-semibold">
                    #{item.number}
                    <span className="sm:hidden"> · {item.date}</span>
                  </TD>
                  <TD label="Due date" hideOnMobile>
                    {item.date}
                  </TD>
                  <TD label="Principal">{formatCurrency(item.principal)}</TD>
                  <TD label="Interest">{formatCurrency(item.interest)}</TD>
                  <TD label="Total EMI">{formatCurrency(item.total)}</TD>
                  <TD label="Balance">{formatCurrency(item.balance)}</TD>
                  <TD label="Status">
                    <StatusBadge status={item.status} dot={false} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </DataTable>
        )}
        <div className="flex min-h-10.75 items-center justify-between border-t border-border px-3 text-3xs text-subtle-foreground">
          <span>
            Showing {shown.length} of {loan.remaining} installments
          </span>
          <div className="flex items-center gap-2">
            <button type="button" disabled className="disabled:opacity-60">
              Previous
            </button>
            <span className="grid size-5.75 place-items-center rounded-xs bg-primary-soft font-semibold text-primary-strong">
              1
            </span>
            <button type="button">Next</button>
          </div>
        </div>
      </div>
    </FormModal>
  );
}
