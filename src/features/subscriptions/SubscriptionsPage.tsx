"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  Check,
  CirclePause,
  CirclePlay,
  CreditCard,
  Download,
  ExternalLink,
  Grid2X2,
  List,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  WalletCards,
} from "lucide-react";
import "./subscriptions.css";
import { Button } from "@/components/ui/primitives";
import { PageHeader, CardHeader } from "@/components/ui/PageHeader";
import { exportCsv } from "@/lib/export-csv";
import {
  activeStatuses,
  daysUntil,
  formatCurrency,
  monthlyAmount,
  subscriptionCategories,
  type Subscription,
  type SubscriptionStatus,
} from "./data";
import {
  useCreateSubscription,
  useDeleteSubscription,
  useSubscriptions,
  useUpdateSubscription,
} from "./hooks";
import { Select } from "@/components/ui/Select";
import { Toast, useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { ServiceLogo } from "./components/ServiceLogo";
import { SubscriptionForm } from "./components/SubscriptionForm";
import { SubscriptionDrawer } from "./components/SubscriptionDrawer";

export function SubscriptionsPage() {
  const { data: subscriptions = [] } = useSubscriptions();
  const createSubscription = useCreateSubscription();
  const updateSubscription = useUpdateSubscription();
  const deleteSubscription = useDeleteSubscription();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [frequency, setFrequency] = useState("All frequencies");
  const [sort, setSort] = useState("Next renewal");
  const [view, setView] = useState<"list" | "grid">("list");
  const [period, setPeriod] = useState("Monthly estimate");
  const [formItem, setFormItem] = useState<Subscription | "new" | null>(null);
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [confirming, setConfirming] = useState<{
    item: Subscription;
    action: "cancel" | "delete";
  } | null>(null);
  const { toast, notify } = useToast();

  const visible = useMemo(() => {
    const filtered = subscriptions.filter(
      (item) =>
        `${item.name} ${item.plan} ${item.category}`.toLowerCase().includes(query.toLowerCase()) &&
        (category === "All categories" || item.category === category) &&
        (status === "All statuses" || item.status === status) &&
        (frequency === "All frequencies" || item.frequency === frequency),
    );
    if (sort === "Amount: high to low") return [...filtered].sort((a, b) => b.amount - a.amount);
    if (sort === "Name") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return [...filtered].sort((a, b) => a.renewalISO.localeCompare(b.renewalISO));
  }, [subscriptions, query, category, status, frequency, sort]);

  const upcoming = subscriptions
    .filter((item) => activeStatuses.includes(item.status))
    .sort((a, b) => a.renewalISO.localeCompare(b.renewalISO))
    .slice(0, 4);

  const monthly = subscriptions
    .filter((item) => item.status !== "Cancelled")
    .reduce((sum, item) => sum + monthlyAmount(item), 0);

  const activeCount = subscriptions.filter((item) => activeStatuses.includes(item.status)).length;
  const pausedCount = subscriptions.filter((item) => item.status === "Paused").length;

  const next30Days = subscriptions
    .filter((item) => activeStatuses.includes(item.status))
    .reduce((sum, item) => sum + (daysUntil(item.renewalISO) <= 30 ? item.amount : 0), 0);

  const spendingView =
    period === "Annual projection"
      ? {
          value: formatCurrency(Math.round(monthly * 12)),
          detail: "Projected cost across the next 12 months",
        }
      : period === "Next 30 days"
        ? {
            value: formatCurrency(next30Days),
            detail: "Renewals charging within the next 30 days",
          }
        : {
            value: formatCurrency(Math.round(monthly)),
            detail: "Estimated recurring cost each month",
          };

  const save = (item: Subscription) => {
    const exists = subscriptions.some((entry) => entry.id === item.id);
    if (exists) {
      updateSubscription.mutate(item);
    } else {
      const { id: _id, ...rest } = item;
      void _id;
      createSubscription.mutate(rest);
    }
    setFormItem(null);
    setSelected(null);
    notify(exists ? "Subscription updated" : "Subscription added successfully");
  };

  const updateStatus = (item: Subscription, next: SubscriptionStatus) => {
    updateSubscription.mutate({ ...item, status: next });
    setSelected(null);
    notify(
      next === "Paused"
        ? "Subscription paused"
        : next === "Active"
          ? "Subscription resumed"
          : "Subscription cancelled",
    );
  };

  const markPaid = (item: Subscription) => {
    setSelected(null);
    notify(`${item.name} renewal marked as paid`);
  };

  const confirm = () => {
    if (!confirming) return;
    if (confirming.action === "delete") {
      deleteSubscription.mutate(confirming.item.id);
      notify("Subscription deleted");
    } else {
      updateSubscription.mutate({ ...confirming.item, status: "Cancelled" });
      notify("Subscription cancelled");
    }
    setConfirming(null);
    setSelected(null);
  };

  const exportData = () =>
    exportCsv("personal-command-center-subscriptions", [
      [
        "Subscription",
        "Category",
        "Plan",
        "Amount",
        "Frequency",
        "Renewal",
        "Payment method",
        "Status",
      ],
      ...visible.map((item) => [
        item.name,
        item.category,
        item.plan,
        String(item.amount),
        item.frequency,
        item.renewal,
        item.payment,
        item.status,
      ]),
    ]);

  const openEdit = (item: Subscription) => {
    setSelected(null);
    setFormItem(item);
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("All categories");
    setStatus("All statuses");
    setFrequency("All frequencies");
  };

  return (
    <div className="page-stack subscriptions-page">
      <PageHeader
        title="Subscriptions"
        subtitle="Manage recurring payments and keep track of upcoming renewals."
        actions={
          <>
            <Button variant="secondary" onClick={exportData}>
              <Download size="1rem" />
              Export
            </Button>
            <Button onClick={() => setFormItem("new")}>
              <Plus size="1rem" />
              Add subscription
            </Button>
          </>
        }
      />

      <div className="period-row">
        <span>Spending overview</span>
        <Select value={period} onChange={setPeriod} label="Select spending period">
          <option>Monthly estimate</option>
          <option>Annual projection</option>
          <option>Next 30 days</option>
        </Select>
      </div>

      <div className="stat-grid">
        <StatCard
          icon={WalletCards}
          label="Spending"
          value={spendingView.value}
          detail={spendingView.detail}
          tone="indigo"
        />
        <StatCard
          icon={CreditCard}
          label="Annual spending"
          value={formatCurrency(Math.round(monthly * 12))}
          detail="Projected cost across 12 months"
          tone="emerald"
        />
        <StatCard
          icon={CalendarClock}
          label="Upcoming renewals"
          value={`${upcoming.length} renewals`}
          detail="Payments due within the next 30 days"
          tone="amber"
        />
        <StatCard
          icon={RefreshCw}
          label="Active subscriptions"
          value={String(activeCount)}
          detail={`${pausedCount} paused subscription`}
          tone="slate"
        />
      </div>

      <section className="card subscription-manager">
        <CardHeader
          title="My Subscriptions"
          subtitle="Review plans, billing cycles, and renewal dates."
          action={<span className="count-pill">{subscriptions.length} services</span>}
        />
        <div className="subscription-toolbar">
          <label className="document-search subscription-search">
            <Search size="1rem" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search subscriptions..."
            />
          </label>
          <div className="subscription-filters">
            <Select value={category} onChange={setCategory} label="Filter by category">
              <option>All categories</option>
              {subscriptionCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Select value={status} onChange={setStatus} label="Filter by status">
              <option>All statuses</option>
              <option>Active</option>
              <option>Trial</option>
              <option>Paused</option>
              <option>Cancelled</option>
              <option>Expiring soon</option>
            </Select>
            <Select value={frequency} onChange={setFrequency} label="Filter by frequency">
              <option>All frequencies</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </Select>
            <Select value={sort} onChange={setSort} label="Sort subscriptions">
              <option>Next renewal</option>
              <option>Amount: high to low</option>
              <option>Name</option>
            </Select>
            <div className="view-toggle" aria-label="Change subscription view">
              <button
                type="button"
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List size="0.875rem" />
              </button>
              <button
                type="button"
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <Grid2X2 size="0.875rem" />
              </button>
            </div>
          </div>
        </div>
        {visible.length === 0 ? (
          <div className="subscription-empty">
            <span>{subscriptions.length ? <Search size="1.375rem" /> : <RefreshCw size="1.375rem" />}</span>
            <strong>
              {subscriptions.length ? "No matching subscriptions" : "No subscriptions added"}
            </strong>
            <p>
              {subscriptions.length
                ? "Try changing your search term or selected filters."
                : "Add your first recurring payment to track spending and renewals."}
            </p>
            {subscriptions.length ? (
              <Button variant="secondary" onClick={resetFilters}>
                Clear filters
              </Button>
            ) : (
              <Button onClick={() => setFormItem("new")}>
                <Plus size="0.9375rem" />
                Add subscription
              </Button>
            )}
          </div>
        ) : view === "list" ? (
          <div className="data-table-wrap">
            <table className="data-table interactive subscriptions-table">
              <thead>
                <tr>
                  <th>Subscription</th>
                  <th>Category</th>
                  <th>Billing</th>
                  <th>Next renewal</th>
                  <th>Payment method</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id} onClick={() => setSelected(item)}>
                    <td data-label="Subscription">
                      <span className="cell-main">
                        <ServiceLogo item={item} small />
                        <span className="cell-text">
                          <strong>{item.name}</strong>
                          <small>{item.plan}</small>
                        </span>
                      </span>
                    </td>
                    <td data-label="Category">
                      <span className="badge badge-slate">{item.category}</span>
                    </td>
                    <td data-label="Billing" className="cell-stack">
                      <strong>{formatCurrency(item.amount)}</strong>
                      <small>{item.frequency}</small>
                    </td>
                    <td data-label="Next renewal" className="cell-stack">
                      <strong>{item.renewal}</strong>
                      <small>{item.id < 5 ? `In ${item.id * 4} days` : "Scheduled"}</small>
                    </td>
                    <td data-label="Payment">{item.payment}</td>
                    <td data-label="Status">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="action-cell">
                      <ActionMenu
                        label={`Actions for ${item.name}`}
                        items={[
                          {
                            label: "View details",
                            icon: ExternalLink,
                            onSelect: () => setSelected(item),
                          },
                          {
                            label: "Edit subscription",
                            icon: Pencil,
                            onSelect: () => openEdit(item),
                          },
                          { label: "Mark as paid", icon: Check, onSelect: () => markPaid(item) },
                          {
                            label: item.status === "Paused" ? "Resume" : "Pause",
                            icon: item.status === "Paused" ? CirclePlay : CirclePause,
                            onSelect: () =>
                              updateStatus(item, item.status === "Paused" ? "Active" : "Paused"),
                          },
                          {
                            label: "Delete subscription",
                            icon: Trash2,
                            onSelect: () => setConfirming({ item, action: "delete" }),
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
        ) : (
          <div className="subscription-grid">
            {visible.map((item) => (
              <button
                type="button"
                className="subscription-grid-card"
                key={item.id}
                onClick={() => setSelected(item)}
              >
                <div>
                  <ServiceLogo item={item} />
                  <StatusBadge status={item.status} dot={false} />
                </div>
                <strong>{item.name}</strong>
                <small>
                  {item.plan} · {item.category}
                </small>
                <div>
                  <span>
                    <small>Billing</small>
                    <strong>
                      {formatCurrency(item.amount)} / {item.frequency.toLowerCase()}
                    </strong>
                  </span>
                  <span>
                    <small>Renews</small>
                    <strong>{item.renewal}</strong>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="table-footer">
          <span>
            Showing {visible.length} of {subscriptions.length} subscriptions
          </span>
          <div>
            <button type="button" disabled>
              Previous
            </button>
            <span>1</span>
            <button type="button" disabled>
              Next
            </button>
          </div>
        </div>
      </section>

      <section className="card upcoming-renewals">
        <CardHeader
          title="Upcoming Renewals"
          subtitle="Payments expected within the next 30 days."
          action={<Button variant="ghost">View all</Button>}
        />
        {upcoming.length === 0 ? (
          <div className="upcoming-empty">
            <CalendarClock size="1.375rem" />
            <strong>No upcoming renewals</strong>
            <span>You&rsquo;re all caught up for the next 30 days.</span>
          </div>
        ) : (
          <div className="renewal-grid">
            {upcoming.map((item, index) => (
              <article className={index < 2 ? "urgent" : ""} key={item.id}>
                <ServiceLogo item={item} small />
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.frequency} · {item.plan}
                  </small>
                </span>
                <span className="renewal-date">
                  <strong>{item.renewal.replace(" 2026", "")}</strong>
                  <small>{index < 2 ? `In ${4 + index * 2} days` : "Later this month"}</small>
                </span>
                <span className="renewal-amount">
                  <strong>{formatCurrency(item.amount)}</strong>
                  <button type="button" onClick={() => setSelected(item)}>
                    View details
                  </button>
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      {formItem && (
        <SubscriptionForm
          item={formItem === "new" ? undefined : formItem}
          onClose={() => setFormItem(null)}
          onSave={save}
        />
      )}
      {selected && (
        <SubscriptionDrawer
          item={selected}
          onClose={() => setSelected(null)}
          onEdit={() => openEdit(selected)}
          onPaid={() => markPaid(selected)}
          onTogglePause={() =>
            updateStatus(selected, selected.status === "Paused" ? "Active" : "Paused")
          }
          onCancel={() => setConfirming({ item: selected, action: "cancel" })}
          onDelete={() => setConfirming({ item: selected, action: "delete" })}
        />
      )}
      {confirming && (
        <ConfirmDialog
          title={
            confirming.action === "delete"
              ? `Delete “${confirming.item.name}”?`
              : `Cancel “${confirming.item.name}”?`
          }
          description={
            confirming.action === "delete"
              ? "This subscription and its tracking history will be permanently removed. This action cannot be undone."
              : "Future renewals will no longer be tracked as active. You can keep the record for reference."
          }
          confirmLabel={
            confirming.action === "delete" ? "Delete subscription" : "Cancel subscription"
          }
          cancelLabel="Keep subscription"
          icon={confirming.action === "delete" ? undefined : <CirclePause size="1.25rem" />}
          onCancel={() => setConfirming(null)}
          onConfirm={confirm}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}
