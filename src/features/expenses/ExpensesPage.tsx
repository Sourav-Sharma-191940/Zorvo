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
import "./expenses.css";
import { Button } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { exportCsv } from "@/lib/export-csv";
import { categoryBreakdown, formatCurrency, periods, type Transaction } from "./data";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useDuplicateTransaction,
  useTransactions,
} from "./hooks";
import { StatCard } from "@/components/ui/StatCard";
import { Select } from "@/components/ui/Select";
import { Toast, useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { TrendChart } from "./components/TrendChart";
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
  const { toast, notify } = useToast();
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
    notify("Transaction added successfully");
  };

  const onDuplicate = (transaction: Transaction) => {
    duplicateTransaction.mutate(transaction);
    notify("Transaction duplicated");
  };

  const confirmDelete = () => {
    if (deleting) deleteTransaction.mutate(deleting.id);
    setDeleting(null);
    notify("Transaction deleted");
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
    <div className="page-stack expenses-page">
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

      <div className="period-row">
        <span>Overview for</span>
        <Select value={period} onChange={changePeriod} label="Select overview period">
          {periods.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </div>

      <div className="stat-grid">
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
      </div>

      <div className="expense-analytics-grid">
        <section className="card expense-trend-card">
          <div className="expense-card-header">
            <div>
              <strong>Spending trend</strong>
              <span>Track how your expenses change over time.</span>
            </div>
            <Select value={period} onChange={changePeriod} label="Select chart period">
              {periods
                .filter((item) => item !== "Custom range")
                .map((item) => (
                  <option key={item}>{item}</option>
                ))}
            </Select>
          </div>
          <div className="trend-metric">
            <div>
              <strong>₹67,240</strong>
              <span>This period</span>
            </div>
            <span className="trend-change">
              <TrendingDown size="0.8125rem" />
              8.2%
            </span>
            <div className="chart-legend">
              <span>
                <i className="current" />
                Current
              </span>
              <span>
                <i />
                Previous
              </span>
            </div>
          </div>
          <TrendChart />
        </section>
        <section className="card expense-category-card">
          <div className="expense-card-header">
            <div>
              <strong>Spending by category</strong>
              <span>Where your money went this month.</span>
            </div>
          </div>
          <div className="expense-donut-content">
            <div className="expense-donut">
              <div>
                <strong>₹67,240</strong>
                <span>Total spent</span>
              </div>
            </div>
            <div className="expense-category-list">
              {categoryBreakdown.map((item) => (
                <div key={item.name}>
                  <i className={`expense-legend legend-${item.color}`} />
                  <span>{item.name}</span>
                  <strong>{formatCurrency(item.amount)}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="card transaction-manager">
        <div className="transaction-heading">
          <div>
            <strong>Transactions</strong>
            <span>View and manage your income and expenses.</span>
          </div>
        </div>
        <div className="transaction-toolbar">
          <label className="document-search transaction-search">
            <Search size="1rem" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search transactions..."
            />
          </label>
          <div className="transaction-filters">
            <button type="button" className="doc-select">
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
          <div className="transaction-loading" aria-label="Loading transactions">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <i />
                <span>
                  <b />
                  <small />
                </span>
                <em />
                <em />
                <em />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          transactions.length === 0 ? (
            <div className="transaction-empty">
              <span>
                <ReceiptText size="1.375rem" />
              </span>
              <strong>No transactions yet</strong>
              <p>Add your first transaction to start tracking your cash flow.</p>
              <Button onClick={() => setModalOpen(true)}>
                <Plus size="0.9375rem" />
                Add transaction
              </Button>
            </div>
          ) : (
            <div className="transaction-empty">
              <span>
                <Search size="1.375rem" />
              </span>
              <strong>No matching transactions</strong>
              <p>Try changing your search or filters to find what you&rsquo;re looking for.</p>
              <Button variant="secondary" onClick={resetFilters}>
                Clear filters
              </Button>
            </div>
          )
        ) : (
          <div className="data-table-wrap">
            <table className="data-table interactive transactions-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Payment method</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((transaction) => (
                  <tr key={transaction.id} onClick={() => setSelected(transaction)}>
                    <td>
                      <span className="cell-main">
                        <span
                          className={`cell-icon ${transaction.type === "Income" ? "positive" : ""}`.trim()}
                        >
                          {transaction.type === "Income" ? (
                            <ArrowUpRight size="1rem" />
                          ) : (
                            <ArrowDownRight size="1rem" />
                          )}
                        </span>
                        <span className="cell-text">
                          <strong>{transaction.description}</strong>
                          <small>{transaction.merchant}</small>
                        </span>
                      </span>
                    </td>
                    <td data-label="Category">
                      <span className="badge badge-slate">{transaction.category}</span>
                    </td>
                    <td data-label="Date">{transaction.date}</td>
                    <td data-label="Payment" className="hide-mobile">
                      {transaction.payment}
                    </td>
                    <td data-label="Type">
                      <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td
                      data-label="Amount"
                      className={transaction.type === "Income" ? "positive-amount" : ""}
                    >
                      {transaction.type === "Income" ? "+" : "−"}{" "}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="action-cell">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="table-footer">
          <span>
            Showing {visible.length} of {transactions.length} transactions
          </span>
          <div>
            <button type="button" disabled>
              Previous
            </button>
            <span>1</span>
            <button type="button">Next</button>
          </div>
        </div>
      </section>

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
      <Toast message={toast} />
    </div>
  );
}
