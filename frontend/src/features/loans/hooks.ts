import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLoan, deleteLoan, fetchLoans, fetchSchedule, type NewLoan } from "./api";
import type { Loan } from "./data";

export const loanKeys = {
  all: ["loans"] as const,
  list: () => [...loanKeys.all, "list"] as const,
  schedule: (loanId: number) => [...loanKeys.all, "schedule", loanId] as const,
};

export function useLoans() {
  return useQuery({ queryKey: loanKeys.list(), queryFn: () => fetchLoans() });
}

export function useLoanSchedule(loanId: number | null) {
  return useQuery({
    queryKey: loanKeys.schedule(loanId ?? -1),
    queryFn: () => fetchSchedule(loanId as number),
    enabled: loanId !== null,
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewLoan) => createLoan(input),
    onSuccess: (created) => {
      queryClient.setQueryData<Loan[]>(loanKeys.list(), (current) => [...(current ?? []), created]);
    },
  });
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLoan(id),
    onSuccess: (_result, id) => {
      queryClient.setQueryData<Loan[]>(loanKeys.list(), (current) =>
        (current ?? []).filter((loan) => loan.id !== id),
      );
    },
  });
}
