"use client";

import { useState, type ReactNode } from "react";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/shared/ui/toast";
import { ApiError } from "./types";

/**
 * Per-request opt-out: `useQuery({ ..., meta: { silentError: true } })` when a
 * screen shows its own error UI and doesn't want the global toast.
 */
declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: { silentError?: boolean };
    mutationMeta: { silentError?: boolean };
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "network_error") return "Can't reach the server. Check your connection.";
    return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}

/**
 * App-wide TanStack Query provider. One client per browser session, created
 * lazily so it is not shared across server renders. Every failed query or
 * mutation shows an error toast automatically, so pages don't need to.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.meta?.silentError) return;
            // Background refetch failures of data already on screen stay quiet.
            if (query.state.data !== undefined) return;
            toast.error("Couldn't load data", {
              description: errorMessage(error),
              id: `query:${query.queryHash}`,
            });
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.silentError) return;
            toast.error("Couldn't save changes", { description: errorMessage(error) });
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
