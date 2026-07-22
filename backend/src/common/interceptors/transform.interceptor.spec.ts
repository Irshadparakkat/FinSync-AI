import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { PaginatedResult } from '../dto/paginated-result.dto';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<unknown>;

  const mockContext = (statusCode = 200, url = '/api/v1/test'): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ url }),
        getResponse: () => ({ statusCode }),
      }),
    }) as unknown as ExecutionContext;

  const mockHandler = (value: unknown): CallHandler => ({
    handle: () => of(value),
  });

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('wraps plain payloads in the success envelope', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(mockContext(), mockHandler({ id: '1' })),
    );

    expect(result).toMatchObject({
      success: true,
      statusCode: 200,
      data: { id: '1' },
      path: '/api/v1/test',
    });
    expect(result.timestamp).toEqual(expect.any(String));
    expect(result.meta).toBeUndefined();
  });

  it('lifts PaginatedResult meta beside data', async () => {
    const paginated = PaginatedResult.create([{ id: '1' }, { id: '2' }], 10, 1, 2);

    const result = await lastValueFrom(
      interceptor.intercept(mockContext(), mockHandler(paginated)),
    );

    expect(result.data).toEqual([{ id: '1' }, { id: '2' }]);
    expect(result.meta).toEqual({
      page: 1,
      limit: 2,
      totalItems: 10,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it('normalizes undefined payloads to null', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(mockContext(204), mockHandler(undefined)),
    );

    expect(result.data).toBeNull();
    expect(result.statusCode).toBe(204);
  });
});

describe('PaginatedResult.create', () => {
  it('computes boundary metadata correctly on the last page', () => {
    const result = PaginatedResult.create(['a'], 21, 3, 10);

    expect(result.meta).toEqual({
      page: 3,
      limit: 10,
      totalItems: 21,
      totalPages: 3,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });

  it('handles empty result sets', () => {
    const result = PaginatedResult.create([], 0, 1, 20);

    expect(result.meta.totalPages).toBe(0);
    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.hasPreviousPage).toBe(false);
  });
});
