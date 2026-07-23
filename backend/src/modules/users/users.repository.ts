import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from '../../common/repositories/base.repository';
import { User, UserDocument } from './schemas/user.schema';

/**
 * Intention-revealing data access for users. The `+field` selections are
 * the single opt-in point for reading sensitive columns.
 */
@Injectable()
export class UsersRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  /** For credential verification only - includes the password hash. */
  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email: email.toLowerCase() }).select('+passwordHash').exec();
  }

  /** For refresh-token verification only - includes the refresh token hash. */
  async findByIdWithRefreshToken(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.model.findById(id).select('+refreshTokenHash').exec();
  }

  async setRefreshTokenHash(
    id: string | Types.ObjectId,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.model.updateOne({ _id: id }, { refreshTokenHash }).exec();
  }

  async emailExists(email: string): Promise<boolean> {
    return this.exists({ email: email.toLowerCase() });
  }
}
