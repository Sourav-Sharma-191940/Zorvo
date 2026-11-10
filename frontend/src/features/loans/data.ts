export type LoanStatus = "Active" | "Closed";

export interface Loan {
  id: number;
  name: string;
  lender: string;
  type: string;
  original: number;
  outstanding: number;
  rate: number;
  emi: number;
  due: string;
  status: LoanStatus;
  start: string;
  end: string;
  tenure: string;
  remaining: number;
  progress: number;
  notes: string;
}

export interface ScheduleEntry {
  number: number;
  date: string;
  principal: number;
  interest: number;
  total: number;
  balance: number;
  status: "Paid" | "Due soon" | "Upcoming" | "Overdue";
}

export const loanTypes = [
  "Home Loan",
  "Personal Loan",
  "Car Loan",
  "Education Loan",
  "Gold Loan",
  "Business Loan",
  "Other",
];

export const loanFixtures: Loan[] = [
  { id: 1, name: "Home Loan", lender: "HDFC Bank", type: "Home Loan", original: 1000000, outstanding: 682600, rate: 8.5, emi: 28450, due: "12 Oct 2026", status: "Active", start: "12 Jan 2024", end: "12 Dec 2033", tenure: "120 months", remaining: 87, progress: 32, notes: "Primary residence loan. EMI is debited from HDFC Savings." },
  { id: 2, name: "Personal Loan", lender: "ICICI Bank", type: "Personal Loan", original: 200000, outstanding: 110000, rate: 11.5, emi: 4800, due: "18 Oct 2026", status: "Active", start: "18 Mar 2025", end: "18 Feb 2029", tenure: "48 months", remaining: 29, progress: 45, notes: "Personal loan used for home improvements." },
  { id: 3, name: "Car Loan", lender: "Axis Bank", type: "Car Loan", original: 100000, outstanding: 50000, rate: 9.2, emi: 1000, due: "22 Oct 2026", status: "Active", start: "22 Nov 2023", end: "22 Oct 2028", tenure: "60 months", remaining: 25, progress: 50, notes: "Vehicle finance agreement for the family car." },
];

/** Illustrative schedule used by the EMI schedule modal until the backend computes it. */
export const scheduleFixture: ScheduleEntry[] = [
  { number: 31, date: "12 Aug 2026", principal: 22980, interest: 5470, total: 28450, balance: 728100, status: "Paid" },
  { number: 32, date: "12 Sep 2026", principal: 23140, interest: 5310, total: 28450, balance: 704960, status: "Paid" },
  { number: 33, date: "12 Oct 2026", principal: 23310, interest: 5140, total: 28450, balance: 681650, status: "Due soon" },
  { number: 34, date: "12 Nov 2026", principal: 23470, interest: 4980, total: 28450, balance: 658180, status: "Upcoming" },
  { number: 35, date: "12 Dec 2026", principal: 23640, interest: 4810, total: 28450, balance: 634540, status: "Upcoming" },
];

export const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;
