import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../../../common/enums/gender.enum';
import { UserRole } from '../../../common/enums/user-role.enum';
import { calculateAge } from '../../../common/utils/age.util';
import { Relationship } from '../enums/relationship.enum';
import { MemberDocument } from '../schemas/member.schema';

/**
 * The only Member shape that leaves the API. `age` is computed from
 * dateOfBirth on every read - the spec's "never store age" rule.
 */
export class MemberResponseDto {
  @ApiProperty({ example: '665f1c2e8b3e4a0012345678' })
  id!: string;

  @ApiProperty({ example: '665f1c2e8b3e4a0012345678' })
  familyId!: string;

  @ApiProperty({ example: 'Sarah Doe' })
  name!: string;

  @ApiPropertyOptional({ nullable: true, example: 'sarah@gmail.com' })
  email!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '+971 50 765 4321' })
  phone!: string | null;

  @ApiProperty({ enum: Gender })
  gender!: Gender;

  @ApiProperty({ enum: Relationship })
  relationship!: Relationship;

  @ApiProperty({ example: '1992-03-08T00:00:00.000Z' })
  dateOfBirth!: Date;

  @ApiProperty({ example: 34, description: 'Derived from dateOfBirth; never stored' })
  age!: number;

  @ApiPropertyOptional({ nullable: true, example: 'Teacher' })
  occupation!: string | null;

  @ApiProperty({ example: 4500 })
  monthlyIncome!: number;

  @ApiPropertyOptional({ nullable: true })
  profileImage!: string | null;

  @ApiProperty({ enum: [UserRole.FAMILY_OWNER, UserRole.FAMILY_MEMBER] })
  role!: UserRole;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static from(member: MemberDocument): MemberResponseDto {
    const dto = new MemberResponseDto();
    dto.id = member._id.toString();
    dto.familyId = member.familyId.toString();
    dto.name = member.name;
    dto.email = member.email ?? null;
    dto.phone = member.phone ?? null;
    dto.gender = member.gender;
    dto.relationship = member.relationship;
    dto.dateOfBirth = member.dateOfBirth;
    dto.age = calculateAge(member.dateOfBirth);
    dto.occupation = member.occupation ?? null;
    dto.monthlyIncome = member.monthlyIncome;
    dto.profileImage = member.profileImage ?? null;
    dto.role = member.role;
    dto.isActive = member.isActive;
    dto.createdAt = member.createdAt;
    dto.updatedAt = member.updatedAt;
    return dto;
  }
}
