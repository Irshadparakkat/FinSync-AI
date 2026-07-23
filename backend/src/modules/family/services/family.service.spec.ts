import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';
import { UserRole } from '../../../common/enums/user-role.enum';
import { AuthenticatedUser } from '../../auth/interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';
import { FAMILY } from '../constants/family.constants';
import { FamilyStatus } from '../enums/family-status.enum';
import { FamilyRepository } from '../repository/family.repository';
import { FamilyDocument } from '../schemas/family.schema';
import { FamilyService } from './family.service';

describe('FamilyService', () => {
  let familyService: FamilyService;
  let familyRepository: jest.Mocked<FamilyRepository>;
  let usersService: jest.Mocked<UsersService>;

  const familyId = new Types.ObjectId();
  const ownerId = new Types.ObjectId();

  const principal = (overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser => ({
    userId: ownerId.toString(),
    email: 'john@gmail.com',
    role: UserRole.FAMILY_OWNER,
    familyId: null,
    ...overrides,
  });

  const mockFamily = (overrides: Partial<FamilyDocument> = {}): FamilyDocument =>
    ({
      _id: familyId,
      familyName: 'The Doe Family',
      familyCode: 'FAM-7K2M9X',
      ownerId,
      currency: 'USD',
      country: 'AE',
      timezone: 'Asia/Dubai',
      membersCount: 0,
      status: FamilyStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    }) as FamilyDocument;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FamilyService,
        {
          provide: FamilyRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            codeExists: jest.fn().mockResolvedValue(false),
            adjustMembersCount: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: { assignFamily: jest.fn() },
        },
      ],
    }).compile();

    familyService = moduleRef.get(FamilyService);
    familyRepository = moduleRef.get(FamilyRepository);
    usersService = moduleRef.get(UsersService);
  });

  const createDto = {
    familyName: 'The Doe Family',
    currency: 'USD',
    country: 'AE',
    timezone: 'Asia/Dubai',
  };

  describe('createFamily', () => {
    it('creates the workspace and links the owner', async () => {
      familyRepository.create.mockResolvedValue(mockFamily());

      const result = await familyService.createFamily(principal(), createDto);

      expect(familyRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ familyName: 'The Doe Family', ownerId }),
      );
      expect(usersService.assignFamily).toHaveBeenCalledWith(ownerId.toString(), familyId);
      expect(result.familyCode).toBe('FAM-7K2M9X');
      expect(result.status).toBe(FamilyStatus.ACTIVE);
    });

    it('generates a familyCode matching the FAM-XXXXXX shape', async () => {
      familyRepository.create.mockImplementation((data) =>
        Promise.resolve(mockFamily({ familyCode: data.familyCode as string })),
      );

      const result = await familyService.createFamily(principal(), createDto);

      expect(result.familyCode).toMatch(
        new RegExp(`^${FAMILY.CODE_PREFIX}-[${FAMILY.CODE_ALPHABET}]{${FAMILY.CODE_LENGTH}}$`),
      );
    });

    it('retries code generation on collision', async () => {
      familyRepository.codeExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
      familyRepository.create.mockResolvedValue(mockFamily());

      await familyService.createFamily(principal(), createDto);

      expect(familyRepository.codeExists).toHaveBeenCalledTimes(2);
    });

    it('rejects a second workspace with 409', async () => {
      await expect(
        familyService.createFamily(principal({ familyId: familyId.toString() }), createDto),
      ).rejects.toThrow(ConflictException);
      expect(familyRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getMyFamily', () => {
    it('returns the mapped workspace', async () => {
      familyRepository.findById.mockResolvedValue(mockFamily({ membersCount: 3 }));

      const result = await familyService.getMyFamily(principal({ familyId: familyId.toString() }));

      expect(result.id).toBe(familyId.toString());
      expect(result.membersCount).toBe(3);
    });

    it('throws 404 when the workspace vanished', async () => {
      familyRepository.findById.mockResolvedValue(null);

      await expect(
        familyService.getMyFamily(principal({ familyId: familyId.toString() })),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMyFamily', () => {
    it('updates and returns the workspace', async () => {
      familyRepository.updateById.mockResolvedValue(mockFamily({ familyName: 'Renamed' }));

      const result = await familyService.updateMyFamily(
        principal({ familyId: familyId.toString() }),
        { familyName: 'Renamed' },
      );

      expect(familyRepository.updateById).toHaveBeenCalledWith(familyId.toString(), {
        familyName: 'Renamed',
      });
      expect(result.familyName).toBe('Renamed');
    });

    it('throws 404 when the workspace vanished', async () => {
      familyRepository.updateById.mockResolvedValue(null);

      await expect(
        familyService.updateMyFamily(principal({ familyId: familyId.toString() }), {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('adjustMembersCount', () => {
    it('delegates to the repository', async () => {
      await familyService.adjustMembersCount(familyId, 1);
      expect(familyRepository.adjustMembersCount).toHaveBeenCalledWith(familyId, 1);
    });
  });
});
