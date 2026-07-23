import { PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from './create-member.dto';

/** Every creation field, individually optional. familyId is never client-writable. */
export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
