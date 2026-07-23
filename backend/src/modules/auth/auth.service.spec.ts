import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

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
      passwordHash: 'hashed',
      refreshTokenHash: null,
      createdAt: new Date(),
      ...overrides,
    }) as UserDocument;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            emailExists: jest.fn(),
            createUser: jest.fn(),
            findByEmailWithPassword: jest.fn(),
            findByIdWithRefreshToken: jest.fn(),
            findByIdOrFail: jest.fn(),
            setRefreshTokenHash: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('signed-token'),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue({
              accessSecret: 'access-secret',
              accessExpiresIn: '15m',
              refreshSecret: 'refresh-secret',
              refreshExpiresIn: '7d',
            }),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    jwtService = moduleRef.get(JwtService);
  });

  describe('register', () => {
    const registerDto = { name: 'John Doe', email: 'john@gmail.com', password: 'password123' };

    it('creates a valid user and returns a success message', async () => {
      usersService.emailExists.mockResolvedValue(false);
      usersService.createUser.mockResolvedValue(mockUser());

      const result = await authService.register(registerDto);

      expect(result).toEqual({ message: 'User registered successfully' });
      expect(usersService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'John Doe', email: 'john@gmail.com' }),
      );
    });

    it('rejects duplicate emails with 409', async () => {
      usersService.emailExists.mockResolvedValue(true);

      await expect(authService.register(registerDto)).rejects.toBeInstanceOf(ConflictException);
      expect(usersService.createUser).not.toHaveBeenCalled();
    });

    it('hashes the password - plaintext is never stored', async () => {
      usersService.emailExists.mockResolvedValue(false);
      usersService.createUser.mockResolvedValue(mockUser());

      await authService.register(registerDto);

      const createArgs = usersService.createUser.mock.calls[0][0];
      expect(createArgs.passwordHash).not.toBe('password123');
      expect(await bcrypt.compare('password123', createArgs.passwordHash)).toBe(true);
    });
  });

  describe('login', () => {
    it('rejects unknown emails with the same error as wrong passwords', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'ghost@example.com', password: 'whatever' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('rejects wrong passwords', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 4);
      usersService.findByEmailWithPassword.mockResolvedValue(mockUser({ passwordHash }));

      await expect(
        authService.login({ email: 'john@gmail.com', password: 'wrong-password' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('rejects deactivated accounts even with correct credentials', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 4);
      usersService.findByEmailWithPassword.mockResolvedValue(
        mockUser({ passwordHash, isActive: false }),
      );

      await expect(
        authService.login({ email: 'john@gmail.com', password: 'correct-password' }),
      ).rejects.toThrow('Account is deactivated');
    });

    it('returns tokens at top level with user (id, name, email, role)', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 4);
      usersService.findByEmailWithPassword.mockResolvedValue(mockUser({ passwordHash, familyId }));

      const result = await authService.login({
        email: 'john@gmail.com',
        password: 'correct-password',
      });

      expect(result.accessToken).toBe('signed-token');
      expect(result.refreshToken).toBe('signed-token');
      expect(result.user).toMatchObject({
        id: userId.toString(),
        name: 'John Doe',
        email: 'john@gmail.com',
        role: UserRole.FAMILY_OWNER,
        familyId: familyId.toString(),
      });
      // stored refresh token is hashed
      expect(usersService.setRefreshTokenHash).toHaveBeenCalledWith(userId, expect.any(String));
    });

    it('embeds role and familyId claims in signed tokens', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 4);
      usersService.findByEmailWithPassword.mockResolvedValue(mockUser({ passwordHash, familyId }));

      await authService.login({ email: 'john@gmail.com', password: 'correct-password' });

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: userId.toString(),
          role: UserRole.FAMILY_OWNER,
          familyId: familyId.toString(),
        }),
        expect.any(Object),
      );
    });

    it('never exposes password or refresh hashes in the response', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 4);
      usersService.findByEmailWithPassword.mockResolvedValue(mockUser({ passwordHash }));

      const result = await authService.login({
        email: 'john@gmail.com',
        password: 'correct-password',
      });

      expect(JSON.stringify(result.user)).not.toMatch(/hash/i);
    });
  });

  describe('refresh', () => {
    const payload = {
      sub: userId.toString(),
      email: 'john@gmail.com',
      role: UserRole.FAMILY_OWNER,
      familyId: null,
    };

    it('rejects tokens that fail signature verification', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      await expect(authService.refresh('bad-token')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects a token that does not match the stored hash (rotation)', async () => {
      jwtService.verifyAsync.mockResolvedValue(payload);
      const staleHash = await bcrypt.hash('a-newer-token', 4);
      usersService.findByIdWithRefreshToken.mockResolvedValue(
        mockUser({ refreshTokenHash: staleHash }),
      );

      await expect(authService.refresh('an-older-stolen-token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('rejects refresh after logout (hash cleared)', async () => {
      jwtService.verifyAsync.mockResolvedValue(payload);
      usersService.findByIdWithRefreshToken.mockResolvedValue(mockUser({ refreshTokenHash: null }));

      await expect(authService.refresh('any-token')).rejects.toThrow('Invalid refresh token');
    });

    it('issues and stores a new pair for a valid refresh token', async () => {
      jwtService.verifyAsync.mockResolvedValue(payload);
      const currentHash = await bcrypt.hash('current-refresh-token', 4);
      usersService.findByIdWithRefreshToken.mockResolvedValue(
        mockUser({ refreshTokenHash: currentHash }),
      );

      const result = await authService.refresh('current-refresh-token');

      expect(result).toEqual({ accessToken: 'signed-token', refreshToken: 'signed-token' });
      expect(usersService.setRefreshTokenHash).toHaveBeenCalledWith(userId, expect.any(String));
    });
  });

  describe('logout', () => {
    it('clears the stored refresh token hash', async () => {
      await authService.logout(userId.toString());

      expect(usersService.setRefreshTokenHash).toHaveBeenCalledWith(userId.toString(), null);
    });
  });
});
