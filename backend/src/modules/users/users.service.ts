import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types, UpdateQuery } from 'mongoose';
import { UserRole } from '../../common/enums/user-role.enum';
import { isFutureDate } from '../../common/utils/age.util';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersRepository } from './users.repository';
import { UserDocument } from './schemas/user.schema';

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

/**
 * Domain operations on users. Auth (and later Workspaces) depend on this
 * service - never on the repository or schema directly.
 */
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(data: CreateUserData): Promise<UserDocument> {
    return this.usersRepository.create(data);
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.usersRepository.findById(id);
  }

  async findByIdOrFail(id: string | Types.ObjectId): Promise<UserDocument> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findByEmailWithPassword(email);
  }

  async findByIdWithRefreshToken(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.usersRepository.findByIdWithRefreshToken(id);
  }

  async setRefreshTokenHash(
    id: string | Types.ObjectId,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.usersRepository.setRefreshTokenHash(id, refreshTokenHash);
  }

  async emailExists(email: string): Promise<boolean> {
    return this.usersRepository.emailExists(email);
  }

  /**
   * Self-service profile update. dateOfBirth arrives as an ISO string
   * (DTO) and is converted + sanity-checked here; age is never stored.
   */
  async updateProfile(id: string | Types.ObjectId, dto: UpdateProfileDto): Promise<UserDocument> {
    const { dateOfBirth, ...rest } = dto;
    const update: UpdateQuery<UserDocument> = { ...rest };

    if (dateOfBirth !== undefined) {
      const parsed = new Date(dateOfBirth);
      if (isFutureDate(parsed)) {
        throw new BadRequestException('dateOfBirth cannot be in the future');
      }
      update.dateOfBirth = parsed;
    }

    const user = await this.usersRepository.updateById(id, update);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Links a user to their newly created Family Workspace and promotes
   * them to owner. Called by FamilyService inside the creation flow.
   */
  async assignFamily(id: string | Types.ObjectId, familyId: Types.ObjectId): Promise<void> {
    await this.usersRepository.updateById(id, { familyId, role: UserRole.FAMILY_OWNER });
  }
}
