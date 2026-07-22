import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../dto/paginated-result.dto';
import { ApiResponse } from '../interfaces/api-response.interface';

/**
 * Wraps every successful controller return value in the uniform
 * ApiResponse envelope. PaginatedResult instances are unwrapped so
 * `meta` sits beside `data` instead of being nested inside it.
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<unknown>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<unknown>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((payload): ApiResponse<unknown> => {
        const base = {
          success: true as const,
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        if (payload instanceof PaginatedResult) {
          return { ...base, data: payload.items, meta: payload.meta };
        }

        return { ...base, data: payload ?? null };
      }),
    );
  }
}
