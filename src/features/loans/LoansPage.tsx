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
import { Badge, Button, Card, IconTile } from "@/shared/ui/primitives";
import { CardHeader, PageHeader, PeriodRow } from "@/shared/ui/PageHeader";
import { EmptyState, PageStack, SearchInput } from "@/shared/ui/layout";
import { Select } from "@/shared/ui/Select";
import { StatCard, StatGrid } from "@/shared/ui/StatCard";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { CellMain, DataTable, TBody, TD, TH, THead, TR } from "@/shared/ui/table";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { toast } from "@/shared/ui/toast";
import { exportCsv } from "@/shared/lib/export-csv";
import { formatCurrency, loanTypes, type Loan } from "./data";
import { useCreateLoan, useDeleteLoan, useLoans } from "./hooks";
import { LoanCard } from "./components/LoanCard";
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
    toast.success("Loan added successfully");
  };

  const recordRepayment = () => {
    setRepaymentLoan(undefined);
    toast.success("Repayment recorded successfully");
  };

  const confirmDelete = () => {
    if (deleting) deleteLoan.mutate(deleting.id);
    setDeleting(null);
    toast.success("Loan deleted");
  };

  const exportLoans = () =>
    exportCsv("personal-command-center-loans", [
      ["Loan", "Lender", "Type", "Original Principal", "Outstanding", "Rate", "EMI", "Next Due", "Status"],
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
    <PageStack>
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

      <PeriodRow label="Portfolio view">
        <Select value={status} onChange={setStatus} label="Filter portfolio status">
          <option>Active loans</option>
          <option>All statuses</option>
        </Select>
      </PeriodRow>

      <StatGrid>
        <StatCard icon={CircleDollarSign} label="Total outstanding" value="₹8,42,600" detail="Remaining principal across active loans" tone="indigo" />
        <StatCard icon={CalendarClock} label="Monthly EMI" value="₹34,250" detail="Total monthly installment commitments" tone="amber" />
        <StatCard icon={TrendingDown} label="Total repaid" value="₹2,18,400" detail="Principal repaid across tracked loans" tone="emerald" />
        <StatCard icon={ReceiptIndianRupee} label="Upcoming EMIs" value="3 payments" detail="Payments due within the next 30 days" tone="slate" />
      </StatGrid>

      <Card>
        <CardHeader
          title="My loans"
          subtitle="Monitor balances, repayments, and upcoming commitments."
          action={
            <Button variant="ghost" className="max-xs:hidden" onClick={() => setRepaymentLoan(loans[0])}>
              <Plus size="0.875rem" />
              Record repayment
            </Button>
          }
        />
        <div className="flex flex-col gap-3 px-3 pb-2.75 sm:px-4 sm:pb-3.25 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Search loans..." className="lg:w-67.5" />
          <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap lg:justify-end">
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
            <Select value={sort} onChange={setSort} label="Sort loans" className="sm:min-w-33">
              <option>Next due date</option>
              <option>Outstanding balance</option>
              <option>Recently updated</option>
            </Select>
          </div>
        </div>

        {visible.length === 0 ? (
          loans.length === 0 ? (
            <EmptyState
              icon={Landmark}
              title="No loans added"
              description="Add your first loan to start tracking outstanding balances and EMI dates."
              action={
                <Button onClick={() => setAddOpen(true)}>
                  <Plus size="0.9375rem" />
                  Add loan
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={Search}
              title="No matching loans"
              description="Try changing your search term or selected filters."
              action={
                <Button variant="secondary" onClick={resetFilters}>
                  Clear filters
                </Button>
              }
            />
          )
        ) : (
          <div className="grid grid-cols-1 gap-3 border-t border-border p-2.5 max-sm:bg-background sm:grid-cols-2 sm:p-4 sm:pt-3.5 lg:grid-cols-3">
            {visible.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onOpen={() => setSelected(loan)}
                onSchedule={() => setScheduleLoan(loan)}
              />
            ))}
          </div>
        )}
        <p className="rounded-b-lg border-t border-border bg-muted px-4 py-2.5 text-3xs leading-3.25 text-subtle-foreground">
          Illustrative portfolio values for interface preview only. Not financial calculations or
          repayment advice.
        </p>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader
          title="Upcoming EMIs"
          subtitle="Payments due within the next 30 days."
          action={<Badge tone="amber">3 upcoming</Badge>}
        />
        {loans.length === 0 ? (
          <EmptyState
            compact
            icon={CalendarClock}
            title="No upcoming EMIs"
            description="Upcoming repayments will appear here when you add a loan."
          />
        ) : (
          <DataTable className="sm:min-w-190">
            <THead>
              <TH>Loan</TH>
              <TH>Lender</TH>
              <TH>Due date</TH>
              <TH>EMI amount</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </THead>
            <TBody>
              {loans.slice(0, 3).map((loan, index) => (
                <TR key={loan.id} className={index === 0 ? "bg-warning-row" : undefined}>
                  <TD primary>
                    <CellMain
                      icon={
                        <IconTile className="size-7.75 rounded-sm">
                          <WalletCards size="1rem" />
                        </IconTile>
                      }
                      title={loan.name}
                    />
                  </TD>
                  <TD label="Lender" hideOnMobile>
                    {loan.lender}
                  </TD>
                  <TD label="Due date">{loan.due}</TD>
                  <TD label="Amount" className="max-sm:text-right">
                    {formatCurrency(loan.emi)}
                  </TD>
                  <TD label="Status">
                    <StatusBadge status={index === 0 ? "Due soon" : "Upcoming"} dot={false} />
                  </TD>
                  <TD align="right" className="max-sm:col-span-full max-sm:text-left">
                    <span className="inline-flex items-center gap-1.25">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-primary hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
                        onClick={() => setRepaymentLoan(loan)}
                      >
                        Record payment
                      </Button>
                      <Button
                        variant="iconGhost"
                        ariaLabel={`View ${loan.name} schedule`}
                        onClick={() => setScheduleLoan(loan)}
                      >
                        <Eye size="1rem" />
                      </Button>
                    </span>
                  </TD>
                </TR>
              ))}
            </TBody>
          </DataTable>
        )}
      </Card>

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
    </PageStack>
  );
}
