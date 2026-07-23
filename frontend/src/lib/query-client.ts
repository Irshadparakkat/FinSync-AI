import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api-client';

/**
 * Central TanStack Query configuration: sane cache lifetimes and a
 * retry policy that never retries client errors (4xx) - only network
 * and server failures.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
