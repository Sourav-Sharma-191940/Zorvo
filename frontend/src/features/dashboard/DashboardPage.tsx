"use client";

import { useState } from "react";
import {
  CalendarDays,
  Check,
  CircleDollarSign,
  CreditCard,
  FileText,
  ReceiptText,
  RefreshCw,
  TrendingDown,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  IconTile,
  SectionHeader,
  type Tone,
} from "@/shared/ui/primitives";
import { CardHeader } from "@/shared/ui/PageHeader";
import { PageStack } from "@/shared/ui/layout";
import { Select } from "@/shared/ui/Select";
import { StatGrid } from "@/shared/ui/StatCard";
import {
  CellMain,
  DataTable,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/shared/ui/table";
import { cn } from "@/shared/lib/utils";
import { currentUser } from "@/shared/config/nav";
import { SummaryCard } from "./components/SummaryCard";
import { SpendingChart } from "./components/SpendingChart";

const payments: {
  icon: LucideIcon;
  title: string;
  meta: string;
  date: string;
  amount: string;
  status: string;
  tone: Tone;
}[] = [
  {
    icon: CircleDollarSign,
    title: "Home loan EMI",
    meta: "HDFC Bank",
    date: "12 Jun",
    amount: "₹28,450",
    status: "Auto-pay",
    tone: "indigo",
  },
  {
    icon: CreditCard,
    title: "Electricity bill",
    meta: "Tata Power",
    date: "15 Jun",
    amount: "₹2,840",
    status: "Due soon",
    tone: "amber",
  },
  {
    icon: RefreshCw,
    title: "Figma Professional",
    meta: "Subscription",
    date: "18 Jun",
    amount: "₹1,250",
    status: "Auto-pay",
    tone: "emerald",
  },
  {
    icon: WalletCards,
    title: "Credit card bill",
    meta: "ICICI Bank",
    date: "22 Jun",
    amount: "₹14,680",
    status: "Scheduled",
    tone: "slate",
  },
];

const activities: {
  title: string;
  merchant: string;
  category: string;
  date: string;
  amount: string;
  tone: Tone;
  positive?: boolean;
}[] = [
  {
    title: "Grocery shopping",
    merchant: "Nature's Basket",
    category: "Groceries",
    date: "08 Jun 2025",
    amount: "− ₹3,240",
    tone: "emerald",
  },
  {
    title: "Flight booking",
    merchant: "IndiGo",
    category: "Travel",
    date: "07 Jun 2025",
    amount: "− ₹8,690",
    tone: "indigo",
  },
  {
    title: "Salary credited",
    merchant: "Acme Technologies",
    category: "Income",
    date: "05 Jun 2025",
    amount: "+ ₹1,42,000",
    tone: "emerald",
    positive: true,
  },
  {
    title: "Internet bill",
    merchant: "Airtel Fiber",
    category: "Utilities",
    date: "04 Jun 2025",
    amount: "− ₹1,499",
    tone: "amber",
  },
];

const categories: { name: string; amount: number; tone: Tone }[] = [
  { name: "Housing", amount: 28450, tone: "indigo" },
  { name: "Food & dining", amount: 15240, tone: "emerald" },
  { name: "Travel", amount: 10820, tone: "amber" },
  { name: "Other", amount: 12730, tone: "rose" },
];

/** Theme colour for each tone, used by the donut slices and legend dots. */
const toneColor: Record<Tone, string> = {
  indigo: "var(--primary-accent)",
  emerald: "var(--success)",
  amber: "var(--chart-amber)",
  rose: "var(--chart-rose)",
  slate: "var(--chart-slate)",
};

const categoryTotal = categories.reduce((sum, item) => sum + item.amount, 0);

/** One conic-gradient slice per category, sized by its share of the total. */
const donutBackground = (() => {
  let start = 0;
  const stops = categories.map((item) => {
    const end = start + (item.amount / categoryTotal) * 100;
    const stop = `${toneColor[item.tone]} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    start = end;
    return stop;
  });
  return `conic-gradient(${stops.join(", ")})`;
})();

const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const summaryCards: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  trend: "up" | "down" | "neutral";
  tone: Tone;
}[] = [
  {
    icon: ReceiptText,
    label: "Monthly expenses",
    value: "₹67,240",
    detail: "8.2% vs last month",
    trend: "down",
    tone: "indigo",
  },
  {
    icon: CalendarDays,
    label: "Upcoming payments",
    value: "₹47,220",
    detail: "6 payments this month",
    trend: "neutral",
    tone: "amber",
  },
  {
    icon: CircleDollarSign,
    label: "Outstanding loans",
    value: "₹8,42,600",
    detail: "₹28,450 paid this month",
    trend: "down",
    tone: "rose",
  },
  {
    icon: RefreshCw,
    label: "Active subscriptions",
    value: "₹4,820",
    detail: "2 renewals this week",
    trend: "up",
    tone: "emerald",
  },
];

const documentAlerts: {
  title: string;
  meta: string;
  badge: string;
  tone: Tone;
}[] = [
  {
    title: "Passport renewal",
    meta: "Expires 13 Jul 2025",
    badge: "32 days",
    tone: "rose",
  },
  {
    title: "Car insurance",
    meta: "Renews 28 Jul 2025",
    badge: "47 days",
    tone: "amber",
  },
];

const periods = ["Last 3 months", "Last 6 months", "This year"];

export function DashboardPage() {
  const [period, setPeriod] = useState("Last 6 months");

  return (
    <PageStack>
      <div className="flex items-end justify-between">
        <div>
          <div className="mb-1.75 flex items-center gap-1.75 text-2xs font-semibold tracking-wider text-muted-foreground uppercase sm:text-xs">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-success ring-3 ring-success-soft"
            />{" "}
            Wednesday, 11 June
          </div>
          <h1>Good morning, {currentUser.name.split(" ")[0]}</h1>
          <p className="mt-0.5 text-md text-muted-foreground sm:mt-1 sm:text-base">
            Here&apos;s your personal financial overview.
          </p>
        </div>
        <div className="hidden grid-cols-[1.125rem_auto] items-center gap-x-1.25 text-success sm:grid">
          <Check size="0.9375rem" />
          <span className="text-xs font-semibold">All accounts synced</span>
          <small className="col-start-2 text-2xs text-subtle-foreground">
            2 min ago
          </small>
        </div>
      </div>

      <StatGrid>
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </StatGrid>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5 *:min-w-0 sm:gap-3.5 lg:grid-cols-[minmax(0,1.22fr)_minmax(25rem,0.78fr)]">
        <Card className="p-3.75 sm:p-4.75">
          <SectionHeader
            title="Expense analytics"
            subtitle="Your spending trend over time"
            action={
              <Select
                value={period}
                onChange={setPeriod}
                label="Select analytics period"
              >
                {periods.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            }
          />
          <div className="mt-2 flex items-center gap-2.25 sm:mt-2.75">
            <strong className="text-3xl tracking-tight">₹3,48,920</strong>
            <span className="hidden text-xs text-subtle-foreground sm:inline">
              Total spent
            </span>
            <Badge tone="emerald">
              <TrendingDown size="0.75rem" /> 6.4%
            </Badge>
          </div>
          <SpendingChart />
        </Card>

        <Card className="p-3.75 sm:p-4.75">
          <SectionHeader
            title="Upcoming payments"
            subtitle="Next 30 days"
            action={<Button variant="ghost">View all</Button>}
          />
          <div className="mt-1 sm:mt-1.75">
            {payments.map(
              ({ icon: Icon, title, meta, date, amount, status, tone }) => (
                <div
                  key={title}
                  className="grid min-h-14.5 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-border sm:grid-cols-[2.25rem_minmax(6.875rem,1fr)_4.1875rem_3.875rem] sm:gap-2.5"
                >
                  <IconTile tone={tone} className="size-8">
                    <Icon size="1.125rem" />
                  </IconTile>
                  <span className="flex min-w-0 flex-col gap-0.75">
                    <strong className="truncate text-xs font-semibold">
                      {title}
                    </strong>
                    <small className="text-2xs text-subtle-foreground">
                      {meta}
                    </small>
                  </span>
                  <span className="flex min-w-15.5 flex-col items-end gap-0.75 tabular-nums sm:min-w-0">
                    <strong className="truncate text-xs font-semibold">
                      {amount}
                    </strong>
                    <small className="text-2xs text-subtle-foreground">
                      {date}
                    </small>
                  </span>
                  <Badge tone={tone} className="max-sm:hidden">
                    {status}
                  </Badge>
                </div>
              ),
            )}
          </div>
          <div className="flex justify-between pt-3.5 text-xs text-muted-foreground">
            <span>Total upcoming</span>
            <strong className="text-md text-foreground">₹47,220</strong>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-2.5 *:min-w-0 sm:gap-3.5 lg:grid-cols-[minmax(0,1.52fr)_minmax(22.5rem,0.72fr)]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Recent activity"
            subtitle="Your latest transactions"
            action={<Button variant="ghost">View all</Button>}
          />
          <DataTable>
            <THead>
              <TH>Description</TH>
              <TH>Category</TH>
              <TH>Date</TH>
              <TH align="right">Amount</TH>
            </THead>
            <TBody>
              {activities.map((item) => (
                <TR key={item.title}>
                  <TD primary>
                    <CellMain
                      icon={
                        <IconTile
                          tone={item.tone}
                          className="size-7 rounded-sm"
                        >
                          <ReceiptText size="1rem" />
                        </IconTile>
                      }
                      title={item.title}
                      subtitle={item.merchant}
                    />
                  </TD>
                  <TD label="Category">
                    <Badge>{item.category}</Badge>
                  </TD>
                  <TD label="Date">{item.date}</TD>
                  <TD
                    label="Amount"
                    align="right"
                    className={cn(
                      "font-semibold tabular-nums max-sm:text-right",
                      item.positive ? "text-success" : "text-foreground",
                    )}
                  >
                    {item.amount}
                  </TD>
                </TR>
              ))}
            </TBody>
          </DataTable>
        </Card>

        <div className="grid gap-2.5 *:min-w-0 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-1">
          <Card className="p-3.75 sm:p-4.75">
            <SectionHeader title="Spending by category" />
            <div className="mt-3 mb-1 flex items-center justify-center gap-5 sm:mt-3.5 sm:mb-0 sm:justify-start sm:gap-6">
              <div
                role="img"
                aria-label={`Spending by category, ${rupees(categoryTotal)} in total`}
                className="relative grid size-26 shrink-0 place-items-center rounded-full sm:size-28"
                style={{ background: donutBackground }}
              >
                <span
                  aria-hidden
                  className="absolute inset-3.25 rounded-full bg-card"
                />
                <div className="z-1 flex flex-col items-center">
                  <strong className="text-lg">₹67.2k</strong>
                  <span className="text-3xs text-subtle-foreground">Total</span>
                </div>
              </div>
              <ul className="grid max-w-45 flex-1 gap-2.5 sm:max-w-none">
                {categories.map((item) => (
                  <li
                    key={item.name}
                    className="grid grid-cols-[0.4375rem_1fr_auto] items-center gap-1.5 text-2xs text-muted-foreground"
                  >
                    <i
                      aria-hidden
                      className="size-1.75 rounded-xs"
                      style={{ background: toneColor[item.tone] }}
                    />
                    <span>{item.name}</span>
                    <strong className="text-2xs font-semibold text-foreground">
                      {rupees(item.amount)}
                    </strong>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="p-3.75 pb-0.75 sm:p-4.75 sm:pb-1.25">
            <SectionHeader
              title="Document alerts"
              action={<Badge tone="amber">2 upcoming</Badge>}
            />
            <div className="mt-2">
              {documentAlerts.map(({ title, meta, badge, tone }) => (
                <div
                  key={title}
                  className="grid min-h-14.5 grid-cols-[2.125rem_1fr_auto] items-center gap-2.5 border-t border-border"
                >
                  <IconTile tone={tone} className="size-8">
                    <FileText size="1.125rem" />
                  </IconTile>
                  <span className="flex flex-col gap-0.75">
                    <strong className="text-xs">{title}</strong>
                    <small className="text-2xs text-subtle-foreground">
                      {meta}
                    </small>
                  </span>
                  <Badge tone={tone}>{badge}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageStack>
  );
}
