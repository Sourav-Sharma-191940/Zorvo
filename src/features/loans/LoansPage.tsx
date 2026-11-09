"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  CircleDollarSign,
  Download,
  Eye,
  Landmark,
  Plus,
  ReceiptIndianRupee,
  Search,
  TrendingDown,
  WalletCards,
} from "lucide-react";
import "./loans.css";
import { Button } from "@/shared/ui/primitives";
import { PageHeader, CardHeader } from "@/shared/ui/PageHeader";
import { exportCsv } from "@/shared/lib/export-csv";
import { formatCurrency, loanTypes, type Loan } from "./data";
import { useCreateLoan, useDeleteLoan, useLoans } from "./hooks";
import { Select } from "@/shared/ui/Select";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { Toast, useToast } from "@/shared/ui/Toast";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { StatCard } from "@/shared/ui/StatCard";
import { ProgressBar } from "./components/ProgressBar";
import { AddLoanModal } from "./components/AddLoanModal";
import { RepaymentModal } from "./components/RepaymentModal";
import { LoanDrawer } from "./components/LoanDrawer";
import { ScheduleModal } from "./components/ScheduleModal";

export function LoansPage() {
  const { data: loans = [] } = useLoans();
  const createLoan = useCreateLoan();
  const deleteLoan = useDeleteLoan();

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All loan types");
  const [status, setStatus] = useState("Active loans");
  const [lender, setLender] = useState("All lenders");
  const [sort, setSort] = useState("Next due date");
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Loan | null>(null);
  const [scheduleLoan, setScheduleLoan] = useState<Loan | null>(null);
  const [repaymentLoan, setRepaymentLoan] = useState<Loan | undefined>();
  const [deleting, setDeleting] = useState<Loan | null>(null);
  const { toast, notify } = useToast();

  const visible = useMemo(() => {
    const filtered = loans.filter(
      (loan) =>
        `${loan.name} ${loan.lender} ${loan.type}`.toLowerCase().includes(query.toLowerCase()) &&
        (type === "All loan types" || loan.type === type) &&
        (status === "All statuses" || (status === "Active loans" && loan.status === "Active")) &&
        (lender === "All lenders" || loan.lender === lender),
    );
    if (sort === "Outstanding balance")
      return [...filtered].sort((a, b) => b.outstanding - a.outstanding);
    if (sort === "Recently updated") return [...filtered].reverse();
    return filtered;
  }, [lender, loans, query, sort, status, type]);

  const saveLoan = (loan: Parameters<typeof createLoan.mutate>[0]) => {
    createLoan.mutate(loan);
    setAddOpen(false);
    notify("Loan added successfully");
  };

  const recordRepayment = () => {
    setRepaymentLoan(undefined);
    notify("Repayment recorded successfully");
  };

  const confirmDelete = () => {
    if (deleting) deleteLoan.mutate(deleting.id);
    setDeleting(null);
    notify("Loan deleted");
  };

  const exportLoans = () =>
    exportCsv("personal-command-center-loans", [
      [
        "Loan",
        "Lender",
        "Type",
        "Original Principal",
        "Outstanding",
        "Rate",
        "EMI",
        "Next Due",
        "Status",
      ],
      ...visible.map((loan) => [
        loan.name,
        loan.lender,
        loan.type,
        String(loan.original),
        String(loan.outstanding),
        String(loan.rate),
        String(loan.emi),
        loan.due,
        loan.status,
      ]),
    ]);

  const resetFilters = () => {
    setQuery("");
    setType("All loan types");
    setStatus("Active loans");
    setLender("All lenders");
  };

  return (
    <div className="page-stack loans-page">
      <PageHeader
        title="Loans & EMIs"
        subtitle="Track your loans, monitor outstanding balances, and manage repayments."
        actions={
          <>
            <Button variant="secondary" onClick={exportLoans}>
              <Download size="1rem" />
              Export
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus size="1rem" />
              Add loan
            </Button>
          </>
        }
      />

      <div className="period-row">
        <span>Portfolio view</span>
        <Select value={status} onChange={setStatus} label="Filter portfolio status">
          <option>Active loans</option>
          <option>All statuses</option>
        </Select>
      </div>

      <div className="stat-grid">
        <StatCard
          icon={CircleDollarSign}
          label="Total outstanding"
          value="₹8,42,600"
          detail="Remaining principal across active loans"
          tone="indigo"
        />
        <StatCard
          icon={CalendarClock}
          label="Monthly EMI"
          value="₹34,250"
          detail="Total monthly installment commitments"
          tone="amber"
        />
        <StatCard
          icon={TrendingDown}
          label="Total repaid"
          value="₹2,18,400"
          detail="Principal repaid across tracked loans"
          tone="emerald"
        />
        <StatCard
          icon={ReceiptIndianRupee}
          label="Upcoming EMIs"
          value="3 payments"
          detail="Payments due within the next 30 days"
          tone="slate"
        />
      </div>

      <section className="card loan-portfolio">
        <CardHeader
          title="My loans"
          subtitle="Monitor balances, repayments, and upcoming commitments."
          action={
            <Button variant="ghost" onClick={() => setRepaymentLoan(loans[0])}>
              <Plus size="0.875rem" />
              Record repayment
            </Button>
          }
        />
        <div className="loan-toolbar">
          <label className="document-search loan-search">
            <Search size="1rem" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search loans..."
            />
          </label>
          <div className="loan-filters">
            <Select value={type} onChange={setType} label="Filter by loan type">
              <option>All loan types</option>
              {loanTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Select value={status} onChange={setStatus} label="Filter by status">
              <option>Active loans</option>
              <option>All statuses</option>
            </Select>
            <Select value={lender} onChange={setLender} label="Filter by lender">
              <option>All lenders</option>
              {[...new Set(loans.map((loan) => loan.lender))].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Select value={sort} onChange={setSort} label="Sort loans">
              <option>Next due date</option>
              <option>Outstanding balance</option>
              <option>Recently updated</option>
            </Select>
          </div>
        </div>
        {visible.length === 0 ? (
          loans.length === 0 ? (
            <div className="loan-empty">
              <span>
                <Landmark size="1.4375rem" />
              </span>
              <strong>No loans added</strong>
              <p>Add your first loan to start tracking outstanding balances and EMI dates.</p>
              <Button onClick={() => setAddOpen(true)}>
                <Plus size="0.9375rem" />
                Add loan
              </Button>
            </div>
          ) : (
            <div className="loan-empty">
              <span>
                <Search size="1.375rem" />
              </span>
              <strong>No matching loans</strong>
              <p>Try changing your search term or selected filters.</p>
              <Button variant="secondary" onClick={resetFilters}>
                Clear filters
              </Button>
            </div>
          )
        ) : (
          <div className="loan-card-grid">
            {visible.map((loan) => (
              <article className="loan-card" key={loan.id} onClick={() => setSelected(loan)}>
                <div className="loan-card-top">
                  <span className="loan-card-icon">
                    <Landmark size="1.1875rem" />
                  </span>
                  <span>
                    <strong>{loan.name}</strong>
                    <small>{loan.lender}</small>
                  </span>
                  <StatusBadge status={loan.status} />
                </div>
                <div className="loan-outstanding">
                  <span>Outstanding principal</span>
                  <strong>{formatCurrency(loan.outstanding)}</strong>
                  <small>of {formatCurrency(loan.original)}</small>
                </div>
                <div className="loan-card-progress">
                  <div>
                    <ProgressBar progress={loan.progress} />
                  </div>
                  <span>{loan.progress}% repaid</span>
                </div>
                <div className="loan-card-metrics">
                  <span>
                    <small>Interest rate</small>
                    <strong>{loan.rate}% p.a.</strong>
                  </span>
                  <span>
                    <small>Monthly EMI</small>
                    <strong>{formatCurrency(loan.emi)}</strong>
                  </span>
                </div>
                <div className="loan-card-due">
                  <span>
                    <CalendarClock size="0.9375rem" />
                    <span>
                      <small>Next EMI due</small>
                      <strong>{loan.due}</strong>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setScheduleLoan(loan);
                    }}
                  >
                    View schedule
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="loan-disclaimer">
          Illustrative portfolio values for interface preview only. Not financial calculations or
          repayment advice.
        </div>
      </section>

      <section className="card upcoming-emis">
        <CardHeader
          title="Upcoming EMIs"
          subtitle="Payments due within the next 30 days."
          action={<span className="badge badge-amber">3 upcoming</span>}
        />
        {loans.length === 0 ? (
          <div className="upcoming-empty">
            <CalendarClock size="1.375rem" />
            <strong>No upcoming EMIs</strong>
            <span>Upcoming repayments will appear here when you add a loan.</span>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table upcoming-table">
              <thead>
                <tr>
                  <th>Loan</th>
                  <th>Lender</th>
                  <th>Due date</th>
                  <th>EMI amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.slice(0, 3).map((loan, index) => (
                  <tr key={loan.id} className={index === 0 ? "next-emi" : ""}>
                    <td>
                      <span className="cell-main">
                        <span className="cell-icon">
                          <WalletCards size="1rem" />
                        </span>
                        <span className="cell-text">
                          <strong>{loan.name}</strong>
                        </span>
                      </span>
                    </td>
                    <td data-label="Lender" className="hide-mobile">
                      {loan.lender}
                    </td>
                    <td data-label="Due date">{loan.due}</td>
                    <td data-label="Amount">{formatCurrency(loan.emi)}</td>
                    <td data-label="Status">
                      <StatusBadge status={index === 0 ? "Due soon" : "Upcoming"} dot={false} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="emi-pay-button"
                        onClick={() => setRepaymentLoan(loan)}
                      >
                        Record payment
                      </button>
                      <button
                        type="button"
                        className="row-action"
                        onClick={() => setScheduleLoan(loan)}
                        aria-label={`View ${loan.name} schedule`}
                      >
                        <Eye size="1rem" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {addOpen && <AddLoanModal onClose={() => setAddOpen(false)} onSave={saveLoan} />}
      {repaymentLoan && (
        <RepaymentModal
          loans={loans}
          selectedLoan={repaymentLoan}
          onClose={() => setRepaymentLoan(undefined)}
          onSave={recordRepayment}
        />
      )}
      {selected && (
        <LoanDrawer
          loan={selected}
          onClose={() => setSelected(null)}
          onSchedule={() => {
            setScheduleLoan(selected);
            setSelected(null);
          }}
          onRepay={() => {
            setRepaymentLoan(selected);
            setSelected(null);
          }}
          onDelete={() => {
            setDeleting(selected);
            setSelected(null);
          }}
        />
      )}
      {scheduleLoan && <ScheduleModal loan={scheduleLoan} onClose={() => setScheduleLoan(null)} />}
      {deleting && (
        <ConfirmDialog
          title={<>Delete &ldquo;{deleting.name}&rdquo;?</>}
          description="This loan and its repayment history will be removed. This action cannot be undone."
          confirmLabel="Delete loan"
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}
