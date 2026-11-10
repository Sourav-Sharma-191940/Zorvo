export type DocumentStatus = "Valid" | "Expiring Soon" | "Expired";

export interface DocumentRecord {
  id: number;
  name: string;
  category: string;
  type: string;
  size: string;
  added: string;
  expiry: string;
  status: DocumentStatus;
  notes: string;
}

export const documentCategories = [
  "All Documents",
  "Identity",
  "Financial",
  "Property",
  "Insurance",
  "Medical",
  "Employment",
  "Other",
] as const;

export const documentRecords: DocumentRecord[] = [
  {
    id: 1,
    name: "Aadhaar Card",
    category: "Identity",
    type: "PDF",
    size: "1.2 MB",
    added: "12 Jan 2026",
    expiry: "Not Applicable",
    status: "Valid",
    notes: "Primary identity document.",
  },
  {
    id: 2,
    name: "PAN Card",
    category: "Identity",
    type: "PDF",
    size: "840 KB",
    added: "10 Jan 2026",
    expiry: "Not Applicable",
    status: "Valid",
    notes: "Tax identification document.",
  },
  {
    id: 3,
    name: "Passport",
    category: "Identity",
    type: "PDF",
    size: "2.4 MB",
    added: "15 Jun 2025",
    expiry: "13 Jul 2025",
    status: "Expired",
    notes: "Renewal appointment needs to be scheduled.",
  },
  {
    id: 4,
    name: "Home Loan Agreement",
    category: "Financial",
    type: "PDF",
    size: "5.8 MB",
    added: "02 Mar 2026",
    expiry: "Not Applicable",
    status: "Valid",
    notes: "Signed home loan agreement and repayment schedule.",
  },
  {
    id: 5,
    name: "Car Insurance Policy",
    category: "Insurance",
    type: "PDF",
    size: "1.7 MB",
    added: "28 Jul 2025",
    expiry: "28 Jul 2026",
    status: "Expiring Soon",
    notes: "Comprehensive vehicle insurance policy.",
  },
  {
    id: 6,
    name: "Salary Slips",
    category: "Employment",
    type: "PDF",
    size: "920 KB",
    added: "01 Sep 2026",
    expiry: "Not Applicable",
    status: "Valid",
    notes: "Consolidated salary slips for the current year.",
  },
  {
    id: 7,
    name: "Property Registry",
    category: "Property",
    type: "PDF",
    size: "8.1 MB",
    added: "18 Feb 2026",
    expiry: "Not Applicable",
    status: "Valid",
    notes: "Registered property ownership document.",
  },
  {
    id: 8,
    name: "Health Insurance",
    category: "Insurance",
    type: "PDF",
    size: "2.1 MB",
    added: "20 Aug 2026",
    expiry: "20 Aug 2027",
    status: "Valid",
    notes: "Family health insurance policy.",
  },
];
