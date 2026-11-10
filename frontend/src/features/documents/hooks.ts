import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDocument, fetchDocuments } from "./api";
import type { DocumentRecord } from "./data";

export const documentKeys = {
  all: ["documents"] as const,
  list: () => [...documentKeys.all, "list"] as const,
};

/** Load the document list. Returns TanStack Query state (data, isLoading, error). */
export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.list(),
    queryFn: () => fetchDocuments(),
  });
}

/** Delete a document and update the cached list. */
export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDocument(id),
    onSuccess: (_result, id) => {
      queryClient.setQueryData<DocumentRecord[]>(documentKeys.list(), (current) =>
        (current ?? []).filter((item) => item.id !== id),
      );
    },
  });
}
