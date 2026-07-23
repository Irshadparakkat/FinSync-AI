import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { VALIDATION } from '../../../common/constants/validation.constants';
import { Gender } from '../../../common/enums/gender.enum';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Relationship } from '../enums/relationship.enum';

export class CreateMemberDto {
  @ApiProperty({ example: 'Sarah Doe' })
  @IsString()
  @Length(VALIDATION.NAME_MIN_LENGTH, VALIDATION.NAME_MAX_LENGTH)
  name!: string;

  @ApiProperty({ enum: Relationship, example: Relationship.SPOUSE })
  @IsEnum(Relationship)
  relationship!: Relationship;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({ example: '1992-03-08', description: 'ISO date; must not be in the future' })
  @IsISO8601()
  dateOfBirth!: string;

  @ApiPropertyOptional({ example: 'Teacher' })
  @IsString()
  @MaxLength(VALIDATION.NAME_MAX_LENGTH)
  @IsOptional()
  occupation?: string;

  @ApiPropertyOptional({ example: 4500, minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  monthlyIncome?: number;

  @ApiPropertyOptional({ example: '+971 50 765 4321' })
  @Matches(VALIDATION.PHONE_REGEX, { message: 'phone must be a valid phone number' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'sarah@gmail.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'https URL or base64 data URI' })
  @IsString()
  @MaxLength(VALIDATION.PROFILE_IMAGE_MAX_LENGTH)
  @Matches(VALIDATION.PROFILE_IMAGE_REGEX, {
    message: 'profileImage must be an https URL or an image data URI',
  })
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional({
    enum: [UserRole.FAMILY_OWNER, UserRole.FAMILY_MEMBER],
    default: UserRole.FAMILY_MEMBER,
  })
  @IsIn([UserRole.FAMILY_OWNER, UserRole.FAMILY_MEMBER])
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
