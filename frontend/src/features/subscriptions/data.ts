export type SubscriptionStatus = "Active" | "Trial" | "Paused" | "Cancelled" | "Expiring soon";
export type BillingFrequency = "Weekly" | "Monthly" | "Quarterly" | "Yearly";

export interface Subscription {
  id: number;
  name: string;
  initials: string;
  brand: string;
  category: string;
  plan: string;
  amount: number;
  frequency: BillingFrequency;
  renewal: string;
  renewalISO: string;
  start: string;
  status: SubscriptionStatus;
  payment: string;
  account: string;
  website: string;
  reminder: boolean;
  reminderTiming: string;
  notes: string;
}

export const subscriptionCategories = [
  "Entertainment",
  "Music",
  "Productivity",
  "Cloud Storage",
  "Utilities",
  "Health & Fitness",
  "Education",
  "Other",
];

export const subscriptionFixtures: Subscription[] = [
  {
    id: 1,
    name: "Netflix",
    initials: "N",
    brand: "netflix",
    category: "Entertainment",
    plan: "Premium",
    amount: 649,
    frequency: "Monthly",
    renewal: "12 Oct 2026",
    renewalISO: "2026-10-12",
    start: "12 Mar 2023",
    status: "Active",
    payment: "Credit Card",
    account: "HDFC Regalia • 4821",
    website: "netflix.com",
    reminder: true,
    reminderTiming: "3 days before",
    notes: "Shared family plan with four profiles.",
  },
  {
    id: 2,
    name: "Spotify",
    initials: "S",
    brand: "spotify",
    category: "Music",
    plan: "Individual",
    amount: 119,
    frequency: "Monthly",
    renewal: "14 Oct 2026",
    renewalISO: "2026-10-14",
    start: "14 Jun 2024",
    status: "Active",
    payment: "UPI",
    account: "Google Pay • sourav@okhdfcbank",
    website: "spotify.com",
    reminder: true,
    reminderTiming: "1 day before",
    notes: "Personal music subscription.",
  },
  {
    id: 3,
    name: "YouTube Premium",
    initials: "YT",
    brand: "youtube",
    category: "Entertainment",
    plan: "Family",
    amount: 299,
    frequency: "Monthly",
    renewal: "18 Oct 2026",
    renewalISO: "2026-10-18",
    start: "18 Aug 2024",
    status: "Trial",
    payment: "Debit Card",
    account: "ICICI Debit • 1074",
    website: "youtube.com/premium",
    reminder: true,
    reminderTiming: "7 days before",
    notes: "Trial ends on the next renewal date.",
  },
  {
    id: 4,
    name: "Google One",
    initials: "G",
    brand: "google",
    category: "Cloud Storage",
    plan: "2 TB",
    amount: 6500,
    frequency: "Yearly",
    renewal: "26 Oct 2026",
    renewalISO: "2026-10-26",
    start: "26 Oct 2022",
    status: "Expiring soon",
    payment: "Credit Card",
    account: "HDFC Regalia • 4821",
    website: "one.google.com",
    reminder: true,
    reminderTiming: "7 days before",
    notes: "Storage shared with the household group.",
  },
  {
    id: 5,
    name: "Microsoft 365",
    initials: "M",
    brand: "microsoft",
    category: "Productivity",
    plan: "Personal",
    amount: 4899,
    frequency: "Yearly",
    renewal: "08 Dec 2026",
    renewalISO: "2026-12-08",
    start: "08 Dec 2023",
    status: "Active",
    payment: "Credit Card",
    account: "Axis Ace • 3390",
    website: "microsoft.com/microsoft-365",
    reminder: true,
    reminderTiming: "30 days before",
    notes: "Includes Office apps and 1 TB OneDrive storage.",
  },
  {
    id: 6,
    name: "Amazon Prime",
    initials: "a",
    brand: "amazon",
    category: "Entertainment",
    plan: "Prime Annual",
    amount: 1499,
    frequency: "Yearly",
    renewal: "21 Jan 2027",
    renewalISO: "2027-01-21",
    start: "21 Jan 2021",
    status: "Active",
    payment: "UPI",
    account: "PhonePe • sourav@ybl",
    website: "amazon.in/prime",
    reminder: true,
    reminderTiming: "7 days before",
    notes: "Annual shopping, video, and music membership.",
  },
  {
    id: 7,
    name: "Cult.fit",
    initials: "C",
    brand: "cult",
    category: "Health & Fitness",
    plan: "Elite",
    amount: 12490,
    frequency: "Yearly",
    renewal: "03 Feb 2027",
    renewalISO: "2027-02-03",
    start: "03 Feb 2025",
    status: "Paused",
    payment: "Credit Card",
    account: "Axis Ace • 3390",
    website: "cult.fit",
    reminder: false,
    reminderTiming: "7 days before",
    notes: "Membership paused while travelling.",
  },
];

export const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

/** Monthly-normalised cost for a subscription, used for spending estimates. */
export const monthlyAmount = (item: Subscription) =>
  item.amount /
  (item.frequency === "Yearly"
    ? 12
    : item.frequency === "Quarterly"
      ? 3
      : item.frequency === "Weekly"
        ? 0.23
        : 1);

export const activeStatuses: SubscriptionStatus[] = ["Active", "Trial", "Expiring soon"];

/** Whole days from today until the given ISO date (negative if already past). */
export const daysUntil = (iso: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
};
