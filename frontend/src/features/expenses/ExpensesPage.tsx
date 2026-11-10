"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Copy,
  Download,
  Eye,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  TrendingDown,
  WalletCards,
} from "lucide-react";
import { Badge, Button, Card, IconTile, SectionHeader } from "@/shared/ui/primitives";
import { CardHeader, PageHeader, PeriodRow } from "@/shared/ui/PageHeader";
import { EmptyState, PageStack, SearchInput, TableFooter } from "@/shared/ui/layout";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { CellMain, DataTable, TBody, TD, TH, THead, TR } from "@/shared/ui/table";
import { cn } from "@/shared/lib/utils";
import { exportCsv } from "@/shared/lib/export-csv";
import { formatCurrency, periods, type Transaction } from "./data";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useDuplicateTransaction,
  useTransactions,
} from "./hooks";
import { StatCard, StatGrid } from "@/shared/ui/StatCard";
import { Select } from "@/shared/ui/Select";
import { toast } from "@/shared/ui/toast";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { ActionMenu } from "@/shared/ui/ActionMenu";
import { TrendChart } from "./components/TrendChart";
import { CategoryDonut } from "./components/CategoryDonut";
import { AddTransactionModal } from "./components/AddTransactionModal";
import { TransactionDrawer } from "./components/TransactionDrawer";

export function ExpensesPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const createTransaction = useCreateTransaction();
  const duplicateTransaction = useDuplicateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [period, setPeriod] = useState("This month");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [type, setType] = useState("All types");
  const [payment, setPayment] = useState("All methods");
  const [sort, setSort] = useState("Newest first");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [periodLoading, setPeriodLoading] = useState(false);

  const loading = isLoading || periodLoading;

  const visible = useMemo(() => {
    const filtered = transactions.filter((item) => {
      const text = `${item.description} ${item.merchant} ${item.category}`.toLowerCase();
      return (
        text.includes(query.toLowerCase()) &&
        (category === "All categories" || item.category === category) &&
        (type === "All types" || item.type === type) &&
        (payment === "All methods" || item.payment === payment)
      );
    });
    if (sort === "Oldest first") return [...filtered].reverse();
    if (sort === "Amount: high to low") return [...filtered].sort((a, b) => b.amount - a.amount);
    return filtered;
  }, [category, payment, query, sort, transactions, type]);

  const changePeriod = (value: string) => {
    setPeriod(value);
    setPeriodLoading(true);
    window.setTimeout(() => setPeriodLoading(false), 550);
  };

  const saveTransaction = (input: Parameters<typeof createTransaction.mutate>[0]) => {
    createTransaction.mutate(input);
    setModalOpen(false);
    toast.success("Transaction added successfully");
  };

  const onDuplicate = (transaction: Transaction) => {
    duplicateTransaction.mutate(transaction);
    toast.success("Transaction duplicated");
  };

  const confirmDelete = () => {
    if (deleting) deleteTransaction.mutate(deleting.id);
    setDeleting(null);
    toast.success("Transaction deleted");
  };

  const exportTransactions = () =>
    exportCsv("personal-command-center-expenses", [
      ["Description", "Category", "Date", "Payment Method", "Type", "Amount"],
      ...visible.map((item) => [
        item.description,
        item.category,
        item.date,
        item.payment,
        item.type,
        String(item.amount),
      ]),
    ]);

  const resetFilters = () => {
    setQuery("");
    setCategory("All categories");
    setType("All types");
    setPayment("All methods");
  };

  return (
    <PageStack>
      <PageHeader
        title="Expenses"
        subtitle="Track your spending, manage income, and understand where your money goes."
        actions={
          <>
            <Button variant="secondary" onClick={exportTransactions}>
              <Download size="1rem" />
              Export
            </Button>
            <Button onClick={() => setModalOpen(true)}>
              <Plus size="1rem" />
              Add transaction
            </Button>
          </>
        }
      />

      <PeriodRow label="Overview for">
        <Select value={period} onChange={changePeriod} label="Select overview period">
          {periods.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </PeriodRow>

      <StatGrid>
        <StatCard
          icon={ArrowDownRight}
          label="Total expenses"
          value="₹67,240"
          detail="8.2% lower than last month"
          tone="indigo"
          trend="good"
        />
        <StatCard
          icon={ArrowUpRight}
          label="Total income"
          value="₹1,42,000"
          detail="5.4% higher than last month"
          tone="emerald"
        />
        <StatCard
          icon={WalletCards}
          label="Net savings"
          value="₹74,760"
          detail="Income minus expenses"
          tone="amber"
        />
        <StatCard
          icon={ReceiptText}
          label="Transactions"
          value="32 transactions"
          detail="Across all payment methods"
          tone="slate"
        />
      </StatGrid>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-3.5 *:min-w-0 lg:grid-cols-[minmax(0,1.25fr)_minmax(22.8125rem,0.75fr)]">
        <Card className="p-3.5 sm:min-h-82.5 sm:p-4.5 lg:min-h-86.5">
          <SectionHeader
            title="Spending trend"
            subtitle="Track how your expenses change over time."
            action={
              <Select
                value={period}
                onChange={changePeriod}
                label="Select chart period"
                className="max-xs:hidden"
              >
                {periods
                  .filter((item) => item !== "Custom range")
                  .map((item) => (
                    <option key={item}>{item}</option>
                  ))}
              </Select>
            }
          />
          <div className="mt-2 flex min-h-11.75 items-center gap-2.25">
            <div className="flex flex-col gap-0.5">
              <strong className="text-3xl tracking-tight">₹67,240</strong>
              <span className="text-3xs text-subtle-foreground">This period</span>
            </div>
            <Badge tone="emerald">
              <TrendingDown size="0.8125rem" />
              8.2%
            </Badge>
            <div className="ml-auto flex items-center gap-3 text-3xs text-subtle-foreground max-sm:hidden">
              <span className="flex items-center gap-1.25">
                <i aria-hidden className="w-3.25 border-t-2 border-primary-accent" />
                Current
              </span>
              <span className="flex items-center gap-1.25">
                <i aria-hidden className="w-3.25 border-t-2 border-dashed border-border-strong" />
                Previous
              </span>
            </div>
          </div>
          <TrendChart />
        </Card>
        <Card className="p-3.5 sm:min-h-82.5 sm:p-4.5 lg:min-h-86.5">
          <SectionHeader title="Spending by category" subtitle="Where your money went this month." />
          <CategoryDonut />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Transactions"
          subtitle="View and manage your income and expenses."
        />
        <div className="flex flex-col gap-3 px-3 pb-3 sm:px-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search transactions..."
            className="lg:w-67.5 lg:shrink-0"
          />
          <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap lg:justify-end">
            <button
              type="button"
              className="inline-flex h-8.5 min-w-29 items-center justify-between gap-1.5 rounded-sm border border-border bg-card px-2.5 text-2xs font-semibold text-muted-foreground transition hover:border-border-strong hover:text-foreground"
            >
              <CalendarDays size="0.875rem" />
              Date range
              <ChevronDown size="0.875rem" />
            </button>
            <Select value={category} onChange={setCategory} label="Filter by category">
              <option>All categories</option>
              {[...new Set(transactions.map((item) => item.category))].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Select value={type} onChange={setType} label="Filter by type">
              <option>All types</option>
              <option>Expense</option>
              <option>Income</option>
            </Select>
            <Select value={payment} onChange={setPayment} label="Filter by payment method">
              <option>All methods</option>
              <option>UPI</option>
              <option>Credit card</option>
              <option>Bank transfer</option>
            </Select>
            <Select value={sort} onChange={setSort} label="Sort transactions">
              <option>Newest first</option>
              <option>Oldest first</option>
              <option>Amount: high to low</option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div
            role="status"
            aria-label="Loading transactions"
            className="grid min-h-71.5 content-start border-t border-border"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="grid h-15.5 grid-cols-[1.9375rem_1fr_3.75rem] items-center gap-3 border-b border-border px-3 sm:grid-cols-[1.9375rem_minmax(9.375rem,1.4fr)_1fr_1fr_1fr] sm:px-4"
              >
                <i className="size-7.75 animate-pulse rounded-xs bg-secondary" />
                <span className="grid gap-1.5">
                  <b className="h-2 w-30 animate-pulse rounded-xs bg-secondary" />
                  <small className="h-1.5 w-20.5 animate-pulse rounded-xs bg-secondary" />
                </span>
                <em className="h-2 w-[70%] animate-pulse rounded-xs bg-secondary" />
                <em className="h-2 w-[70%] animate-pulse rounded-xs bg-secondary max-sm:hidden" />
                <em className="h-2 w-[70%] animate-pulse rounded-xs bg-secondary max-sm:hidden" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          transactions.length === 0 ? (
            <EmptyState
              icon={ReceiptText}
              title="No transactions yet"
              description="Add your first transaction to start tracking your cash flow."
              action={
                <Button onClick={() => setModalOpen(true)}>
                  <Plus size="0.9375rem" />
                  Add transaction
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={Search}
              title="No matching transactions"
              description="Try changing your search or filters to find what you’re looking for."
              action={
                <Button variant="secondary" onClick={resetFilters}>
                  Clear filters
                </Button>
              }
            />
          )
        ) : (
          <DataTable className="sm:min-w-247.5">
            <THead>
              <TH>Description</TH>
              <TH>Category</TH>
              <TH>Date</TH>
              <TH>Payment method</TH>
              <TH>Type</TH>
              <TH align="right">Amount</TH>
              <TH>
                <span className="sr-only">Actions</span>
              </TH>
            </THead>
            <TBody>
              {visible.map((transaction) => {
                const isIncome = transaction.type === "Income";
                return (
                  <TR key={transaction.id} interactive onClick={() => setSelected(transaction)}>
                    <TD primary>
                      <CellMain
                        icon={
                          <IconTile
                            tone={isIncome ? "emerald" : "indigo"}
                            className="size-7.75 rounded-sm"
                          >
                            {isIncome ? (
                              <ArrowUpRight size="1rem" />
                            ) : (
                              <ArrowDownRight size="1rem" />
                            )}
                          </IconTile>
                        }
                        title={transaction.description}
                        subtitle={transaction.merchant}
                      />
                    </TD>
                    <TD label="Category">
                      <Badge tone="slate">{transaction.category}</Badge>
                    </TD>
                    <TD label="Date">{transaction.date}</TD>
                    <TD label="Payment" hideOnMobile>
                      {transaction.payment}
                    </TD>
                    <TD label="Type">
                      <StatusBadge
                        status={transaction.type}
                        tone={isIncome ? "emerald" : "slate"}
                        dot={false}
                      />
                    </TD>
                    <TD
                      label="Amount"
                      align="right"
                      className={cn(
                        "font-bold tabular-nums max-sm:text-right",
                        isIncome ? "text-success" : "text-foreground",
                      )}
                    >
                      {isIncome ? "+" : "−"} {formatCurrency(transaction.amount)}
                    </TD>
                    <TD actions>
                      <ActionMenu
                        label={`Actions for ${transaction.description}`}
                        items={[
                          {
                            label: "View details",
                            icon: Eye,
                            onSelect: () => setSelected(transaction),
                          },
                          {
                            label: "Edit transaction",
                            icon: Pencil,
                            onSelect: () => setSelected(transaction),
                          },
                          {
                            label: "Duplicate transaction",
                            icon: Copy,
                            onSelect: () => onDuplicate(transaction),
                          },
                          {
                            label: "Delete transaction",
                            icon: Trash2,
                            onSelect: () => setDeleting(transaction),
                            danger: true,
                          },
                        ]}
                      />
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </DataTable>
        )}
        <TableFooter shown={visible.length} total={transactions.length} noun="transactions" />
      </Card>

      {modalOpen && (
        <AddTransactionModal onClose={() => setModalOpen(false)} onSave={saveTransaction} />
      )}
      {selected && (
        <TransactionDrawer
          transaction={selected}
          onClose={() => setSelected(null)}
          onDelete={() => {
            setDeleting(selected);
            setSelected(null);
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title={<>Delete &ldquo;{deleting.description}&rdquo;?</>}
          description="This transaction will be permanently removed. This action cannot be undone."
          confirmLabel="Delete transaction"
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </PageStack>
  );
}
