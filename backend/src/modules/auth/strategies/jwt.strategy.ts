import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONFIG_KEY, JwtConfig } from '../../../config';
import { UsersService } from '../../users/users.service';
import { AuthenticatedUser, JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Validates Bearer access tokens. The DB lookup on each request means a
 * deactivated user is locked out immediately - not when their token expires.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<JwtConfig>(JWT_CONFIG_KEY).accessSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    // Role/tenant read from the DB, not the token: revocations and role
    // changes apply on the next request, not at token expiry.
    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      familyId: user.familyId ? user.familyId.toString() : null,
    };
  }
}
