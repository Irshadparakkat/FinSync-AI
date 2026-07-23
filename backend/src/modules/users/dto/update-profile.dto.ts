import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsISO31661Alpha2,
  IsOptional,
  IsString,
  IsTimeZone,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { VALIDATION } from '../../../common/constants/validation.constants';
import { Gender } from '../../../common/enums/gender.enum';

/**
 * Self-service profile update. Email, role, familyId and isActive are
 * deliberately NOT here - identity and authorization fields change only
 * through their own dedicated flows.
 */
export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @Length(VALIDATION.NAME_MIN_LENGTH, VALIDATION.NAME_MAX_LENGTH)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '+971 50 123 4567' })
  @Matches(VALIDATION.PHONE_REGEX, { message: 'phone must be a valid phone number' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({
    example: '1990-05-14',
    description: 'ISO date; must not be in the future',
  })
  @IsISO8601()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'https URL or base64 data URI' })
  @IsString()
  @MaxLength(VALIDATION.PROFILE_IMAGE_MAX_LENGTH)
  @Matches(VALIDATION.PROFILE_IMAGE_REGEX, {
    message: 'profileImage must be an https URL or an image data URI',
  })
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional({ example: 'AE', description: 'ISO 3166-1 alpha-2 country code' })
  @IsISO31661Alpha2()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'Asia/Dubai', description: 'IANA timezone identifier' })
  @IsTimeZone()
  @IsOptional()
  timezone?: string;
}
