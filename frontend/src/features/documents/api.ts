import { isBackendConfigured, request } from "@/shared/lib/api/client";
import { documentRecords, type DocumentRecord } from "./data";

/**
 * Documents data access — the single seam between the UI and the data source.
 *
 * Today these functions resolve in-memory fixtures. When the backend is live
 * (NEXT_PUBLIC_API_BASE_URL set), they call `/documents` instead. The UI layer
 * (hooks + components) never changes when that switch flips.
 */

export interface DocumentListParams {
  query?: string;
  category?: string;
}

export async function fetchDocuments(params: DocumentListParams = {}): Promise<DocumentRecord[]> {
  if (isBackendConfigured) {
    return request<DocumentRecord[]>("/documents", {
      searchParams: { search: params.query, category: params.category },
    });
  }

  // Fixture fallback: filtering happens server-side once the backend exists,
  // so we keep this intentionally thin and mirror that contract.
  return documentRecords;
}

export async function deleteDocument(id: number): Promise<void> {
  if (isBackendConfigured) {
    await request<null>(`/documents/${id}`, { method: "DELETE" });
    return;
  }
  // No-op for fixtures; the caller updates local cache optimistically.
}
