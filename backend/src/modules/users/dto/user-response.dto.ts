import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../../../common/enums/gender.enum';
import { UserRole } from '../../../common/enums/user-role.enum';
import { calculateAge } from '../../../common/utils/age.util';
import { UserDocument } from '../schemas/user.schema';

/**
 * The ONLY user shape that leaves the API. Mapping is explicit
 * (allowlist, not blocklist) so new schema fields are private by default.
 * `age` is computed from dateOfBirth on every read - never persisted.
 */
export class UserResponseDto {
  @ApiProperty({ example: '665f1c2e8b3e4a0012345678' })
  id!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'john@gmail.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.FAMILY_OWNER })
  role!: UserRole;

  @ApiProperty({
    nullable: true,
    example: null,
    description: 'Tenant id; null until a workspace exists',
  })
  familyId!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiPropertyOptional({ nullable: true, example: '+971 50 123 4567' })
  phone!: string | null;

  @ApiPropertyOptional({ enum: Gender, nullable: true })
  gender!: Gender | null;

  @ApiPropertyOptional({ nullable: true, example: '1990-05-14T00:00:00.000Z' })
  dateOfBirth!: Date | null;

  @ApiPropertyOptional({ nullable: true, description: 'Derived from dateOfBirth; never stored' })
  age!: number | null;

  @ApiPropertyOptional({ nullable: true })
  profileImage!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'AE' })
  country!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'Asia/Dubai' })
  timezone!: string | null;

  @ApiProperty()
  createdAt!: Date;

  static from(user: UserDocument): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user._id.toString();
    dto.name = user.name;
    dto.email = user.email;
    dto.role = user.role;
    dto.familyId = user.familyId ? user.familyId.toString() : null;
    dto.isActive = user.isActive;
    dto.phone = user.phone ?? null;
    dto.gender = user.gender ?? null;
    dto.dateOfBirth = user.dateOfBirth ?? null;
    dto.age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;
    dto.profileImage = user.profileImage ?? null;
    dto.country = user.country ?? null;
    dto.timezone = user.timezone ?? null;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
