import { isBackendConfigured, request } from "@/shared/lib/api/client";
import { loanFixtures, scheduleFixture, type Loan, type ScheduleEntry } from "./data";

/**
 * Loans data access — the single seam between the UI and the data source.
 * Fixtures today; `/loans` endpoints once NEXT_PUBLIC_API_BASE_URL is set.
 */

export async function fetchLoans(): Promise<Loan[]> {
  if (isBackendConfigured) {
    return request<Loan[]>("/loans");
  }
  return loanFixtures;
}

export type NewLoan = Omit<Loan, "id" | "status" | "tenure" | "remaining" | "progress"> & {
  notes: string;
};

export async function createLoan(input: NewLoan): Promise<Loan> {
  if (isBackendConfigured) {
    return request<Loan>("/loans", { method: "POST", body: input });
  }
  const progress =
    input.original > 0
      ? Math.round(((input.original - input.outstanding) / input.original) * 100)
      : 0;
  return {
    ...input,
    id: Date.now(),
    status: "Active",
    tenure: "Custom tenure",
    remaining: 0,
    progress,
  };
}

export async function deleteLoan(id: number): Promise<void> {
  if (isBackendConfigured) {
    await request<null>(`/loans/${id}`, { method: "DELETE" });
  }
}

export async function fetchSchedule(loanId: number): Promise<ScheduleEntry[]> {
  if (isBackendConfigured) {
    return request<ScheduleEntry[]>(`/loans/${loanId}/schedule`);
  }
  return scheduleFixture;
}
