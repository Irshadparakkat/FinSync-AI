/**
 * Mirrors the backend's uniform response envelope
 * (backend/src/common/interfaces/api-response.interface.ts).
 * Every API call in the app is typed against these shapes.
 */

export interface ApiResponse<T> {
  success: true;
  statusCode: number;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
  path: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp: string;
  path: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
