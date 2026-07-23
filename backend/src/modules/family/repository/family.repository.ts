import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Family, FamilyDocument } from '../schemas/family.schema';

/**
 * Data access for the tenant itself. NOT a TenantRepository - the Family
 * document IS the tenant; callers scope by its _id directly.
 */
@Injectable()
export class FamilyRepository extends BaseRepository<FamilyDocument> {
  constructor(@InjectModel(Family.name) model: Model<FamilyDocument>) {
    super(model);
  }

  async codeExists(familyCode: string): Promise<boolean> {
    return this.exists({ familyCode });
  }

  /** Atomic counter update - two concurrent member writes can not race. */
  async adjustMembersCount(familyId: string | Types.ObjectId, delta: number): Promise<void> {
    await this.model.updateOne({ _id: familyId }, { $inc: { membersCount: delta } }).exec();
  }
}
