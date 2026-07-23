import { PartialType } from '@nestjs/swagger';
import { CreateFamilyDto } from './create-family.dto';

/**
 * All creation fields, individually optional. familyCode, ownerId,
 * membersCount and status are server-managed and never client-writable.
 */
export class UpdateFamilyDto extends PartialType(CreateFamilyDto) {}
