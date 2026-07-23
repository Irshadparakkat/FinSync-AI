import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import { Types } from 'mongoose';
import { AuthenticatedUser } from '../../auth/interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';
import { FAMILY } from '../constants/family.constants';
import { CreateFamilyDto } from '../dto/create-family.dto';
import { FamilyResponseDto } from '../dto/family-response.dto';
import { UpdateFamilyDto } from '../dto/update-family.dto';
import { FamilyRepository } from '../repository/family.repository';

@Injectable()
export class FamilyService {
  constructor(
    private readonly familyRepository: FamilyRepository,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates the caller's Family Workspace (the tenant) and links the
   * user to it as FAMILY_OWNER. One workspace per user - a second
   * attempt is a 409.
   */
  async createFamily(user: AuthenticatedUser, dto: CreateFamilyDto): Promise<FamilyResponseDto> {
    if (user.familyId) {
      throw new ConflictException('You already belong to a family workspace');
    }

    const family = await this.familyRepository.create({
      familyName: dto.familyName,
      familyCode: await this.generateUniqueFamilyCode(),
      ownerId: new Types.ObjectId(user.userId),
      currency: dto.currency,
      country: dto.country,
      timezone: dto.timezone,
    });

    await this.usersService.assignFamily(user.userId, family._id);

    return FamilyResponseDto.from(family);
  }

  /** The caller's workspace. FamilyContextGuard guarantees familyId. */
  async getMyFamily(user: AuthenticatedUser): Promise<FamilyResponseDto> {
    const family = await this.familyRepository.findById(user.familyId as string);
    if (!family) {
      throw new NotFoundException('Family workspace not found');
    }
    return FamilyResponseDto.from(family);
  }

  /** Owner-only (enforced by @Roles on the controller). */
  async updateMyFamily(user: AuthenticatedUser, dto: UpdateFamilyDto): Promise<FamilyResponseDto> {
    const family = await this.familyRepository.updateById(user.familyId as string, { ...dto });
    if (!family) {
      throw new NotFoundException('Family workspace not found');
    }
    return FamilyResponseDto.from(family);
  }

  /** Guards financial modules: the tenant must exist and be referenced. */
  async adjustMembersCount(familyId: string | Types.ObjectId, delta: number): Promise<void> {
    await this.familyRepository.adjustMembersCount(familyId, delta);
  }

  /**
   * FAM-XXXXXX from an unambiguous alphabet via crypto randomness.
   * Uniqueness is double-guarded: a pre-check here plus the schema's
   * unique index as the race-condition backstop.
   */
  private async generateUniqueFamilyCode(): Promise<string> {
    for (let attempt = 0; attempt < FAMILY.CODE_MAX_ATTEMPTS; attempt += 1) {
      const code = this.randomFamilyCode();
      if (!(await this.familyRepository.codeExists(code))) {
        return code;
      }
    }
    throw new InternalServerErrorException('Could not allocate a unique family code');
  }

  private randomFamilyCode(): string {
    const chars = Array.from(
      { length: FAMILY.CODE_LENGTH },
      () => FAMILY.CODE_ALPHABET[randomInt(FAMILY.CODE_ALPHABET.length)],
    );
    return `${FAMILY.CODE_PREFIX}-${chars.join('')}`;
  }
}
