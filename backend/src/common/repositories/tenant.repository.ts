import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { PaginatedResult } from '../dto/paginated-result.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { BaseRepository } from './base.repository';

/**
 * Tenant-enforcing repository base (the subclass promised in
 * BaseRepository's docs). Every public method REQUIRES a familyId and
 * merges it into the filter, so a tenant-scoped query can never
 * accidentally cross workspaces - forgetting the scope is a compile
 * error, not a security bug.
 */
export abstract class TenantRepository<TDocument> extends BaseRepository<TDocument> {
  protected constructor(model: Model<TDocument>) {
    super(model);
  }

  private scoped(
    familyId: string | Types.ObjectId,
    filter: FilterQuery<TDocument> = {},
  ): FilterQuery<TDocument> {
    return { ...filter, familyId: new Types.ObjectId(familyId) };
  }

  async findByIdInTenant(
    familyId: string | Types.ObjectId,
    id: string | Types.ObjectId,
  ): Promise<TDocument | null> {
    return this.model.findOne(this.scoped(familyId, { _id: id })).exec();
  }

  async paginateInTenant(
    familyId: string | Types.ObjectId,
    filter: FilterQuery<TDocument>,
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<TDocument>> {
    return this.paginate(this.scoped(familyId, filter), query);
  }

  async updateByIdInTenant(
    familyId: string | Types.ObjectId,
    id: string | Types.ObjectId,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    return this.model
      .findOneAndUpdate(this.scoped(familyId, { _id: id }), update, { new: true })
      .exec();
  }

  async deleteByIdInTenant(
    familyId: string | Types.ObjectId,
    id: string | Types.ObjectId,
  ): Promise<TDocument | null> {
    return this.model.findOneAndDelete(this.scoped(familyId, { _id: id })).exec();
  }

  async countInTenant(
    familyId: string | Types.ObjectId,
    filter: FilterQuery<TDocument> = {},
  ): Promise<number> {
    return this.count(this.scoped(familyId, filter));
  }
}
