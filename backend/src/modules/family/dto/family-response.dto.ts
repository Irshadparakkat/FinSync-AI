import { ApiProperty } from '@nestjs/swagger';
import { FamilyStatus } from '../enums/family-status.enum';
import { FamilyDocument } from '../schemas/family.schema';

/** The only Family shape that leaves the API (explicit allowlist). */
export class FamilyResponseDto {
  @ApiProperty({ example: '665f1c2e8b3e4a0012345678' })
  id!: string;

  @ApiProperty({ example: 'The Doe Family' })
  familyName!: string;

  @ApiProperty({ example: 'FAM-7K2M9X' })
  familyCode!: string;

  @ApiProperty({ example: '665f1c2e8b3e4a0012345678' })
  ownerId!: string;

  @ApiProperty({ example: 'USD' })
  currency!: string;

  @ApiProperty({ example: 'AE' })
  country!: string;

  @ApiProperty({ example: 'Asia/Dubai' })
  timezone!: string;

  @ApiProperty({ example: 4 })
  membersCount!: number;

  @ApiProperty({ enum: FamilyStatus, example: FamilyStatus.ACTIVE })
  status!: FamilyStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static from(family: FamilyDocument): FamilyResponseDto {
    const dto = new FamilyResponseDto();
    dto.id = family._id.toString();
    dto.familyName = family.familyName;
    dto.familyCode = family.familyCode;
    dto.ownerId = family.ownerId.toString();
    dto.currency = family.currency;
    dto.country = family.country;
    dto.timezone = family.timezone;
    dto.membersCount = family.membersCount;
    dto.status = family.status;
    dto.createdAt = family.createdAt;
    dto.updatedAt = family.updatedAt;
    return dto;
  }
}
