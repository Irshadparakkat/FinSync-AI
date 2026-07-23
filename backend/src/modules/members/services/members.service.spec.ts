import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';
import { PaginatedResult } from '../../../common/dto/paginated-result.dto';
import { Gender } from '../../../common/enums/gender.enum';
import { UserRole } from '../../../common/enums/user-role.enum';
import { FamilyService } from '../../family/services/family.service';
import { MemberQueryDto } from '../dto/member-query.dto';
import { Relationship } from '../enums/relationship.enum';
import { MembersRepository } from '../repository/members.repository';
import { MemberDocument } from '../schemas/member.schema';
import { MembersService } from './members.service';

describe('MembersService', () => {
  let membersService: MembersService;
  let membersRepository: jest.Mocked<MembersRepository>;
  let familyService: jest.Mocked<FamilyService>;

  const familyId = new Types.ObjectId();
  const memberId = new Types.ObjectId();

  const mockMember = (overrides: Partial<MemberDocument> = {}): MemberDocument =>
    ({
      _id: memberId,
      familyId,
      name: 'Sarah Doe',
      email: 'sarah@gmail.com',
      phone: '+971 50 765 4321',
      gender: Gender.FEMALE,
      relationship: Relationship.SPOUSE,
      dateOfBirth: new Date('1992-03-08'),
      occupation: 'Teacher',
      monthlyIncome: 4500,
      profileImage: null,
      role: UserRole.FAMILY_MEMBER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    }) as MemberDocument;

  const createDto = {
    name: 'Sarah Doe',
    relationship: Relationship.SPOUSE,
    gender: Gender.FEMALE,
    dateOfBirth: '1992-03-08',
    monthlyIncome: 4500,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: MembersRepository,
          useValue: {
            create: jest.fn(),
            findByIdInTenant: jest.fn(),
            paginateInTenant: jest.fn(),
            updateByIdInTenant: jest.fn(),
            deleteByIdInTenant: jest.fn(),
          },
        },
        {
          provide: FamilyService,
          useValue: { adjustMembersCount: jest.fn() },
        },
      ],
    }).compile();

    membersService = moduleRef.get(MembersService);
    membersRepository = moduleRef.get(MembersRepository);
    familyService = moduleRef.get(FamilyService);
  });

  describe('createMember (Add Member)', () => {
    it('persists the member scoped to the family and bumps membersCount', async () => {
      membersRepository.create.mockResolvedValue(mockMember());

      const result = await membersService.createMember(familyId.toString(), createDto);

      expect(membersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Sarah Doe',
          familyId: expect.any(Types.ObjectId) as unknown,
          dateOfBirth: new Date('1992-03-08'),
        }),
      );
      expect(familyService.adjustMembersCount).toHaveBeenCalledWith(familyId.toString(), 1);
      expect(result.name).toBe('Sarah Doe');
    });

    it('converts dateOfBirth to a Date and never persists age', async () => {
      membersRepository.create.mockResolvedValue(mockMember());

      await membersService.createMember(familyId.toString(), createDto);

      expect(membersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ dateOfBirth: expect.any(Date) as unknown }),
      );
      expect(membersRepository.create).not.toHaveBeenCalledWith(
        expect.objectContaining({ age: expect.anything() as unknown }),
      );
    });

    it('rejects a future dateOfBirth', async () => {
      await expect(
        membersService.createMember(familyId.toString(), {
          ...createDto,
          dateOfBirth: '2999-01-01',
        }),
      ).rejects.toThrow(BadRequestException);
      expect(membersRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findMembers (age calculation)', () => {
    it('returns paginated DTOs with derived age', async () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 30);
      dob.setMonth(dob.getMonth() - 1);
      membersRepository.paginateInTenant.mockResolvedValue(
        PaginatedResult.create([mockMember({ dateOfBirth: dob })], 1, 1, 20),
      );

      const query = Object.assign(new MemberQueryDto(), { page: 1, limit: 20 });
      const result = await membersService.findMembers(familyId.toString(), query);

      expect(result.items[0].age).toBe(30);
      expect(result.meta.totalItems).toBe(1);
    });

    it('applies escaped search and filters, always tenant-scoped', async () => {
      membersRepository.paginateInTenant.mockResolvedValue(PaginatedResult.create([], 0, 1, 20));

      const query = Object.assign(new MemberQueryDto(), {
        page: 1,
        limit: 20,
        search: 'sar(ah',
        relationship: Relationship.SPOUSE,
        isActive: true,
      });
      await membersService.findMembers(familyId.toString(), query);

      expect(membersRepository.paginateInTenant).toHaveBeenCalledWith(
        familyId.toString(),
        {
          name: { $regex: 'sar\\(ah', $options: 'i' },
          relationship: Relationship.SPOUSE,
          isActive: true,
        },
        query,
      );
    });
  });

  describe('findMemberById', () => {
    it('throws 404 for a member outside the family', async () => {
      membersRepository.findByIdInTenant.mockResolvedValue(null);

      await expect(
        membersService.findMemberById(familyId.toString(), memberId.toString()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMember (Edit Member)', () => {
    it('updates within the tenant and returns the DTO', async () => {
      membersRepository.updateByIdInTenant.mockResolvedValue(mockMember({ name: 'Updated' }));

      const result = await membersService.updateMember(familyId.toString(), memberId.toString(), {
        name: 'Updated',
      });

      expect(membersRepository.updateByIdInTenant).toHaveBeenCalledWith(
        familyId.toString(),
        memberId.toString(),
        { name: 'Updated' },
      );
      expect(result.name).toBe('Updated');
    });

    it('rejects a future dateOfBirth on update', async () => {
      await expect(
        membersService.updateMember(familyId.toString(), memberId.toString(), {
          dateOfBirth: '2999-01-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws 404 when the member is not in this family', async () => {
      membersRepository.updateByIdInTenant.mockResolvedValue(null);

      await expect(
        membersService.updateMember(familyId.toString(), memberId.toString(), { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMember (Delete Member)', () => {
    it('deletes within the tenant and decrements membersCount', async () => {
      membersRepository.deleteByIdInTenant.mockResolvedValue(mockMember());

      await membersService.deleteMember(familyId.toString(), memberId.toString());

      expect(membersRepository.deleteByIdInTenant).toHaveBeenCalledWith(
        familyId.toString(),
        memberId.toString(),
      );
      expect(familyService.adjustMembersCount).toHaveBeenCalledWith(familyId.toString(), -1);
    });

    it('throws 404 and does NOT touch the counter when nothing was deleted', async () => {
      membersRepository.deleteByIdInTenant.mockResolvedValue(null);

      await expect(
        membersService.deleteMember(familyId.toString(), memberId.toString()),
      ).rejects.toThrow(NotFoundException);
      expect(familyService.adjustMembersCount).not.toHaveBeenCalled();
    });
  });
});
