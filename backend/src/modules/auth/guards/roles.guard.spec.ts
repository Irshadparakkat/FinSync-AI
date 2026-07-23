import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../common/enums/user-role.enum';
import { AuthenticatedUser } from '../interfaces/jwt-payload.interface';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  const mockContext = (user?: AuthenticatedUser): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    }) as unknown as ExecutionContext;

  const principal = (role: UserRole): AuthenticatedUser => ({
    userId: 'user-1',
    email: 'john@gmail.com',
    role,
    familyId: null,
  });

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows routes without @Roles() metadata', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    expect(guard.canActivate(mockContext(principal(UserRole.FAMILY_MEMBER)))).toBe(true);
  });

  it('allows a user whose role is listed', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.FAMILY_OWNER]);

    expect(guard.canActivate(mockContext(principal(UserRole.FAMILY_OWNER)))).toBe(true);
  });

  it('throws 403 Forbidden for a role that is not listed', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.SUPER_ADMIN]);

    expect(() => guard.canActivate(mockContext(principal(UserRole.FAMILY_MEMBER)))).toThrow(
      ForbiddenException,
    );
  });

  it('throws 403 when no principal is attached', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.FAMILY_OWNER]);

    expect(() => guard.canActivate(mockContext(undefined))).toThrow(ForbiddenException);
  });
});
