import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JWT_CONFIG_KEY, JwtConfig } from '../../config';
import { MessageResponseDto } from '../../common/dto/message-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AUTH } from './constants/auth.constants';
import { LoginResponseDto, TokenPairDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.jwtConfig = configService.getOrThrow<JwtConfig>(JWT_CONFIG_KEY);
  }

  async register(dto: RegisterDto): Promise<MessageResponseDto> {
    if (await this.usersService.emailExists(dto.email)) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, AUTH.BCRYPT_SALT_ROUNDS);

    await this.usersService.createUser({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    return new MessageResponseDto('User registered successfully');
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    // Same error for unknown email and wrong password - no user enumeration.
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const tokens = await this.issueTokens(user);
    return { ...tokens, user: UserResponseDto.from(user) };
  }

  /**
   * Refresh token rotation: the presented token is verified against the
   * stored hash, then replaced. A stolen-and-reused old token stops
   * matching and is rejected.
   */
  async refresh(refreshToken: string): Promise<TokenPairDto> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findByIdWithRefreshToken(payload.sub);

    if (
      !user ||
      !user.isActive ||
      !user.refreshTokenHash ||
      !(await bcrypt.compare(refreshToken, user.refreshTokenHash))
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.setRefreshTokenHash(userId, null);
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByIdOrFail(userId);
    return UserResponseDto.from(user);
  }

  private async issueTokens(user: UserDocument): Promise<TokenPairDto> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      familyId: user.familyId ? user.familyId.toString() : null,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, this.jwtConfig.accessSecret, this.jwtConfig.accessExpiresIn),
      this.signToken(payload, this.jwtConfig.refreshSecret, this.jwtConfig.refreshExpiresIn),
    ]);

    // Stored hashed, like a password: a DB leak exposes no usable tokens.
    const refreshTokenHash = await bcrypt.hash(refreshToken, AUTH.BCRYPT_SALT_ROUNDS);
    await this.usersService.setRefreshTokenHash(user._id, refreshTokenHash);

    return { accessToken, refreshToken };
  }

  private signToken(payload: JwtPayload, secret: string, expiresIn: string): Promise<string> {
    // Config validates expiry strings; the ms.StringValue template type
    // cannot be expressed in env config, hence the single cast here.
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.jwtConfig.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
