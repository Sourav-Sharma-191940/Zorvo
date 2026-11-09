import { isBackendConfigured, request } from "@/lib/api/client";
import { subscriptionFixtures, type Subscription } from "./data";

/**
 * Subscriptions data access — the single seam between the UI and the data source.
 * Fixtures today; `/subscriptions` endpoints once NEXT_PUBLIC_API_BASE_URL is set.
 */

export async function fetchSubscriptions(): Promise<Subscription[]> {
  if (isBackendConfigured) {
    return request<Subscription[]>("/subscriptions");
  }
  return subscriptionFixtures;
}

export type NewSubscription = Omit<Subscription, "id">;

export async function createSubscription(input: NewSubscription): Promise<Subscription> {
  if (isBackendConfigured) {
    return request<Subscription>("/subscriptions", { method: "POST", body: input });
  }
  return { ...input, id: Date.now() };
}

export async function updateSubscription(input: Subscription): Promise<Subscription> {
  if (isBackendConfigured) {
    return request<Subscription>(`/subscriptions/${input.id}`, { method: "PUT", body: input });
  }
  return input;
}

export async function deleteSubscription(id: number): Promise<void> {
  if (isBackendConfigured) {
    await request<null>(`/subscriptions/${id}`, { method: "DELETE" });
  }
}
