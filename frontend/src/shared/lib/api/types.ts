/**
 * Standard API response envelope.
 * Mirrors the backend contract defined in the foundation design doc:
 *   success -> { success: true, data, meta }
 *   error   -> { success: false, error }
 */
export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface ResponseMeta {
  pagination?: PaginationMeta;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta: ResponseMeta | null;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiErrorBody;

/** Thrown by the client when the backend returns an error envelope or a transport failure. */
export class ApiError extends Error {
  code: string;
  details?: Record<string, string[]>;
  status?: number;

  constructor(message: string, code = "unknown_error", details?: Record<string, string[]>, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}
