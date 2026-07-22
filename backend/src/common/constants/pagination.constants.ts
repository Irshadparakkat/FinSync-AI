/** Single source of truth for pagination behavior across all list endpoints. */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_SORT_ORDER: 'desc',
} as const;

export type SortOrder = 'asc' | 'desc';
