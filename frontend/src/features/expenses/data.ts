export type TransactionType = "Expense" | "Income";

export interface Transaction {
  id: number;
  description: string;
  merchant: string;
  category: string;
  date: string;
  payment: string;
  type: TransactionType;
  amount: number;
  notes?: string;
}

export const expenseCategories = [
  "Housing",
  "Groceries",
  "Food & Dining",
  "Transport",
  "Utilities",
  "Shopping",
  "Healthcare",
  "Travel",
  "Education",
  "Other",
];

export const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Interest",
  "Investment Returns",
  "Gift",
  "Other",
];

export const periods = [
  "This week",
  "This month",
  "Last month",
  "Last 3 months",
  "This year",
  "Custom range",
];

export const paymentMethods = ["UPI", "Credit card", "Debit card", "Bank transfer", "Cash"];

export interface CategoryBreakdownItem {
  name: string;
  amount: number;
  color: string;
}

export const categoryBreakdown: CategoryBreakdownItem[] = [
  { name: "Housing", amount: 28450, color: "indigo" },
  { name: "Food & Dining", amount: 15240, color: "emerald" },
  { name: "Travel", amount: 10820, color: "amber" },
  { name: "Utilities", amount: 6200, color: "blue" },
  { name: "Shopping", amount: 3800, color: "rose" },
  { name: "Other", amount: 2730, color: "slate" },
];

export const transactionFixtures: Transaction[] = [
  { id: 1, description: "Grocery shopping", merchant: "Nature's Basket", category: "Groceries", date: "08 Oct 2026", payment: "UPI", type: "Expense", amount: 3240, notes: "Weekly groceries and household supplies." },
  { id: 2, description: "Salary credited", merchant: "Acme Technologies", category: "Income", date: "05 Oct 2026", payment: "Bank transfer", type: "Income", amount: 142000, notes: "October salary." },
  { id: 3, description: "Electricity bill", merchant: "Tata Power", category: "Utilities", date: "04 Oct 2026", payment: "UPI", type: "Expense", amount: 1499 },
  { id: 4, description: "Restaurant dinner", merchant: "The Bombay Canteen", category: "Food & Dining", date: "03 Oct 2026", payment: "Credit card", type: "Expense", amount: 1850 },
  { id: 5, description: "Fuel", merchant: "Indian Oil", category: "Transport", date: "02 Oct 2026", payment: "UPI", type: "Expense", amount: 2100 },
  { id: 6, description: "Internet bill", merchant: "Airtel Fiber", category: "Utilities", date: "01 Oct 2026", payment: "UPI", type: "Expense", amount: 999 },
  { id: 7, description: "Flight booking", merchant: "IndiGo", category: "Travel", date: "29 Sep 2026", payment: "Credit card", type: "Expense", amount: 8690 },
  { id: 8, description: "Monthly rent", merchant: "Landlord transfer", category: "Housing", date: "01 Oct 2026", payment: "Bank transfer", type: "Expense", amount: 18000, notes: "October apartment rent." },
];

export const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
