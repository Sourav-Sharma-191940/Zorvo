import {
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileText,
  LayoutDashboard,
  ReceiptText,
  RefreshCw,
  Settings,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  count?: number;
  /** When true, the item renders but is not yet routable (placeholder page). */
  comingSoon?: boolean;
}

/**
 * Single source of truth for primary navigation.
 * Routes that are implemented point at real paths; the rest are flagged
 * `comingSoon` so the sidebar can render them without dead links.
 */
export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Documents", icon: FileText, href: "/documents" },
  { label: "Expenses", icon: ReceiptText, href: "/expenses" },
  { label: "Loans & EMIs", icon: CircleDollarSign, href: "/loans" },
  { label: "Subscriptions", icon: RefreshCw, href: "/subscriptions" },
  { label: "Bills & Payments", icon: CreditCard, href: "/bills", comingSoon: true },
  { label: "Reminders", icon: Clock3, href: "/reminders", count: 3, comingSoon: true },
  { label: "Analytics", icon: TrendingUp, href: "/analytics", comingSoon: true },
];

export const settingsNav: { label: string; icon: LucideIcon; href: string } = {
  label: "Settings",
  icon: Settings,
  href: "/settings",
};

export const currentUser = {
  name: "Sourav Kumar",
  email: "sourav@example.com",
  initials: "SK",
};
