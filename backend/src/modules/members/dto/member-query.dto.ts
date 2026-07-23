import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { VALIDATION } from '../../../common/constants/validation.constants';
import { Relationship } from '../enums/relationship.enum';

/** Pagination + member-specific list filters. */
export class MemberQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Case-insensitive name search' })
  @IsString()
  @MaxLength(VALIDATION.NAME_MAX_LENGTH)
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: Relationship })
  @IsEnum(Relationship)
  @IsOptional()
  relationship?: Relationship;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value as unknown;
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
