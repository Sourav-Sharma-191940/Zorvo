import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  type NewTransaction,
} from "./api";
import type { Transaction } from "./data";

export const transactionKeys = {
  all: ["transactions"] as const,
  list: () => [...transactionKeys.all, "list"] as const,
};

export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.list(),
    queryFn: () => fetchTransactions(),
  });
}

function prepend(queryClient: ReturnType<typeof useQueryClient>, tx: Transaction) {
  queryClient.setQueryData<Transaction[]>(transactionKeys.list(), (current) => [
    tx,
    ...(current ?? []),
  ]);
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewTransaction) => createTransaction(input),
    onSuccess: (created) => prepend(queryClient, created),
  });
}

export function useDuplicateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tx: Transaction) =>
      createTransaction({
        description: `${tx.description} (copy)`,
        category: tx.category,
        date: tx.date,
        payment: tx.payment,
        type: tx.type,
        amount: tx.amount,
        notes: tx.notes,
      }),
    onSuccess: (created) => prepend(queryClient, created),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: (_result, id) => {
      queryClient.setQueryData<Transaction[]>(transactionKeys.list(), (current) =>
        (current ?? []).filter((item) => item.id !== id),
      );
    },
  });
}
