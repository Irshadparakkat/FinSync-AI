import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../common/enums/user-role.enum';

export const ROLES_KEY = 'roles';

/**
 * Restricts a route to the given roles:
 *   @Roles(UserRole.FAMILY_OWNER)
 * Routes without @Roles() are open to any authenticated user.
 */
export const Roles = (...roles: UserRole[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);
