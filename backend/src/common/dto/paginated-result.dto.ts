import { PaginationMeta } from '../interfaces/api-response.interface';

/**
 * Value object returned by BaseRepository.paginate().
 * TransformInterceptor detects this class and lifts `meta`
 * to the top level of the response envelope.
 */
export class PaginatedResult<T> {
  constructor(
    public readonly items: T[],
    public readonly meta: PaginationMeta,
  ) {}

  static create<T>(
    items: T[],
    totalItems: number,
    page: number,
    limit: number,
  ): PaginatedResult<T> {
    const totalPages = limit > 0 ? Math.ceil(totalItems / limit) : 0;

    return new PaginatedResult(items, {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  }
}
