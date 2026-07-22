import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PAGINATION, SortOrder } from '../constants/pagination.constants';

/**
 * Reusable query DTO for every paginated list endpoint.
 * Feature DTOs extend this class and add their own filters.
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({ default: PAGINATION.DEFAULT_PAGE, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = PAGINATION.DEFAULT_PAGE;

  @ApiPropertyOptional({ default: PAGINATION.DEFAULT_LIMIT, maximum: PAGINATION.MAX_LIMIT })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION.MAX_LIMIT)
  @IsOptional()
  limit: number = PAGINATION.DEFAULT_LIMIT;

  @ApiPropertyOptional({ description: 'Field to sort by', example: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: PAGINATION.DEFAULT_SORT_ORDER })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder: SortOrder = PAGINATION.DEFAULT_SORT_ORDER;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
