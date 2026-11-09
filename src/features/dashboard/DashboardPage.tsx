"use client";

import { useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  FileText,
  ReceiptText,
  RefreshCw,
  TrendingDown,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import "./dashboard.css";
import { Badge, Button, Card, SectionHeader, type Tone } from "@/components/ui/primitives";
import { currentUser } from "@/lib/nav";
import { SummaryCard } from "./components/SummaryCard";
import { SpendingChart } from "./components/SpendingChart";

const payments: { icon: LucideIcon; title: string; meta: string; date: string; amount: string; status: string; tone: Tone }[] = [
  { icon: CircleDollarSign, title: "Home loan EMI", meta: "HDFC Bank", date: "12 Jun", amount: "₹28,450", status: "Auto-pay", tone: "indigo" },
  { icon: CreditCard, title: "Electricity bill", meta: "Tata Power", date: "15 Jun", amount: "₹2,840", status: "Due soon", tone: "amber" },
  { icon: RefreshCw, title: "Figma Professional", meta: "Subscription", date: "18 Jun", amount: "₹1,250", status: "Auto-pay", tone: "emerald" },
  { icon: WalletCards, title: "Credit card bill", meta: "ICICI Bank", date: "22 Jun", amount: "₹14,680", status: "Scheduled", tone: "slate" },
];

const activities: { title: string; merchant: string; category: string; date: string; amount: string; tone: Tone; positive?: boolean }[] = [
  { title: "Grocery shopping", merchant: "Nature's Basket", category: "Groceries", date: "08 Jun 2025", amount: "− ₹3,240", tone: "emerald" },
  { title: "Flight booking", merchant: "IndiGo", category: "Travel", date: "07 Jun 2025", amount: "− ₹8,690", tone: "indigo" },
  { title: "Salary credited", merchant: "Acme Technologies", category: "Income", date: "05 Jun 2025", amount: "+ ₹1,42,000", tone: "emerald", positive: true },
  { title: "Internet bill", merchant: "Airtel Fiber", category: "Utilities", date: "04 Jun 2025", amount: "− ₹1,499", tone: "amber" },
];

const categories: { name: string; amount: string; tone: Tone }[] = [
  { name: "Housing", amount: "₹28,450", tone: "indigo" },
  { name: "Food & dining", amount: "₹15,240", tone: "emerald" },
  { name: "Travel", amount: "₹10,820", tone: "amber" },
  { name: "Other", amount: "₹12,730", tone: "rose" },
];

const summaryCards: { icon: LucideIcon; label: string; value: string; detail: string; trend: "up" | "down" | "neutral"; tone: Tone }[] = [
  { icon: ReceiptText, label: "Monthly expenses", value: "₹67,240", detail: "8.2% vs last month", trend: "down", tone: "indigo" },
  { icon: CalendarDays, label: "Upcoming payments", value: "₹47,220", detail: "6 payments this month", trend: "neutral", tone: "amber" },
  { icon: CircleDollarSign, label: "Outstanding loans", value: "₹8,42,600", detail: "₹28,450 paid this month", trend: "down", tone: "rose" },
  { icon: RefreshCw, label: "Active subscriptions", value: "₹4,820", detail: "2 renewals this week", trend: "up", tone: "emerald" },
];

const documentAlerts: { title: string; meta: string; badge: string; tone: Tone }[] = [
  { title: "Passport renewal", meta: "Expires 13 Jul 2025", badge: "32 days", tone: "rose" },
  { title: "Car insurance", meta: "Renews 28 Jul 2025", badge: "47 days", tone: "amber" },
];

const periods = ["Last 3 months", "Last 6 months", "This year"];

export function DashboardPage() {
  const [periodOpen, setPeriodOpen] = useState(false);
  const [period, setPeriod] = useState("Last 6 months");

  return (
    <>
      <div className="welcome">
        <div>
          <div className="eyebrow">
            <span className="status-dot" /> Wednesday, 11 June
          </div>
          <div className="welcome-title">Good morning, {currentUser.name.split(" ")[0]}</div>
          <div className="welcome-subtitle">Here&apos;s your personal financial overview.</div>
        </div>
        <div className="sync-state">
          <Check size="0.9375rem" />
          <span>All accounts synced</span>
          <small>2 min ago</small>
        </div>
      </div>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      <div className="dashboard-grid top-grid">
        <Card className="analytics-card">
          <SectionHeader
            title="Expense analytics"
            subtitle="Your spending trend over time"
            action={
              <div className="dropdown-wrap">
                <Button variant="secondary" onClick={() => setPeriodOpen(!periodOpen)}>
                  {period}
                  <ChevronDown size="0.9375rem" />
                </Button>
                {periodOpen && (
                  <div className="dropdown-menu">
                    {periods.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => {
                          setPeriod(item);
                          setPeriodOpen(false);
                        }}
                        className={item === period ? "selected" : ""}
                      >
                        {item}
                        {item === period && <Check size="0.875rem" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            }
          />
          <div className="analytics-summary">
            <strong>₹3,48,920</strong>
            <span>Total spent</span>
            <Badge tone="emerald">
              <TrendingDown size="0.75rem" /> 6.4%
            </Badge>
          </div>
          <SpendingChart />
        </Card>

        <Card className="payments-card">
          <SectionHeader
            title="Upcoming payments"
            subtitle="Next 30 days"
            action={<Button variant="ghost">View all</Button>}
          />
          <div className="payment-list">
            {payments.map(({ icon: Icon, title, meta, date, amount, status, tone }) => (
              <div className="payment-row" key={title}>
                <span className={`icon-tile icon-${tone}`}>
                  <Icon size="1.125rem" />
                </span>
                <span className="payment-main">
                  <strong>{title}</strong>
                  <small>{meta}</small>
                </span>
                <span className="payment-date">
                  <strong>{amount}</strong>
                  <small>{date}</small>
                </span>
                <Badge tone={tone}>{status}</Badge>
              </div>
            ))}
          </div>
          <div className="payments-footer">
            <span>Total upcoming</span>
            <strong>₹47,220</strong>
          </div>
        </Card>
      </div>

      <div className="dashboard-grid bottom-grid">
        <Card className="activity-card">
          <SectionHeader
            title="Recent activity"
            subtitle="Your latest transactions"
            action={<Button variant="ghost">View all</Button>}
          />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((item) => (
                  <tr key={item.title}>
                    <td>
                      <span className={`table-icon icon-${item.tone}`}>
                        <ReceiptText size="1rem" />
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.merchant}</small>
                        <small className="mobile-transaction-meta">
                          {item.category} · {item.date.replace(" 2025", "")}
                        </small>
                      </span>
                    </td>
                    <td>
                      <Badge>{item.category}</Badge>
                    </td>
                    <td>{item.date}</td>
                    <td className={item.positive ? "positive" : ""}>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="side-stack">
          <Card className="breakdown-card">
            <SectionHeader title="Spending by category" />
            <div className="donut-row">
              <div className="donut">
                <div>
                  <strong>₹67.2k</strong>
                  <span>Total</span>
                </div>
              </div>
              <div className="category-list">
                {categories.map((item) => (
                  <div className="category-row" key={item.name}>
                    <span className={`legend legend-${item.tone}`} />
                    <span>{item.name}</span>
                    <strong>{item.amount}</strong>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="alerts-card">
            <SectionHeader title="Document alerts" action={<Badge tone="amber">2 upcoming</Badge>} />
            {documentAlerts.map(({ title, meta, badge, tone }) => (
              <div className="alert-row" key={title}>
                <span className={`icon-tile icon-${tone}`}>
                  <FileText size="1.125rem" />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{meta}</small>
                </span>
                <Badge tone={tone}>{badge}</Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
