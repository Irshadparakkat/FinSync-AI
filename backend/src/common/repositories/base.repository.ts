import {
  FilterQuery,
  Model,
  ProjectionType,
  SortOrder as MongooseSortOrder,
  Types,
  UpdateQuery,
} from 'mongoose';
import { PAGINATION } from '../constants/pagination.constants';
import { PaginatedResult } from '../dto/paginated-result.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

/**
 * Generic Mongoose repository - the single place data-access mechanics live.
 * Feature repositories extend this and expose intention-revealing methods
 * (e.g. findByEmail), keeping services free of Mongoose specifics (Clean
 * Architecture: services depend on the repository abstraction, not the ODM).
 *
 * Tenant safety note: tenant-scoped repositories (added with the Workspace
 * module) will extend this with a workspaceId-enforcing subclass so a query
 * can never accidentally cross tenants.
 */
export abstract class BaseRepository<TDocument> {
  protected constructor(protected readonly model: Model<TDocument>) {}

  async create(data: Partial<TDocument>): Promise<TDocument> {
    return this.model.create(data);
  }

  async findById(
    id: string | Types.ObjectId,
    projection?: ProjectionType<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findById(id, projection).exec();
  }

  async findOne(
    filter: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findOne(filter, projection).exec();
  }

  async findAll(
    filter: FilterQuery<TDocument> = {},
    projection?: ProjectionType<TDocument>,
  ): Promise<TDocument[]> {
    return this.model.find(filter, projection).exec();
  }

  /**
   * Runs the filtered query and the total count in parallel and returns
   * items + pagination metadata in one call.
   */
  async paginate(
    filter: FilterQuery<TDocument>,
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<TDocument>> {
    const sortField = query.sortBy ?? 'createdAt';
    const sortOrder: MongooseSortOrder = query.sortOrder ?? PAGINATION.DEFAULT_SORT_ORDER;

    const [items, totalItems] = await Promise.all([
      this.model
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(query.skip)
        .limit(query.limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return PaginatedResult.create(items, totalItems, query.page, query.limit);
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async updateOne(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  async deleteById(id: string | Types.ObjectId): Promise<TDocument | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async deleteOne(filter: FilterQuery<TDocument>): Promise<TDocument | null> {
    return this.model.findOneAndDelete(filter).exec();
  }

  async count(filter: FilterQuery<TDocument> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<TDocument>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return result !== null;
  }
}
