import { ApiError, type ApiEnvelope } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * Whether the real backend is configured. Until NEXT_PUBLIC_API_BASE_URL is set,
 * feature `api.ts` modules fall back to in-memory fixtures. This lets the UI run
 * end-to-end before the backend exists, with a single switch to flip over.
 */
export const isBackendConfigured = BASE_URL.length > 0;

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
}

function buildUrl(path: string, searchParams?: RequestOptions["searchParams"]): string {
  const url = new URL(`${BASE_URL}${path}`, BASE_URL || "http://localhost");
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Typed request against the backend. Unwraps the standard envelope and throws
 * `ApiError` on error envelopes or transport failures. The returned value is the
 * `data` payload; use `requestWithMeta` when you also need pagination meta.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { data } = await requestWithMeta<T>(path, options);
  return data;
}

export async function requestWithMeta<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; meta: ApiEnvelope<T> extends { meta: infer M } ? M : null }> {
  const { method = "GET", body, searchParams, signal } = options;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, searchParams), {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch {
    throw new ApiError("Network request failed", "network_error");
  }

  let payload: ApiEnvelope<T>;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("Invalid server response", "invalid_response", undefined, response.status);
  }

  if (!payload.success) {
    throw new ApiError(payload.error.message, payload.error.code, payload.error.details, response.status);
  }

  return { data: payload.data, meta: payload.meta as never };
}
