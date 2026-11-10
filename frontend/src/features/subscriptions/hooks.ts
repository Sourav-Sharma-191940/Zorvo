import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubscription,
  deleteSubscription,
  fetchSubscriptions,
  updateSubscription,
  type NewSubscription,
} from "./api";
import type { Subscription } from "./data";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  list: () => [...subscriptionKeys.all, "list"] as const,
};

export function useSubscriptions() {
  return useQuery({ queryKey: subscriptionKeys.list(), queryFn: () => fetchSubscriptions() });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewSubscription) => createSubscription(input),
    onSuccess: (created) => {
      queryClient.setQueryData<Subscription[]>(subscriptionKeys.list(), (current) => [
        ...(current ?? []),
        created,
      ]);
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Subscription) => updateSubscription(input),
    onSuccess: (updated) => {
      queryClient.setQueryData<Subscription[]>(subscriptionKeys.list(), (current) =>
        (current ?? []).map((item) => (item.id === updated.id ? updated : item)),
      );
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSubscription(id),
    onSuccess: (_result, id) => {
      queryClient.setQueryData<Subscription[]>(subscriptionKeys.list(), (current) =>
        (current ?? []).filter((item) => item.id !== id),
      );
    },
  });
}
