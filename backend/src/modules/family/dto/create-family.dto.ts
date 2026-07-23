import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO4217CurrencyCode,
  IsISO31661Alpha2,
  IsString,
  IsTimeZone,
  Length,
} from 'class-validator';
import { FAMILY } from '../constants/family.constants';

export class CreateFamilyDto {
  @ApiProperty({ example: 'The Doe Family' })
  @IsString()
  @Length(FAMILY.NAME_MIN_LENGTH, FAMILY.NAME_MAX_LENGTH)
  familyName!: string;

  @ApiProperty({ example: 'USD', description: 'ISO 4217 currency code' })
  @IsISO4217CurrencyCode()
  currency!: string;

  @ApiProperty({ example: 'AE', description: 'ISO 3166-1 alpha-2 country code' })
  @IsISO31661Alpha2()
  country!: string;

  @ApiProperty({ example: 'Asia/Dubai', description: 'IANA timezone identifier' })
  @IsTimeZone()
  timezone!: string;
}
