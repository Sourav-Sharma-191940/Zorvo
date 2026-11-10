import { isBackendConfigured, request } from "@/shared/lib/api/client";
import { transactionFixtures, type Transaction } from "./data";

/**
 * Expenses data access — the single seam between the UI and the data source.
 * Returns fixtures until NEXT_PUBLIC_API_BASE_URL is set, then calls `/transactions`.
 * The UI layer (hooks + components) does not change when the backend arrives.
 */

export async function fetchTransactions(): Promise<Transaction[]> {
  if (isBackendConfigured) {
    return request<Transaction[]>("/transactions");
  }
  return transactionFixtures;
}

export type NewTransaction = Omit<Transaction, "id" | "merchant">;

export async function createTransaction(input: NewTransaction): Promise<Transaction> {
  if (isBackendConfigured) {
    return request<Transaction>("/transactions", { method: "POST", body: input });
  }
  return { ...input, id: Date.now(), merchant: "Manually added" };
}

export async function deleteTransaction(id: number): Promise<void> {
  if (isBackendConfigured) {
    await request<null>(`/transactions/${id}`, { method: "DELETE" });
  }
}
