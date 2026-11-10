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
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  WalletCards,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui/primitives";
import { CardHeader, PageHeader, PeriodRow } from "@/shared/ui/PageHeader";
import {
  EmptyState,
  PageStack,
  SearchInput,
  TableFooter,
  ViewToggle,
  type ViewMode,
} from "@/shared/ui/layout";
import { CellMain, CellStack, DataTable, TBody, TD, TH, THead, TR } from "@/shared/ui/table";
import { exportCsv } from "@/shared/lib/export-csv";
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
import { Select } from "@/shared/ui/Select";
import { toast } from "@/shared/ui/toast";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { ActionMenu } from "@/shared/ui/ActionMenu";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { StatCard, StatGrid } from "@/shared/ui/StatCard";
import { ServiceLogo } from "./components/ServiceLogo";
import { SubscriptionGridCard } from "./components/SubscriptionGridCard";
import { RenewalCard } from "./components/RenewalCard";
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
  const [view, setView] = useState<ViewMode>("list");
  const [period, setPeriod] = useState("Monthly estimate");
  const [formItem, setFormItem] = useState<Subscription | "new" | null>(null);
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [confirming, setConfirming] = useState<{
    item: Subscription;
    action: "cancel" | "delete";
  } | null>(null);

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
    toast.success(exists ? "Subscription updated" : "Subscription added successfully");
  };

  const updateStatus = (item: Subscription, next: SubscriptionStatus) => {
    updateSubscription.mutate({ ...item, status: next });
    setSelected(null);
    toast.success(
      next === "Paused"
        ? "Subscription paused"
        : next === "Active"
          ? "Subscription resumed"
          : "Subscription cancelled",
    );
  };

  const markPaid = (item: Subscription) => {
    setSelected(null);
    toast.success(`${item.name} renewal marked as paid`);
  };

  const confirm = () => {
    if (!confirming) return;
    if (confirming.action === "delete") {
      deleteSubscription.mutate(confirming.item.id);
      toast.success("Subscription deleted");
    } else {
      updateSubscription.mutate({ ...confirming.item, status: "Cancelled" });
      toast.success("Subscription cancelled");
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
    <PageStack>
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

      <PeriodRow label="Spending overview">
        <Select value={period} onChange={setPeriod} label="Select spending period">
          <option>Monthly estimate</option>
          <option>Annual projection</option>
          <option>Next 30 days</option>
        </Select>
      </PeriodRow>

      <StatGrid>
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
      </StatGrid>

      <Card>
        <CardHeader
          title="My Subscriptions"
          subtitle="Review plans, billing cycles, and renewal dates."
          action={<Badge shape="pill" tone="indigo">{subscriptions.length} services</Badge>}
        />
        <div className="flex flex-col gap-3 px-3 pb-2.75 sm:px-4 sm:pb-3.25 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search subscriptions..."
            className="lg:w-67.5"
          />
          <div className="grid grid-cols-2 items-center gap-1.5 sm:flex sm:flex-wrap lg:justify-end">
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
            <div className="max-sm:col-span-2 max-sm:justify-self-end">
              <ViewToggle value={view} onChange={setView} label="Change subscription view" />
            </div>
          </div>
        </div>
        {visible.length === 0 ? (
          subscriptions.length ? (
            <EmptyState
              icon={Search}
              title="No matching subscriptions"
              description="Try changing your search term or selected filters."
              action={
                <Button variant="secondary" onClick={resetFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={RefreshCw}
              title="No subscriptions added"
              description="Add your first recurring payment to track spending and renewals."
              action={
                <Button onClick={() => setFormItem("new")}>
                  <Plus size="0.9375rem" />
                  Add subscription
                </Button>
              }
            />
          )
        ) : view === "list" ? (
          <DataTable className="sm:min-w-205">
            <THead>
              <TH>Subscription</TH>
              <TH>Category</TH>
              <TH>Billing</TH>
              <TH>Next renewal</TH>
              <TH>Payment method</TH>
              <TH>Status</TH>
              <TH>
                <span className="sr-only">Actions</span>
              </TH>
            </THead>
            <TBody>
              {visible.map((item) => (
                <TR
                  key={item.id}
                  interactive
                  tabIndex={0}
                  onClick={() => setSelected(item)}
                  onKeyDown={(event) => {
                    if (event.target === event.currentTarget && event.key === "Enter") {
                      setSelected(item);
                    }
                  }}
                  className="outline-none focus-visible:bg-muted"
                >
                  <TD primary>
                    <CellMain
                      icon={<ServiceLogo item={item} small />}
                      title={item.name}
                      subtitle={item.plan}
                    />
                  </TD>
                  <TD label="Category">
                    <Badge tone="slate">{item.category}</Badge>
                  </TD>
                  <TD label="Billing">
                    <CellStack primary={formatCurrency(item.amount)} secondary={item.frequency} />
                  </TD>
                  <TD label="Next renewal">
                    <CellStack
                      primary={item.renewal}
                      secondary={item.id < 5 ? `In ${item.id * 4} days` : "Scheduled"}
                    />
                  </TD>
                  <TD label="Payment">{item.payment}</TD>
                  <TD label="Status">
                    <StatusBadge status={item.status} />
                  </TD>
                  <TD actions>
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
                  </TD>
                </TR>
              ))}
            </TBody>
          </DataTable>
        ) : (
          <div className="grid grid-cols-1 gap-3 border-t border-border p-2.5 max-sm:bg-background sm:grid-cols-2 sm:p-4 sm:pt-3.5 lg:grid-cols-3 2xl:grid-cols-4">
            {visible.map((item) => (
              <SubscriptionGridCard key={item.id} item={item} onOpen={() => setSelected(item)} />
            ))}
          </div>
        )}
        <TableFooter shown={visible.length} total={subscriptions.length} noun="subscriptions" />
      </Card>

      <Card className="overflow-hidden">
        <CardHeader
          title="Upcoming Renewals"
          subtitle="Payments expected within the next 30 days."
          action={<Button variant="ghost">View all</Button>}
        />
        {upcoming.length === 0 ? (
          <EmptyState
            compact
            icon={CalendarClock}
            title="No upcoming renewals"
            description="You’re all caught up for the next 30 days."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 border-t border-border p-2.5 sm:p-4 sm:pt-3.5 lg:grid-cols-2">
            {upcoming.map((item, index) => (
              <RenewalCard
                key={item.id}
                item={item}
                urgent={index < 2}
                dueLabel={index < 2 ? `In ${4 + index * 2} days` : "Later this month"}
                onView={() => setSelected(item)}
              />
            ))}
          </div>
        )}
      </Card>

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
    </PageStack>
  );
}
