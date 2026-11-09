"use client";

import { useState } from "react";
import { FileClock } from "lucide-react";
import { FormModal } from "@/shared/ui/FormModal";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { formatCurrency, type Loan } from "../data";
import { useLoanSchedule } from "../hooks";

const filters = ["All installments", "Upcoming", "Paid", "Overdue"];

export function ScheduleModal({ loan, onClose }: { loan: Loan; onClose: () => void }) {
  const [filter, setFilter] = useState("All installments");
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
      <div className="schedule-summary">
        <span>
          <small>Monthly EMI</small>
          <strong>{formatCurrency(loan.emi)}</strong>
        </span>
        <span>
          <small>Outstanding</small>
          <strong>{formatCurrency(loan.outstanding)}</strong>
        </span>
        <span>
          <small>Remaining</small>
          <strong>{loan.remaining} installments</strong>
        </span>
      </div>
      <div className="schedule-toolbar">
        <div>
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <small>Illustrative allocations until calculated by the backend.</small>
      </div>
      {isLoading ? (
        <div className="schedule-loading">
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : shown.length === 0 ? (
        <div className="schedule-empty">
          <FileClock size="1.375rem" />
          <strong>No {filter.toLowerCase()} installments</strong>
          <span>There are no schedule entries with this status.</span>
        </div>
      ) : (
        <div className="schedule-table-wrap">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Installment</th>
                <th>Due date</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Total EMI</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((item) => (
                <tr key={item.number}>
                  <td>#{item.number}</td>
                  <td>{item.date}</td>
                  <td>{formatCurrency(item.principal)}</td>
                  <td>{formatCurrency(item.interest)}</td>
                  <td>{formatCurrency(item.total)}</td>
                  <td>{formatCurrency(item.balance)}</td>
                  <td>
                    <StatusBadge status={item.status} dot={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="schedule-footer">
        <span>
          Showing {shown.length} of {loan.remaining} installments
        </span>
        <div>
          <button type="button" disabled>
            Previous
          </button>
          <span>1</span>
          <button type="button">Next</button>
        </div>
      </div>
    </FormModal>
  );
}
