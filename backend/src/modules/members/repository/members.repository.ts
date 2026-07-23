import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TenantRepository } from '../../../common/repositories/tenant.repository';
import { Member, MemberDocument } from '../schemas/member.schema';

/**
 * Tenant-safe data access for members: every inherited method REQUIRES
 * a familyId, so a cross-tenant read/write is unrepresentable here.
 */
@Injectable()
export class MembersRepository extends TenantRepository<MemberDocument> {
  constructor(@InjectModel(Member.name) model: Model<MemberDocument>) {
    super(model);
  }
}
