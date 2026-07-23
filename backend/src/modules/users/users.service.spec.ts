import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Gender } from '../../common/enums/gender.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import { UsersRepository } from './users.repository';
import { UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  const userId = new Types.ObjectId();
  const familyId = new Types.ObjectId();

  const mockUser = (overrides: Partial<UserDocument> = {}): UserDocument =>
    ({
      _id: userId,
      name: 'John Doe',
      email: 'john@gmail.com',
      role: UserRole.FAMILY_OWNER,
      familyId: null,
      isActive: true,
      phone: null,
      gender: null,
      dateOfBirth: null,
      profileImage: null,
      country: null,
      timezone: null,
      createdAt: new Date(),
      ...overrides,
    }) as UserDocument;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            updateById: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = moduleRef.get(UsersService);
    usersRepository = moduleRef.get(UsersRepository);
  });

  describe('updateProfile (Edit Profile)', () => {
    it('updates profile fields and converts dateOfBirth to a Date', async () => {
      usersRepository.updateById.mockResolvedValue(
        mockUser({ phone: '+971 50 123 4567', gender: Gender.MALE }),
      );

      await usersService.updateProfile(userId, {
        phone: '+971 50 123 4567',
        gender: Gender.MALE,
        dateOfBirth: '1990-05-14',
      });

      expect(usersRepository.updateById).toHaveBeenCalledWith(userId, {
        phone: '+971 50 123 4567',
        gender: Gender.MALE,
        dateOfBirth: new Date('1990-05-14'),
      });
    });

    it('rejects a future dateOfBirth', async () => {
      await expect(
        usersService.updateProfile(userId, { dateOfBirth: '2999-01-01' }),
      ).rejects.toThrow(BadRequestException);
      expect(usersRepository.updateById).not.toHaveBeenCalled();
    });

    it('throws 404 for an unknown user', async () => {
      usersRepository.updateById.mockResolvedValue(null);

      await expect(usersService.updateProfile(userId, { name: 'New Name' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('assignFamily', () => {
    it('links the user to the workspace and promotes to FAMILY_OWNER', async () => {
      usersRepository.updateById.mockResolvedValue(mockUser({ familyId }));

      await usersService.assignFamily(userId, familyId);

      expect(usersRepository.updateById).toHaveBeenCalledWith(userId, {
        familyId,
        role: UserRole.FAMILY_OWNER,
      });
    });
  });
});
