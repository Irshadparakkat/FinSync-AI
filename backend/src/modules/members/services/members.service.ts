import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { PaginatedResult } from '../../../common/dto/paginated-result.dto';
import { isFutureDate } from '../../../common/utils/age.util';
import { escapeRegex } from '../../../common/utils/regex.util';
import { FamilyService } from '../../family/services/family.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberQueryDto } from '../dto/member-query.dto';
import { MemberResponseDto } from '../dto/member-response.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { MembersRepository } from '../repository/members.repository';
import { MemberDocument } from '../schemas/member.schema';

/**
 * Member management, always scoped to ONE family. Every method takes the
 * caller's familyId (from the JWT principal, never the request body) and
 * the tenant-enforcing repository does the rest.
 */
@Injectable()
export class MembersService {
  constructor(
    private readonly membersRepository: MembersRepository,
    private readonly familyService: FamilyService,
  ) {}

  async createMember(familyId: string, dto: CreateMemberDto): Promise<MemberResponseDto> {
    // Tenant comes from the JWT principal - the DTO has no familyId field
    // and the global whitelist pipe strips any injected one.
    const member = await this.membersRepository.create({
      ...this.mapDto(dto),
      familyId: new Types.ObjectId(familyId),
    });

    await this.familyService.adjustMembersCount(familyId, 1);
    return MemberResponseDto.from(member);
  }

  async findMembers(
    familyId: string,
    query: MemberQueryDto,
  ): Promise<PaginatedResult<MemberResponseDto>> {
    const filter: FilterQuery<MemberDocument> = {};

    if (query.search) {
      filter.name = { $regex: escapeRegex(query.search), $options: 'i' };
    }
    if (query.relationship) {
      filter.relationship = query.relationship;
    }
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    const result = await this.membersRepository.paginateInTenant(familyId, filter, query);
    return new PaginatedResult(
      result.items.map((item) => MemberResponseDto.from(item)),
      result.meta,
    );
  }

  async findMemberById(familyId: string, memberId: string): Promise<MemberResponseDto> {
    const member = await this.membersRepository.findByIdInTenant(familyId, memberId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return MemberResponseDto.from(member);
  }

  async updateMember(
    familyId: string,
    memberId: string,
    dto: UpdateMemberDto,
  ): Promise<MemberResponseDto> {
    const member = await this.membersRepository.updateByIdInTenant(
      familyId,
      memberId,
      this.mapDto(dto),
    );
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return MemberResponseDto.from(member);
  }

  async deleteMember(familyId: string, memberId: string): Promise<void> {
    const deleted = await this.membersRepository.deleteByIdInTenant(familyId, memberId);
    if (!deleted) {
      throw new NotFoundException('Member not found');
    }
    await this.familyService.adjustMembersCount(familyId, -1);
  }

  /** ISO string -> Date with a future-date sanity check; age is never stored. */
  private mapDto(dto: CreateMemberDto | UpdateMemberDto): Partial<MemberDocument> {
    const { dateOfBirth, ...rest } = dto;
    const mapped: Record<string, unknown> = { ...rest };

    if (dateOfBirth !== undefined) {
      const parsed = new Date(dateOfBirth);
      if (isFutureDate(parsed)) {
        throw new BadRequestException('dateOfBirth cannot be in the future');
      }
      mapped.dateOfBirth = parsed;
    }

    return mapped;
  }
}
