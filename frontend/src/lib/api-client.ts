import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/auth.store';
import type { ApiErrorResponse, ApiResponse } from '@/types/api.types';
import type { TokenPair } from '@/types/auth.types';

/**
 * Single Axios instance for the whole app. Features never construct
 * their own HTTP clients - auth headers, token refresh, and error
 * normalization live here once.
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

/** Normalized error every feature can rely on. */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly errors: string[];

  constructor(message: string, statusCode: number, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// ---- Request: attach the access token -------------------------------------

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ---- Response: 401 -> single-flight refresh -> retry once ------------------

/** Endpoints where a 401 is a real answer, not an expired access token. */
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

const isAuthPath = (url = ''): boolean => AUTH_PATHS.some((path) => url.includes(path));

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Shared across concurrent 401s so only ONE refresh call is made. */
let refreshInFlight: Promise<string> | null = null;

async function refreshTokens(): Promise<string> {
  const { refreshToken, setTokens } = useAuthStore.getState();
  if (!refreshToken) {
    throw new ApiError('Session expired', 401);
  }

  // Bare axios: must not recurse through these interceptors.
  const response = await axios.post<ApiResponse<TokenPair>>(
    `${env.apiBaseUrl}/auth/refresh`,
    { refreshToken },
    { timeout: 15_000 },
  );

  const tokens = response.data.data;
  setTokens(tokens);
  return tokens.accessToken;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && original && !original._retry && !isAuthPath(original.url)) {
      original._retry = true;
      try {
        refreshInFlight ??= refreshTokens().finally(() => {
          refreshInFlight = null;
        });
        const accessToken = await refreshInFlight;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch {
        // Refresh failed: session is over.
        useAuthStore.getState().logout();
      }
    }

    const payload = error.response?.data;
    if (payload && payload.success === false) {
      throw new ApiError(payload.message, payload.statusCode, payload.errors ?? []);
    }
    throw new ApiError(error.message || 'Network error', status ?? 0);
  },
);

// ---- Envelope unwrapping ---------------------------------------------------

/** Unwraps the backend envelope: callers receive `data` directly. */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await promise;
  return response.data.data;
}

/** Unwraps a paginated envelope, preserving `meta`. */
export async function unwrapPaginated<T>(
  promise: Promise<{ data: ApiResponse<T[]> }>,
): Promise<{ items: T[]; meta: ApiResponse<T[]>['meta'] }> {
  const response = await promise;
  return { items: response.data.data, meta: response.data.meta };
}
